#!/usr/bin/env node
/**
 * Publishes the static export to a client's cPanel hosting through the cPanel
 * API — for when FTP is closed from where the deploy runs, or when all the
 * client can give you is their cPanel login.
 *
 *   pnpm deploy-cpanel --dry-run     print the plan, connect to nothing
 *   pnpm deploy-cpanel --check       log in, find the web root, say what is in it
 *   pnpm deploy-cpanel               archive out/, upload it, move the old web
 *                                    root aside, extract, write the assistant secret
 *   pnpm deploy-cpanel --keep-old    extract over what is there instead of moving it
 *   pnpm deploy-cpanel --allow-demo  upload a demo build (staging only)
 *
 * Credentials come from the environment or a git-ignored .env.local:
 *
 *   CPANEL_URL=https://example.pl:2083    cPanel itself. When port 2083 is closed
 *                                         from here, the server's hostname on 443
 *                                         (https://srv10.host.pl) plus CPANEL_HOST.
 *   CPANEL_HOST=cpanel.example.pl         optional Host header: cPanel's proxy
 *                                         subdomain, which Apache serves on 443
 *   CPANEL_USER=...                       the account name shown in cPanel
 *   CPANEL_TOKEN=...                      an API token (cPanel → Security →
 *                                         Manage API Tokens); or
 *   CPANEL_PASSWORD=...                   the account password — a session login
 *   CPANEL_REMOTE_DIR=/home/u/public_html optional; found from the domain otherwise
 *
 * CHATBOT_* are read exactly as in deploy-ftp, and .chat-secret.php is written
 * one directory above the web root.
 *
 * The old web root is renamed to <root>.old-<stamp>, not deleted, and a fresh
 * one is created — a dead WordPress next to the new files would still answer
 * on /wp-login.php. Everything goes through curl, which honours the proxy and
 * CA settings of the machine it runs on.
 */

import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
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

const run = promisify(execFile);
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const has = (flag) => process.argv.includes(flag);

/** One cPanel account reached through curl: token auth, or a session login. */
class Cpanel {
  constructor({ url, host, user, token, password }) {
    this.base = url.replace(/\/+$/, "");
    this.host = host;
    this.user = user;
    this.token = token;
    this.password = password;
    this.session = ""; // "/cpsessXXXX" after a password login
    this.jar = null;
  }

  async curl(args, { binary = false } = {}) {
    const argv = ["-sS", "-m", "300", "-L", ...args];
    if (this.host) argv.push("-H", `Host: ${this.host}`);
    if (this.token)
      argv.push("-H", `Authorization: cpanel ${this.user}:${this.token}`);
    if (this.jar) argv.push("-b", this.jar, "-c", this.jar);
    const { stdout } = await run("curl", argv, {
      maxBuffer: 64 * 1024 * 1024,
      encoding: binary ? "buffer" : "utf8",
    });
    return stdout;
  }

  async login() {
    if (this.token) return;
    if (!this.password) fail("Set CPANEL_TOKEN or CPANEL_PASSWORD.");
    this.jar = path.join(
      await mkdtemp(path.join(os.tmpdir(), "cpanel-")),
      "jar",
    );
    const body = await this.curl([
      "-X",
      "POST",
      "--data-urlencode",
      `user=${this.user}`,
      "--data-urlencode",
      `pass=${this.password}`,
      `${this.base}/login/?login_only=1`,
    ]);
    const json = parse(body, "login");
    if (json.status !== 1 || !json.security_token) {
      fail(
        `cPanel login failed: ${json.message ?? json.reason ?? body.slice(0, 200)}`,
      );
    }
    this.session = json.security_token;
  }

  async close() {
    if (this.jar)
      await rm(path.dirname(this.jar), { recursive: true, force: true });
  }

  /** UAPI: /execute/Module/function. `form` fields go as a multipart POST. */
  async uapi(module, func, params = {}, form = null) {
    const url = new URL(
      `${this.base}${this.session}/execute/${module}/${func}`,
    );
    for (const [k, v] of Object.entries(params))
      url.searchParams.set(k, String(v));
    const args = [];
    if (form)
      for (const [k, v] of Object.entries(form)) args.push("-F", `${k}=${v}`);
    const json = parse(
      await this.curl([...args, url.toString()]),
      `${module}::${func}`,
    );
    if (json.status !== 1) {
      throw new Error(
        `${module}::${func}: ${(json.errors ?? ["unknown error"]).join("; ")}`,
      );
    }
    return json.data;
  }

