// Generates branded cover images for published website articles that have no
// featured image, and attaches them through the site's attachArticleCover
// endpoint. Articles that already have an image are never changed.
//
// Needs (installed by the workflow, not committed):  @resvg/resvg-js  sharp
//
// Env:
//   KNOWLEDGE_SYNC_TOKEN   required unless DRY_RUN=1
//   SITE_API               default https://theblockchainlibrary.com/api/apps/6a4cfcf76d7d1bf88148c979/functions
//   COVER_LIMIT            max covers per run (default 150)
//   DRY_RUN=1              render into ./article-covers-preview/ instead of uploading
//   EXPORT_DIR             read articles/categories from a local Base44 export instead of the API

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { buildCoverSvg } from "./article-covers/card.mjs";

const require = createRequire(import.meta.url);
const { Resvg } = require("@resvg/resvg-js");
const sharp = require("sharp");

const API = process.env.SITE_API || "https://theblockchainlibrary.com/api/apps/6a4cfcf76d7d1bf88148c979/functions";
const TOKEN = process.env.KNOWLEDGE_SYNC_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "1";
const LIMIT = Math.max(1, Number(process.env.COVER_LIMIT) || 150);
const LOGO_URL = "https://media.base44.com/images/public/6a4cfcf76d7d1bf88148c979/e03f7646e_blockchain-library-icon.png";
const FONT_URLS = {
  "Inter-Bold.otf": "https://cdn.jsdelivr.net/gh/rsms/inter@v3.19/docs/font-files/Inter-Bold.otf",
  "Inter-SemiBold.otf": "https://cdn.jsdelivr.net/gh/rsms/inter@v3.19/docs/font-files/Inter-SemiBold.otf"
};

if (!TOKEN && !DRY_RUN) {
  console.error("KNOWLEDGE_SYNC_TOKEN is not set.");
  process.exit(1);
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function callFunction(name, body, attempt = 1) {
  try {
    const res = await fetch(`${API}/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-knowledge-sync-token": TOKEN },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000)
    });
    const text = await res.text();
    if (res.status === 429 || res.status >= 500) throw new Error(`${name}: HTTP ${res.status} ${text.slice(0, 160)}`);
    const data = JSON.parse(text);
    if (!res.ok) throw Object.assign(new Error(`${name}: HTTP ${res.status} ${data.error || ""}`), { permanent: true });
    return data;
  } catch (error) {
    if (error.permanent || attempt >= 4) throw error;
    await new Promise(r => setTimeout(r, 15_000 * attempt));
    return callFunction(name, body, attempt + 1);
  }
}

async function loadContent() {
  if (process.env.EXPORT_DIR) {
    const read = f => JSON.parse(fs.readFileSync(path.join(process.env.EXPORT_DIR, f), "utf8"));
    return { articles: read("articles.json"), categories: read("categories.json") };
  }
  const [a, c] = await Promise.all([
    callFunction("exportContent", { type: "articles" }),
    callFunction("exportContent", { type: "categories" })
  ]);
  return { articles: a.records, categories: c.records };
}

// --- setup -----------------------------------------------------------------
const fontDir = fs.mkdtempSync(path.join(os.tmpdir(), "tbl-fonts-"));
const fontFiles = [];
for (const [name, url] of Object.entries(FONT_URLS)) {
  const file = path.join(fontDir, name);
  fs.writeFileSync(file, await download(url));
  fontFiles.push(file);
}
const logoPng = await sharp(await download(LOGO_URL)).resize(112, 112).png().toBuffer();
const logoDataUri = `data:image/png;base64,${logoPng.toString("base64")}`;

const { articles, categories } = await loadContent();
const categoryName = new Map(categories.map(c => [c.id, c.name]));
const todo = articles
  .filter(a => a.status === "published" && a.title && !a.featured_image)
  .sort((x, y) => String(y.published_date || "").localeCompare(String(x.published_date || "")))
  .slice(0, LIMIT);

console.log(`${articles.length} articles; ${todo.length} need a cover this run${DRY_RUN ? " (dry run)" : ""}.`);
if (DRY_RUN) fs.mkdirSync("article-covers-preview", { recursive: true });

// --- render + attach -------------------------------------------------------
async function renderJpeg(article) {
  const svg = buildCoverSvg({ title: article.title, categoryName: categoryName.get(article.category_id), logoDataUri });
  const png = new Resvg(svg, {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
    fitTo: { mode: "original" }
  }).render().asPng();
  return sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}

let attached = 0, skipped = 0;
const failed = [];
let next = 0;
async function worker() {
  while (next < todo.length) {
    const article = todo[next++];
    try {
      const jpg = await renderJpeg(article);
      if (DRY_RUN) {
        fs.writeFileSync(path.join("article-covers-preview", `${article.slug || article.id}.jpg`), jpg);
        attached++;
        continue;
      }
      const result = await callFunction("attachArticleCover", {
        articleId: article.id,
        imageBase64: jpg.toString("base64"),
        filename: `${article.slug || article.id}-cover.jpg`
      });
      if (result.attached) attached++; else skipped++;
    } catch (error) {
      failed.push(`${article.slug}: ${error.message}`);
    }
  }
}
await Promise.all([worker(), worker(), worker()]);

console.log(`${DRY_RUN ? "Rendered" : "Attached"} ${attached}, skipped ${skipped}, failed ${failed.length}.`);
failed.slice(0, 20).forEach(f => console.error(`- ${f}`));
if (todo.length && attached + skipped === 0) process.exit(1);
