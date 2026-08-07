import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const dataDir = path.join(cwd, "data", "knowledge");
const outDir = path.join(cwd, "public", "knowledge");
fs.mkdirSync(outDir, { recursive: true });

const exists = name => fs.existsSync(path.join(dataDir, name));
const read = name => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const write = (name, value) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + "\n");

const expandedTopics = read("topics-expanded.json").topics;
const expandedGlossary = read("glossary-expanded.json").entries;

function loadArray(file, preferredKeys) {
  if (!exists(file)) return [];
  const doc = read(file);
  for (const key of preferredKeys) if (Array.isArray(doc[key])) return doc[key];
  return [];
}

const collections = {
  topics: expandedTopics,
  glossary: expandedGlossary,
  books: loadArray("books.json", ["books"]),
  research: loadArray("research.json", ["research"]),
  tutorials: loadArray("tutorials.json", ["tutorials"]),
  codeExamples: loadArray("code-examples.json", ["examples", "codeExamples"]),
  aiPrompts: loadArray("ai-prompts.json", ["prompts", "aiPrompts"]),
  quizzes: loadArray("quizzes.json", ["quizzes"]),
  learningPaths: loadArray("learning-paths.json", ["paths", "learningPaths"])
};

const catalog = Object.entries(collections).flatMap(([collection, objects]) =>
  objects.map(object => ({ collection, ...object }))
);

const byUid = new Map(catalog.filter(o => o.uid).map(o => [o.uid, o]));
const byTopicId = new Map(expandedTopics.map(t => [t.id, t]));

const edges = [];
const edgeKeys = new Set();
function addEdge(from, to, type, source="generated") {
  if (!from || !to || from === to) return;
  const key = `${from}|${to}|${type}`;
  if (edgeKeys.has(key)) return;
  edgeKeys.add(key);
  edges.push({ from, to, type, source });
}

for (const topic of expandedTopics) {
  for (const related of topic.relatedTopics ?? []) {
    if (byTopicId.has(related)) addEdge(topic.uid, `topic:${related}`, "related-to");
  }
}

if (exists("relationships.json")) {
  for (const edge of read("relationships.json").edges ?? []) addEdge(edge.from, edge.to, edge.type, "explicit");
}

// Reverse-index every resource that declares topicIds.
for (const [collection, objects] of Object.entries(collections)) {
  if (collection === "topics" || collection === "glossary") continue;
  for (const object of objects) {
    for (const topicId of object.topicIds ?? []) {
      if (byTopicId.has(topicId) && object.uid) addEdge(`topic:${topicId}`, object.uid, "has-resource");
    }
  }
}

// Topic-to-glossary edges by exact normalized id where possible.
const glossaryIds = new Set(expandedGlossary.map(g => g.id));
for (const topic of expandedTopics) {
  if (glossaryIds.has(topic.id)) addEdge(topic.uid, `glossary:${topic.id}`, "defined-by");
}

// Related-resource index, keyed by topic id.
const related = {};
for (const topic of expandedTopics) {
  related[topic.id] = {
    topic: { id: topic.id, uid: topic.uid, title: topic.title, canonicalUrl: topic.canonicalUrl, category: topic.category, level: topic.level },
    topics: [],
    glossary: [],
    books: [],
    research: [],
    tutorials: [],
    codeExamples: [],
    aiPrompts: [],
    quizzes: [],
    learningPaths: []
  };
}

const collectionKeyForType = {
  glossary: "glossary",
  book: "books",
  research: "research",
  tutorial: "tutorials",
  "code-example": "codeExamples",
  "ai-prompt": "aiPrompts",
  quiz: "quizzes",
  "learning-path": "learningPaths",
  topic: "topics"
};

for (const edge of edges) {
  if (!edge.from.startsWith("topic:")) continue;
  const topicId = edge.from.slice(6);
  if (!related[topicId]) continue;
  const target = byUid.get(edge.to);
  if (!target) continue;
  const key = collectionKeyForType[target.type];
  if (!key) continue;
  related[topicId][key].push({
    id: target.id,
    uid: target.uid,
    title: target.title ?? target.term ?? target.id,
    canonicalUrl: target.canonicalUrl ?? null,
    relationship: edge.type
  });
}

// Learning paths use topicId inside steps rather than top-level topicIds.
for (const pathObj of collections.learningPaths) {
  for (const step of pathObj.steps ?? []) {
    if (!related[step.topicId]) continue;
    related[step.topicId].learningPaths.push({
      id: pathObj.id,
      uid: pathObj.uid,
      title: pathObj.title,
      canonicalUrl: pathObj.canonicalUrl ?? "/learn/learning-path",
      relationship: "appears-in"
    });
  }
}

for (const value of Object.values(related)) {
  for (const key of Object.keys(value)) {
    if (!Array.isArray(value[key])) continue;
    const seen = new Set();
    value[key] = value[key].filter(x => {
      const k = x.uid ?? x.id;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
}

const nodes = catalog.filter(o => o.uid).map(o => ({
  id: o.uid,
  type: o.type,
  label: o.title ?? o.term ?? o.id,
  category: o.category ?? null,
  canonicalUrl: o.canonicalUrl ?? null
}));

const graph = { version: "1.2.0", nodes, edges };

const searchIndex = catalog.map(o => ({
  id: o.uid ?? `${o.collection}:${o.id}`,
  objectId: o.id,
  type: o.type ?? o.collection,
  collection: o.collection,
  title: o.title ?? o.term ?? o.id,
  description: o.summary ?? o.definition ?? o.subtitle ?? "",
  category: o.category ?? "",
  tags: o.tags ?? [],
  canonicalUrl: o.canonicalUrl ?? "",
  text: [
    o.title, o.term, o.summary, o.definition, o.subtitle, o.category,
    ...(o.tags ?? []), ...(o.topicIds ?? [])
  ].filter(Boolean).join(" ")
}));

const counts = Object.fromEntries(Object.entries(collections).map(([k,v]) => [k, v.length]));
const index = {
  version: "1.2.0",
  generatedAt: new Date().toISOString(),
  counts,
  totals: {
    objects: catalog.length,
    graphNodes: nodes.length,
    graphEdges: edges.length
  },
  endpoints: {
    catalog: "/knowledge/catalog.json",
    graph: "/knowledge/graph.json",
    related: "/knowledge/related.json",
    search: "/knowledge/search-index.json"
  }
};

write("index.json", index);
write("catalog.json", catalog);
write("graph.json", graph);
write("related.json", related);
write("search-index.json", searchIndex);

console.log("Unified Knowledge Platform data generated.");
console.log(JSON.stringify(index, null, 2));
