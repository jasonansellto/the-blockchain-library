import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const topicsDoc = read("data/knowledge/topics.json");
const glossaryDoc = read("data/knowledge/glossary.json");
const relationshipsDoc = read("data/knowledge/relationships.json");
const pathsDoc = read("data/knowledge/learning-paths.json");
const resourcesDoc = read("data/knowledge/resources.json");

const errors = [];
const topicIds = new Set();
const glossaryIds = new Set();

function uniqueId(id, set, label) {
  if (!id || typeof id !== "string") errors.push(`${label}: missing id`);
  else if (set.has(id)) errors.push(`${label}: duplicate id "${id}"`);
  else set.add(id);
}

for (const topic of topicsDoc.topics ?? []) {
  uniqueId(topic.id, topicIds, "topic");
  for (const field of ["title","slug","summary","level","hub"]) {
    if (!topic[field]) errors.push(`topic ${topic.id ?? "unknown"}: missing ${field}`);
  }
}

for (const entry of glossaryDoc.entries ?? []) {
  uniqueId(entry.id, glossaryIds, "glossary");
  if (!entry.term || !entry.definition) errors.push(`glossary ${entry.id ?? "unknown"}: term and definition required`);
}

const knownNodes = new Set([...topicIds, ...glossaryIds]);
for (const edge of relationshipsDoc.edges ?? []) {
  if (!knownNodes.has(edge.from)) errors.push(`relationship: unknown from "${edge.from}"`);
  if (!knownNodes.has(edge.to)) errors.push(`relationship: unknown to "${edge.to}"`);
  if (!edge.type) errors.push(`relationship ${edge.from}->${edge.to}: missing type`);
}

for (const lp of pathsDoc.paths ?? []) {
  for (const step of lp.steps ?? []) {
    if (!topicIds.has(step.topicId)) errors.push(`learning path ${lp.id}: unknown topic "${step.topicId}"`);
    if (!step.page?.startsWith("/")) errors.push(`learning path ${lp.id}: invalid page "${step.page}"`);
  }
}

for (const resource of resourcesDoc.resources ?? []) {
  for (const topicId of resource.topicIds ?? []) {
    if (!topicIds.has(topicId)) errors.push(`resource ${resource.id}: unknown topic "${topicId}"`);
  }
}

if (errors.length) {
  console.error(`Knowledge validation failed with ${errors.length} error(s):`);
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`Knowledge validation passed.`);
console.log(`Topics: ${topicIds.size}`);
console.log(`Glossary entries: ${glossaryIds.size}`);
console.log(`Relationships: ${(relationshipsDoc.edges ?? []).length}`);
console.log(`Learning paths: ${(pathsDoc.paths ?? []).length}`);
console.log(`Resources: ${(resourcesDoc.resources ?? []).length}`);
