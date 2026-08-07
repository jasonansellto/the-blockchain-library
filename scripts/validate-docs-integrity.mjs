import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = path.join(cwd, "generated", "v2");
const errors = [];
const warnings = [];

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

if (!fs.existsSync(root)) {
  console.error("generated/v2 does not exist");
  process.exit(1);
}

const mdxFiles = walk(root).filter(file => file.endsWith(".mdx"));
const routeSet = new Set(
  mdxFiles.map(file => "/" + path.relative(cwd, file).replace(/\\/g, "/").replace(/\.mdx$/, ""))
);

const internalLink = /\]\((\/[^)\s#?]+)(?:[?#][^)]*)?\)/g;

for (const file of mdxFiles) {
  const rel = path.relative(cwd, file).replace(/\\/g, "/");
  const name = path.basename(file);
  if (name.length > 120) errors.push(`${rel}: filename exceeds 120 characters`);

  const content = fs.readFileSync(file, "utf8");
  let match;
  while ((match = internalLink.exec(content))) {
    const route = match[1].replace(/\/$/, "");
    if (
      route.startsWith("/generated/v2/") &&
      !routeSet.has(route)
    ) {
      errors.push(`${rel}: broken v2 internal route ${route}`);
    }
  }
}

const docsPath = path.join(cwd, "docs.json");
if (fs.existsSync(docsPath)) {
  const docs = JSON.parse(fs.readFileSync(docsPath, "utf8"));
  const serialized = JSON.stringify(docs);
  const required = [
    "generated/v2/index",
    "generated/v2/catalogs/topics",
    "generated/v2/catalogs/glossary",
    "generated/v2/catalogs/books",
    "generated/v2/catalogs/research",
    "generated/v2/catalogs/learning-paths",
    "generated/v2/catalogs/resources",
    "generated/v2/catalogs/code-examples",
    "generated/v2/catalogs/rpc"
  ];
  for (const route of required) {
    if (!serialized.includes(route)) errors.push(`docs.json missing v2 navigation route: ${route}`);
  }
}

warnings.forEach(x => console.warn(`WARN ${x}`));
if (errors.length) {
  console.error(`Documentation integrity validation failed (${errors.length})`);
  errors.slice(0, 100).forEach(x => console.error(`- ${x}`));
  if (errors.length > 100) console.error(`... ${errors.length - 100} additional errors`);
  process.exit(1);
}

console.log(`Documentation integrity validation passed: ${mdxFiles.length} MDX files checked.`);
