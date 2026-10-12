import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS} from "../src/sim-model.js";
import {CLINICAL_TOPICS,TOPIC_GROUPS,EDUCATION_SOURCES,MANUAL_SECTIONS} from "../src/education-content.js";
test("each of the seven settings has substantial evidence-linked education",()=>{
 for(const param of PARAMETERS){
  const entry=CLINICAL_TOPICS[param.id];
  assert.ok(entry,param.id);
  assert.ok(entry.summary.length>=45,param.id);
  assert.ok(entry.sections.length>=3,param.id);
  assert.ok(entry.sections.every(s=>s.heading&&s.points.length>=1),param.id);
  assert.ok(entry.sourceIds.length>=2,param.id);
 }
});
test("every clinical topic is discoverable and sources are grounded HTTPS links",()=>{
 const ids=TOPIC_GROUPS.flatMap(g=>g.ids);
 assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(ids.slice(0,5),["peep","fio2","rate","monitoring","nursing"]);
 assert.deepEqual(new Set(ids.filter(id=>PARAMETERS.some(p=>p.id===id))),new Set(PARAMETERS.map(p=>p.id)));
 assert.deepEqual(new Set(ids),new Set(Object.keys(CLINICAL_TOPICS)));
 for(const [id,item] of Object.entries(CLINICAL_TOPICS)){
  for(const key of item.sourceIds)assert.ok(EDUCATION_SOURCES[key],id+" "+key);
 }
 for(const source of Object.values(EDUCATION_SOURCES))assert.ok(source.url.startsWith("https://"));
});
test("the seven-part manual distinguishes controls from clinical constraints",()=>{
 assert.equal(MANUAL_SECTIONS.length,7);
 assert.ok(MANUAL_SECTIONS.every(s=>s.title&&s.lines.length>=2));
 const manual=MANUAL_SECTIONS.flatMap(s=>s.lines).join(" ");
 assert.match(manual,/Accept/);assert.match(manual,/빠른 학습/);assert.match(manual,/임상/);
 assert.match(manual,/FiO₂/);assert.match(manual,/V-TRIG/);
});
