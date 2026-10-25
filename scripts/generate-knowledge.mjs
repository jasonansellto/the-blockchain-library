import fs from "node:fs";
import path from "node:path";
import { writeStableJson } from "./lib/stable-time.mjs";
const cwd=process.cwd(), d=path.join(cwd,"data","knowledge"), out=path.join(cwd,"public","knowledge","curated","core");
fs.mkdirSync(out,{recursive:true});
const read=n=>JSON.parse(fs.readFileSync(path.join(d,n),"utf8"));
const write=(n,v)=>writeStableJson(path.join(out,n),v);
const c={
 topics:read("topics.json").topics, glossary:read("glossary.json").entries, books:read("books.json").books,
 research:read("research.json").research, tutorials:read("tutorials.json").tutorials,
 codeExamples:read("code-examples.json").examples, aiPrompts:read("ai-prompts.json").prompts,
 quizzes:read("quizzes.json").quizzes, learningPaths:read("learning-paths.json").paths
};
const explicit=read("relationships.json").edges;
const catalog=Object.entries(c).flatMap(([collection,objects])=>objects.map(o=>({collection,...o})));
const nodes=catalog.map(o=>({id:o.uid,type:o.type,label:o.title??o.term??o.id}));
const edges=[...explicit];
for(const t of c.topics){
 for(const b of t.bookResources??[]) edges.push({from:t.uid,to:`book:${b}`,type:"related-to"});
 for(const r of t.researchResources??[]) edges.push({from:t.uid,to:`research:${r}`,type:"related-to"});
 for(const rt of t.relatedTopics??[]) edges.push({from:t.uid,to:`topic:${rt}`,type:"related-to"});
}
const index={version:"1.0.0",generatedAt:new Date().toISOString(),counts:Object.fromEntries(Object.entries(c).map(([k,v])=>[k,v.length])),
 endpoints:{catalog:"/knowledge/curated/core/catalog.json",graph:"/knowledge/curated/core/graph.json",jsonld:"/knowledge/curated/core/knowledge-graph.jsonld"}};
const graph={version:"1.0.0",nodes,edges};
const jsonld={"@context":{"@vocab":"https://schema.org/","tbl":"https://theblockchainlibrary.com/ns#"},"@graph":[
 ...c.topics.map(t=>({"@id":`https://theblockchainlibrary.com${t.canonicalUrl}`,"@type":"DefinedTermSet","name":t.title,"description":t.summary,"url":`https://theblockchainlibrary.com${t.canonicalUrl}`})),
 ...c.books.map(b=>({"@id":`https://theblockchainlibrary.com/knowledge/book/${b.id}`,"@type":"Book","name":b.title,"author":{"@type":"Person","name":b.author}})),
 ...c.research.map(r=>({"@id":`https://theblockchainlibrary.com/knowledge/research/${r.id}`,"@type":"ScholarlyArticle","name":r.title,"author":{"@type":"Person","name":r.author},"identifier":Object.values(r.identifiers??{})}))
]};
write("index.json",index);write("catalog.json",catalog);write("graph.json",graph);write("knowledge-graph.jsonld",jsonld);
console.log("Knowledge exports generated."); console.log(index.counts);
