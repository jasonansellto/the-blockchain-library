import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = process.cwd();
const compiledDir = path.join(cwd, "data", "compiled");
const publicDir = path.join(cwd, "public", "knowledge");
fs.mkdirSync(publicDir, { recursive: true });

const read = name => JSON.parse(fs.readFileSync(path.join(compiledDir, name), "utf8"));
const copyJson = name => fs.copyFileSync(path.join(compiledDir, name), path.join(publicDir, name));
const checksum = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const packageDoc = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
const manifest = read("manifest.json");

const files = [
  "manifest.json",
  "catalog.json",
  "graph.json",
  "related.json",
  "search-index.json",
  "reconciliation.json",
  "missing-concepts.json",
  "duplicate-merges.json",
  "source-map.json"
].filter(name => fs.existsSync(path.join(compiledDir, name)));

for (const name of files) copyJson(name);

const release = {
  platformVersion: packageDoc.version,
  knowledgeReleaseVersion: "2.1.0",
  compilerVersion: manifest.compilerVersion,
  schemaVersion: manifest.schemaVersion,
  buildId: manifest.buildId,
  source: manifest.source,
  generatedAt: manifest.source?.exportDate || manifest.generatedAt,
  totals: manifest.totals,
  quality: manifest.quality,
  distribution: {
    website: "https://theblockchainlibrary.com",
    explorer: "https://theblockchainlibrary.com/explore",
    documentation: "https://docs.theblockchainlibrary.com",
    repository: "https://github.com/jasonansellto/the-blockchain-library"
  },
  publicFiles: Object.fromEntries(files.map(name => [
    name,
    {
      path: `/knowledge/${name}`,
      sha256: checksum(path.join(publicDir, name))
    }
  ])),
  syncContract: {
    authoredContentOwner: "Base44",
    canonicalKnowledgeOwner: "GitHub",
    documentationPresentation: "Mintlify",
    publicExplorer: "Base44",
    safeWebsiteReturnFields: [
      "canonicalUid",
      "canonicalStatus",
      "compiledBuildId",
      "normalizedSlug",
      "compiledRelationships",
      "knowledgeQuality",
      "canonicalSearchMetadata"
    ]
  }
};

fs.writeFileSync(path.join(publicDir, "knowledge-release.json"), JSON.stringify(release, null, 2) + "\n");
fs.writeFileSync(path.join(cwd, "knowledge-release.json"), JSON.stringify(release, null, 2) + "\n");

console.log(
  `Platform ${release.platformVersion}; knowledge release ${release.knowledgeReleaseVersion}; build ${release.buildId}.`
);
