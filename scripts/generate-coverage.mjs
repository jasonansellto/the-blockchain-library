import fs from "node:fs";
import path from "node:path";
import { nowIso } from "./lib/stable-time.mjs";

const cwd = process.cwd();
const d = path.join(cwd, "data", "knowledge");
const out = path.join(cwd, "public", "knowledge", "curated");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(out, { recursive: true });

const exists = n => fs.existsSync(path.join(d, n));
const read = n => JSON.parse(fs.readFileSync(path.join(d, n), "utf8"));

const topics = read("topics-expanded.json").topics ?? [];
const files = {
  books: ["books.json", ["books"]],
  research: ["research.json", ["research"]],
  tutorials: ["tutorials.json", ["tutorials"]],
  codeExamples: ["code-examples.json", ["examples", "codeExamples"]],
  aiPrompts: ["ai-prompts.json", ["prompts", "aiPrompts"]],
  quizzes: ["quizzes.json", ["quizzes"]],
  learningPaths: ["learning-paths.json", ["paths", "learningPaths"]]
};

function loadArray(file, keys) {
  if (!exists(file)) return [];
  const doc = read(file);
  for (const key of keys) if (Array.isArray(doc[key])) return doc[key];
  return [];
}

const collections = Object.fromEntries(
  Object.entries(files).map(([name, [file, keys]]) => [name, loadArray(file, keys)])
);

const coverage = {};
for (const topic of topics) {
  coverage[topic.id] = {
    id: topic.id,
    title: topic.title,
    category: topic.category,
    level: topic.level,
    canonicalUrl: topic.canonicalUrl,
    resources: {
      glossary: false,
      books: [],
      research: [],
      tutorials: [],
      codeExamples: [],
      aiPrompts: [],
      quizzes: [],
      learningPaths: []
    },
    score: 0,
    status: "thin"
  };
}

if (exists("glossary-expanded.json")) {
  const glossary = read("glossary-expanded.json").entries ?? [];
  const ids = new Set(glossary.map(g => g.id));
  for (const topic of topics) coverage[topic.id].resources.glossary = ids.has(topic.id);
}

for (const [name, objects] of Object.entries(collections)) {
  if (name === "learningPaths") continue;
  for (const object of objects) {
    for (const topicId of object.topicIds ?? []) {
      if (coverage[topicId]) coverage[topicId].resources[name].push({
        id: object.id,
        title: object.title ?? object.id,
        canonicalUrl: object.canonicalUrl ?? null
      });
    }
  }
}

for (const pathObj of collections.learningPaths) {
  for (const step of pathObj.steps ?? []) {
    if (!coverage[step.topicId]) continue;
    coverage[step.topicId].resources.learningPaths.push({
      id: pathObj.id,
      title: pathObj.title,
      canonicalUrl: pathObj.canonicalUrl ?? "/learn/learning-path"
    });
  }
}

const weighted = ["glossary","books","research","tutorials","codeExamples","aiPrompts","quizzes","learningPaths"];
for (const item of Object.values(coverage)) {
  let filled = 0;
  for (const key of weighted) {
    const value = item.resources[key];
    if ((Array.isArray(value) && value.length) || value === true) filled++;
  }
  item.score = Math.round((filled / weighted.length) * 100);
  item.status = item.score >= 75 ? "rich" : item.score >= 40 ? "developing" : "thin";
}

const rows = Object.values(coverage);
const summary = {
  version: "1.3.0",
  generatedAt: new Date().toISOString(),
  totalTopics: rows.length,
  averageCoverage: Math.round(rows.reduce((s,x)=>s+x.score,0) / Math.max(rows.length,1)),
  statusCounts: {
    rich: rows.filter(x=>x.status==="rich").length,
    developing: rows.filter(x=>x.status==="developing").length,
    thin: rows.filter(x=>x.status==="thin").length
  },
  missing: Object.fromEntries(weighted.map(key => [
    key,
    rows.filter(x => {
      const v=x.resources[key];
      return Array.isArray(v) ? v.length===0 : !v;
    }).length
  ]))
};

const coveragePath = path.join(out, "coverage.json");
try {
  const prev = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
  const strip = doc => JSON.stringify({ ...doc, summary: { ...doc.summary, generatedAt: null } });
  summary.generatedAt = strip(prev) === strip({ summary, topics: rows }) ? prev.summary.generatedAt : nowIso();
} catch { summary.generatedAt = nowIso(); }
fs.writeFileSync(coveragePath, JSON.stringify({ summary, topics: rows }, null, 2) + "\n");
console.log("Coverage report generated.");
console.log(JSON.stringify(summary, null, 2));
