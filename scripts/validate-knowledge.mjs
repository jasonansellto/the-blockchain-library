import fs from "node:fs";
import path from "node:path";
const d=path.join(process.cwd(),"data","knowledge");
const read=n=>JSON.parse(fs.readFileSync(path.join(d,n),"utf8"));
const c={
 topics:read("topics.json").topics, glossary:read("glossary.json").entries, books:read("books.json").books,
 research:read("research.json").research, tutorials:read("tutorials.json").tutorials,
 codeExamples:read("code-examples.json").examples, aiPrompts:read("ai-prompts.json").prompts,
 quizzes:read("quizzes.json").quizzes, learningPaths:read("learning-paths.json").paths
};
const edges=read("relationships.json").edges;
const errors=[], uids=new Set(), topicIds=new Set([...c.topics,...read("topics-expanded.json").topics].map(x=>x.id));
for (const [name,objs] of Object.entries(c)) for (const o of objs) {
 if(!o.id||!o.uid||!o.type) errors.push(`${name}: missing id/uid/type`);
 if(uids.has(o.uid)) errors.push(`duplicate uid ${o.uid}`); else uids.add(o.uid);
 if(o.status&&!["draft","review","published","deprecated"].includes(o.status)) errors.push(`${o.uid}: invalid status`);
 for(const t of o.topicIds??[]) if(!topicIds.has(t)) errors.push(`${o.uid}: unknown topicId ${t}`);
}
for(const t of c.topics) {
 for(const r of t.relatedTopics??[]) if(!topicIds.has(r)) errors.push(`${t.uid}: unknown related topic ${r}`);
 for(const b of t.bookResources??[]) if(!uids.has(`book:${b}`)) errors.push(`${t.uid}: unknown book ${b}`);
 for(const r of t.researchResources??[]) if(!uids.has(`research:${r}`)) errors.push(`${t.uid}: unknown research ${r}`);
}
for(const p of c.learningPaths) for(const s of p.steps??[]) {
 if(!topicIds.has(s.topicId)) errors.push(`${p.uid}: unknown topic ${s.topicId}`);
 if(!s.page?.startsWith("/")) errors.push(`${p.uid}: invalid page ${s.page}`);
}
for(const e of edges) {
 if(!uids.has(e.from)) errors.push(`edge unknown from ${e.from}`);
 if(!uids.has(e.to)) errors.push(`edge unknown to ${e.to}`);
}
if(errors.length){console.error(`Knowledge Engine validation failed (${errors.length})`);errors.forEach(e=>console.error(`- ${e}`));process.exit(1);}
console.log("Knowledge Engine validation passed.");
for(const [name,objs] of Object.entries(c)) console.log(`${name}: ${objs.length}`);
console.log(`relationships: ${edges.length}`);