  /** API 2, for the file operations UAPI never grew (rename, extract, mkdir, unlink). */
  async api2(module, func, params = {}) {
    const url = new URL(`${this.base}${this.session}/json-api/cpanel`);
    url.searchParams.set("cpanel_jsonapi_user", this.user);
    url.searchParams.set("cpanel_jsonapi_apiversion", "2");
    url.searchParams.set("cpanel_jsonapi_module", module);
    url.searchParams.set("cpanel_jsonapi_func", func);
    for (const [k, v] of Object.entries(params))
      url.searchParams.set(k, String(v));
    const json = parse(await this.curl([url.toString()]), `${module}::${func}`);
    const result = json.cpanelresult ?? {};
    const rows = Array.isArray(result.data) ? result.data : [];
    const errors = [result.error, ...rows.map((r) => r?.err)].filter(Boolean);
    if (errors.length || result.event?.result === 0) {
      throw new Error(`${module}::${func}: ${errors.join("; ") || "failed"}`);
    }
    return rows;
  }
}

function parse(body, what) {
  try {
    return JSON.parse(body);
  } catch {
    const title = body.match(/<title>([^<]*)<\/title>/)?.[1];
    fail(
      `${what}: cPanel answered with ${title ? `"${title}"` : "something that is not JSON"}.\n` +
        (title?.includes("Login")
          ? "The credentials were refused — check CPANEL_USER and CPANEL_TOKEN / CPANEL_PASSWORD."
          : /One moment, please/i.test(body)
            ? "The host's bot filter (Imunify360) challenged the request — it does that after a refused\n" +
              "login. Check the credentials, wait a few minutes, and try again."
            : `First bytes: ${body.slice(0, 160).replace(/\s+/g, " ")}`),
    );
  }
}

/** The document root cPanel has for the build's host, and the account's home. */
async function locate(cp, build) {
  const info = await cp.uapi("Variables", "get_user_information");
  const home = info.home ?? `/home/${cp.user}`;
  const host = new URL(build.baseUrl).host.replace(/^www\./, "");
  let docroot = process.env.CPANEL_REMOTE_DIR ?? "";
  if (!docroot) {
    const domains = await cp.uapi("DomainInfo", "domains_data", {
      format: "hash",
    });
    const all = [
      domains.main_domain,
      ...(domains.addon_domains ?? []),
      ...(domains.sub_domains ?? []),
      ...(domains.parked_domains ?? []),
    ].filter(Boolean);
    const match = all.find(
      (d) => d.domain === host || d.domain === `www.${host}`,
    );
    docroot =
      match?.documentroot ??
      domains.main_domain?.documentroot ??
      `${home}/public_html`;
    if (!match) {
      console.log(
        `  ! ${host} is not a domain on this account — using ${docroot}`,
      );
    }
  }
  return { home, docroot, account: info.user ?? cp.user };
}

async function listing(cp, dir) {
  try {
    const rows = await cp.uapi("Fileman", "list_files", {
      dir,
      show_hidden: 1,
      include_mime: 0,
    });
    return rows.map((r) => r.file);
  } catch (error) {
    if (/does not exist|No such/i.test(error.message)) return null;
    throw error;
  }
}

