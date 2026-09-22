/**
 * What a finished `out/` says about itself, and the server-side files every
 * shared-hosting deploy ships next to it. Shared by deploy-ftp and
 * deploy-cpanel so the two transports cannot drift.
 */

import { readFile, readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { htaccess } from "./htaccess.mjs";
import { formHandler } from "./form-handler.mjs";
import { chatHandler } from "./chat-handler.mjs";

export function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

/** What the build itself says about where it is going and whether it is a demo. */
export async function readBuild(outDir) {
  let index;
  try {
    index = await readFile(path.join(outDir, "index.html"), "utf8");
  } catch {
    fail("No out/ yet. Run `pnpm build` first.");
  }

  const canonical = index.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical)
    fail("No canonical URL in out/index.html — is this a finished build?");

  const title = index.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const noindex = /content="noindex/.test(index);
  const siteName =
    index.match(/property="og:site_name" content="([^"]+)"/)?.[1] ?? "";
  const email = index.match(/mailto:([^"?]+)/)?.[1] ?? "";

  // The form's endpoint is a config value baked into the page, so the build
  // itself says whether this deploy needs a PHP handler shipped with it.
  let postsToPhp = /\/form\.php/.test(index);
  if (!postsToPhp) {
    try {
      postsToPhp = /\/form\.php/.test(
        await readFile(path.join(outDir, "contact", "index.html"), "utf8"),
      );
    } catch {
      /* a site without a contact page */
    }
  }

  const hasChat = /\/chat\.php/.test(index);

  let robots = "";
  try {
    robots = await readFile(path.join(outDir, "robots.txt"), "utf8");
  } catch {
    /* a server-mode build has no robots.txt on disk */
  }

  return {
    baseUrl: new URL(canonical).origin,
    title,
    siteName,
    email,
    postsToPhp,
    hasChat,
    isDemo: noindex || /Disallow:\s*\/\s*$/m.test(robots),
  };
}

export async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

export async function sizeOf(files) {
  const sizes = await Promise.all(
    files.map((f) => stat(f).then((s) => s.size)),
  );
  return sizes.reduce((a, b) => a + b, 0);
}

/**
 * Refuses a demo build unless told otherwise, then writes .htaccess, form.php
 * and chat.php into out/ from what the build says. Returns the assistant's
 * secret config (null when the site has no assistant).
 */
export async function prepareServerFiles(
  outDir,
  build,
  { allowDemo = false, env = process.env } = {},
) {
  if (build.isDemo && !allowDemo) {
    fail(
      `This build is in demo mode — noindex, and robots.txt blocks everything.\n` +
        `Uploading it to a client's own domain publishes a site Google will never\n` +
        `index, under a preview banner. Set demo.enabled to false in the client's\n` +
        `config and rebuild, or pass --allow-demo if this really is a staging host.`,
    );
  }

  // The server config is generated from the build, so the canonical host in
  // the redirect can never drift from the one in the pages.
  await writeFile(
    path.join(outDir, ".htaccess"),
    htaccess({ baseUrl: build.baseUrl }),
    "utf8",
  );

  if (build.postsToPhp) {
    if (!build.email) {
      fail(
        "The form posts to form.php but the build has no contact email to deliver to.",
      );
    }
    await writeFile(
      path.join(outDir, "form.php"),
      formHandler({
        to: build.email,
        siteName: build.siteName || new URL(build.baseUrl).host,
        subject: `Zapytanie ze strony ${new URL(build.baseUrl).host}`,
      }),
      "utf8",
    );
  }

  if (!build.hasChat) return null;
  await writeFile(path.join(outDir, "chat.php"), chatHandler(), "utf8");
  return {
    apiKey: env.CHATBOT_API_KEY ?? "",
    model: env.CHATBOT_MODEL ?? "claude-haiku-4-5",
    dailyLimit: env.CHATBOT_DAILY_LIMIT ?? "400",
    apiBase: env.CHATBOT_API_BASE ?? "https://api.anthropic.com",
  };
}

export function describe(build, chat, { files, bytes, target }) {
  console.log(`  ${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  target: ${target}`);
  console.log(`  demo mode: ${build.isDemo ? "ON (staging)" : "off"}`);
  console.log(
    `  contact form: ${build.postsToPhp ? `form.php → ${build.email}` : "third-party endpoint or none"}`,
  );
  if (chat) {
    console.log(
      `  assistant: chat.php → ${chat.model}, ${chat.dailyLimit}/day` +
        (chat.apiKey
          ? ""
          : '  (CHATBOT_API_KEY missing — it will answer "unavailable" until set)'),
    );
  }
}

/** Nothing proves a deploy like the live URL answering with the new page. */
export async function verifyLive(build, hint) {
  try {
    const response = await fetch(`${build.baseUrl}/?cachebust=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    const live = await response.text();
    const liveTitle = live.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    if (liveTitle === build.title) {
      console.log(`\n  ✓ ${build.baseUrl} is serving the new site\n`);
      return true;
    }
    console.log(
      `\n  ! ${build.baseUrl} answered ${response.status} with a different page.\n` +
        `    Live title:  ${liveTitle || "(none)"}\n` +
        `    Expected:    ${build.title}\n` +
        (hint ? `    ${hint}\n` : ""),
    );
  } catch (error) {
    console.log(`\n  ! Could not verify ${build.baseUrl}: ${error.message}\n`);
  }
  return false;
}
