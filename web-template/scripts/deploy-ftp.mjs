#!/usr/bin/env node
/**
 * Publishes the static export to a client's own shared hosting over FTPS.
 *
 *   pnpm deploy-ftp --dry-run        print the plan, connect to nothing
 *   pnpm deploy-ftp --check          connect, list the remote root, suggest the
 *                                    web root, upload nothing
 *   pnpm deploy-ftp                  upload out/ to the remote directory
 *   pnpm deploy-ftp --allow-demo     upload a demo build (staging only)
 *
 * This is the path for a client who already pays for hosting: nothing in DNS
 * moves, so their email keeps working, and the site replaces whatever was in
 * the web root. The alternative is a preview host — see DECISIONS.md.
 *
 * Credentials come from the environment or a git-ignored .env.local, never
 * from a file under clients/ or src/:
 *
 *   FTP_HOST=ftp.example.pl
 *   FTP_USER=...
 *   FTP_PASSWORD=...
 *   FTP_REMOTE_DIR=/public_html        (default: /)
 *   FTP_PORT=21                        (default: 21)
 *   FTP_SECURE=true                    (default: true — explicit FTPS)
 *
 * When the build's assistant posts to chat.php, the handler is generated and
 * uploaded too, and these write .chat-secret.php one directory above the
 * web root:
 *
 *   CHATBOT_API_KEY=...                (one key per client — spend per client)
 *   CHATBOT_MODEL=claude-haiku-4-5
 *   CHATBOT_DAILY_LIMIT=400
 *
 * The upload overwrites and adds; it never deletes. Clear the web root by
 * hand, after a backup, when replacing an old site — leaving a dead
 * WordPress install next to the new files is a security liability, not just
 * clutter.
 */

import { Readable } from "node:stream";
import path from "node:path";
import process from "node:process";
import { Client } from "basic-ftp";
import { loadDotEnv } from "./lib/env.mjs";
import { chatSecret } from "./lib/chat-handler.mjs";
import {
  fail,
  readBuild,
  walk,
  sizeOf,
  prepareServerFiles,
  describe,
  verifyLive,
} from "./lib/build.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");

const has = (flag) => process.argv.includes(flag);
function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
    ? process.argv[i + 1]
    : fallback;
}

async function main() {
  await loadDotEnv(ROOT);

  const build = await readBuild(OUT_DIR);
  const remoteDir = arg("--remote", process.env.FTP_REMOTE_DIR ?? "/");
  const dryRun = has("--dry-run");

  const chat = await prepareServerFiles(OUT_DIR, build, {
    allowDemo: has("--allow-demo"),
  });
  const files = await walk(OUT_DIR);
  const bytes = await sizeOf(files);

  console.log(`\n${dryRun ? "DRY RUN — " : ""}Deploying to ${build.baseUrl}`);
  describe(build, chat, {
    files: files.length,
    bytes,
    target: `FTP ${remoteDir}`,
  });

  if (dryRun) {
    console.log(`\n  out/.htaccess written. Nothing was uploaded.\n`);
    return;
  }

  const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env;
  if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
    fail(
      "Set FTP_HOST, FTP_USER and FTP_PASSWORD in the environment or .env.local.",
    );
  }
  const secure = (process.env.FTP_SECURE ?? "true") !== "false";
  if (!secure) {
    console.log(
      "\n  WARNING: FTP_SECURE=false — the password crosses the network in clear text.",
    );
  }

  const client = new Client(30_000);
  try {
    if (has("--check")) {
      await client.access({
        host: FTP_HOST,
        port: Number(process.env.FTP_PORT ?? 21),
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure,
        secureOptions: { rejectUnauthorized: false },
      });
      console.log(`\n  connected to ${FTP_HOST} as ${FTP_USER}`);
      const entries = await client.list("/");
      console.log("  remote root:");
      for (const e of entries)
        console.log(`    ${e.isDirectory ? "d" : "-"} ${e.name}`);
      // The two layouts shared hosts use: cPanel-style public_html at the
      // root, or DirectAdmin-style domains/<domain>/public_html.
      const names = entries.map((e) => e.name);
      let guess = null;
      if (names.includes("public_html")) guess = "/public_html";
      else if (names.includes("domains")) {
        const domains = await client.list("/domains");
        const host = new URL(build.baseUrl).host.replace(/^www\./, "");
        const match =
          domains.find((d) => d.name === host) ??
          domains.find((d) => d.isDirectory);
        if (match) guess = `/domains/${match.name}/public_html`;
      } else if (names.includes("httpdocs")) guess = "/httpdocs";
      else if (names.includes("index.php") || names.includes("wp-config.php"))
        guess = "/";
      console.log(
        guess
          ? `\n  web root looks like: FTP_REMOTE_DIR=${guess}\n`
          : "\n  could not tell the web root — look for the directory holding the old site\n",
      );
      if (guess) {
        const web = await client.list(guess);
        const wp = web.some((e) => e.name === "wp-config.php");
        console.log(
          `  ${guess} holds ${web.length} entries${wp ? " — a WordPress install; clear it before the upload" : ""}\n`,
        );
      }
      return;
    }
    await client.access({
      host: FTP_HOST,
      port: Number(process.env.FTP_PORT ?? 21),
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure,
      secureOptions: { rejectUnauthorized: false },
    });
    console.log(`\n  connected to ${FTP_HOST}`);
    await client.ensureDir(remoteDir);
    await client.uploadFromDir(OUT_DIR);
    console.log("  upload finished");

    if (chat?.apiKey) {
      // One level above the web root when there is one; a .php file that
      // returns a value outputs nothing even if it ends up inside it.
      const parent = path.posix.dirname(remoteDir.replace(/\/+$/, "") || "/");
      const secretPath = path.posix.join(
        parent === remoteDir ? remoteDir : parent,
        ".chat-secret.php",
      );
      await client.uploadFrom(Readable.from([chatSecret(chat)]), secretPath);
      console.log(`  assistant secret written to ${secretPath}`);
    }
  } catch (error) {
    fail(`FTP failed: ${error.message}`);
  } finally {
    client.close();
  }

  await verifyLive(
    build,
    "Usually the web root is elsewhere — check FTP_REMOTE_DIR.",
  );
}

main().catch((error) => fail(error.stack ?? String(error)));