async function main() {
  await loadDotEnv(ROOT);

  const build = await readBuild(OUT_DIR);
  const dryRun = has("--dry-run");
  const chat = await prepareServerFiles(OUT_DIR, build, {
    allowDemo: has("--allow-demo"),
  });
  const files = await walk(OUT_DIR);
  const bytes = await sizeOf(files);

  const {
    CPANEL_URL,
    CPANEL_HOST,
    CPANEL_USER,
    CPANEL_TOKEN,
    CPANEL_PASSWORD,
  } = process.env;
  console.log(`\n${dryRun ? "DRY RUN — " : ""}Deploying to ${build.baseUrl}`);
  describe(build, chat, {
    files: files.length,
    bytes,
    target: `cPanel ${CPANEL_URL ?? "(CPANEL_URL unset)"}${CPANEL_HOST ? ` as ${CPANEL_HOST}` : ""}`,
  });
  if (dryRun) {
    console.log(`\n  out/.htaccess written. Nothing was uploaded.\n`);
    return;
  }
  if (!CPANEL_URL || !CPANEL_USER)
    fail("Set CPANEL_URL and CPANEL_USER in the environment or .env.local.");

  const cp = new Cpanel({
    url: CPANEL_URL,
    host: CPANEL_HOST,
    user: CPANEL_USER,
    token: CPANEL_TOKEN,
    password: CPANEL_PASSWORD,
  });
  const work = await mkdtemp(path.join(os.tmpdir(), "deploy-cpanel-"));
  try {
    await cp.login();
    const { home, docroot, account } = await locate(cp, build);
    console.log(`\n  logged in as ${account}; home ${home}`);
    console.log(`  web root for ${new URL(build.baseUrl).host}: ${docroot}`);

    const present = await listing(cp, docroot);
    const wordpress = present?.includes("wp-config.php") ?? false;
    if (present === null) console.log("  the web root does not exist yet");
    else {
      console.log(
        `  it holds ${present.length} entr${present.length === 1 ? "y" : "ies"}${wordpress ? " — a WordPress install" : ""}`,
      );
    }

    if (has("--check")) {
      if (present?.length) {
        for (const name of present.slice(0, 40)) console.log(`    ${name}`);
        if (present.length > 40)
          console.log(`    … and ${present.length - 40} more`);
      }
      console.log("");
      return;
    }

    // One archive, one upload, one extract — instead of one request per file.
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .slice(0, 15)
      .replace("T", "-");
    const archiveName = `site-${stamp}.tar.gz`;
    const archive = path.join(work, archiveName);
    await run("tar", ["-czf", archive, "-C", OUT_DIR, "."]);
    const remoteArchive = path.posix.join(home, archiveName);
    const upload = await cp.uapi(
      "Fileman",
      "upload_files",
      {},
      { dir: home, "file-1": `@${archive}` },
    );
    if (upload.succeeded !== 1 && !(upload.uploads?.[0]?.status ?? 0)) {
      throw new Error(`upload: ${JSON.stringify(upload).slice(0, 300)}`);
    }
    console.log(
      `  uploaded ${archiveName} (${(bytes / 1024 / 1024).toFixed(1)} MB unpacked)`,
    );

    if (present?.length && !has("--keep-old")) {
      const aside = `${docroot.replace(/\/+$/, "")}.old-${stamp}`;
      await cp.api2("Fileman", "fileop", {
        op: "rename",
        sourcefiles: docroot,
        destfiles: aside,
      });
      await cp.api2("Fileman", "mkdir", {
        path: path.posix.dirname(docroot),
        name: path.posix.basename(docroot),
        permissions: "0755",
      });
      console.log(`  old web root moved to ${aside}`);
    } else if (present === null) {
      await cp.api2("Fileman", "mkdir", {
        path: path.posix.dirname(docroot),
        name: path.posix.basename(docroot),
        permissions: "0755",
      });
    }

    await cp.api2("Fileman", "fileop", {
      op: "extract",
      sourcefiles: remoteArchive,
      destfiles: docroot,
    });
    await cp.api2("Fileman", "fileop", {
      op: "unlink",
      sourcefiles: remoteArchive,
    });
    const after = (await listing(cp, docroot)) ?? [];
    if (!after.includes("index.html")) {
      throw new Error(
        `extract finished but ${docroot} has no index.html (${after.length} entries)`,
      );
    }
    console.log(`  extracted into ${docroot} (${after.length} entries)`);

    if (chat?.apiKey) {
      // One level above the web root: a .php file that returns a value
      // outputs nothing even if it ends up inside it.
      const parent = path.posix.dirname(docroot);
      const secretFile = path.join(work, "secret.php");
      await writeFile(secretFile, chatSecret(chat), { mode: 0o600 });
      await cp.uapi(
        "Fileman",
        "save_file_content",
        {
          dir: parent,
          file: ".chat-secret.php",
          from_charset: "utf-8",
          to_charset: "utf-8",
        },
        { content: `<${secretFile}` },
      );
      console.log(
        `  assistant secret written to ${path.posix.join(parent, ".chat-secret.php")}`,
      );
    }
  } catch (error) {
    fail(`cPanel deploy failed: ${error.message}`);
  } finally {
    await cp.close();
    await rm(work, { recursive: true, force: true });
  }

  const ok = await verifyLive(
    build,
    "The document root may be elsewhere — run --check, or set CPANEL_REMOTE_DIR.",
  );
  if (ok && chat) {
    try {
      const probe = await fetch(`${build.baseUrl}/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: build.baseUrl },
        body: JSON.stringify({ messages: [{ role: "user", content: "test" }] }),
      });
      console.log(
        probe.ok
          ? `  ✓ chat.php answers (${probe.status})\n`
          : `  ! chat.php answered ${probe.status} — the assistant will fall back to the phone until this is fixed\n`,
      );
    } catch (error) {
      console.log(`  ! chat.php probe failed: ${error.message}\n`);
    }
  }
}

main().catch((error) => fail(error.stack ?? String(error)));
