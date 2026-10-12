import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS,MONITOR_REFERENCE} from "../src/sim-model.js";
import {CORE_LESSONS,CORE_SOURCES,ESSENTIAL_SETTING_IDS,ADVANCED_SETTING_IDS,auditCoreLearning} from "../src/student-learning.js";
import {DEVICE_VERSION_REVIEW} from "../src/device-learning.js";

test("student-first lesson bank has six readable clinically distinct priorities",()=>{
 const review=auditCoreLearning();
 assert.deepEqual(review.problems,[]);
 assert.equal(review.coreCount,6);
 assert.deepEqual(ESSENTIAL_SETTING_IDS,["fio2","peep","rate"]);
 assert.equal(ADVANCED_SETTING_IDS.length,4);
 assert.ok(CORE_LESSONS.some(l=>l.id==="peep"));
 assert.ok(CORE_LESSONS.some(l=>l.id==="vte"));
 assert.ok(CORE_LESSONS.some(l=>l.id==="patient"));
});
test("all seven existing input settings remain available and uniquely classified",()=>{
 const expected=new Set(PARAMETERS.map(p=>p.id));
 const actual=[...ESSENTIAL_SETTING_IDS,...ADVANCED_SETTING_IDS];
 assert.equal(actual.length,expected.size);
 assert.equal(new Set(actual).size,actual.length);
 for(const id of actual)assert.ok(expected.has(id));
});
test("critical clinical teaching does not confuse static readouts with measured patient data",()=>{
 const byId=Object.fromEntries(CORE_LESSONS.map(l=>[l.id,l]));
 assert.match(byId.vte.simulator,/예시/);
 assert.match(byId.ppeak.simulator,/고정/);
 assert.match(byId.rate.simulator,/고정/);
 assert.match(byId.fio2.caution,/SpO₂/);
 assert.match(byId.peep.caution,/무조건/);
 assert.equal(MONITOR_REFERENCE.length,7);
});
test("all basic lessons include patient observation, caution, simulator limitations and citation",()=>{
 for(const lesson of CORE_LESSONS){
  assert.ok(lesson.key.length>=8,"short teaching mnemonic must be meaningful");
  for(const key of ["meaning","observe","caution","simulator"])assert.ok(lesson[key].length>=15);
  for(const ref of lesson.reference)assert.match(CORE_SOURCES[ref].url,/^https:\/\//);
 }
});
test("software revision comparison is appropriately unverified and links to manufacturer sources",()=>{
 assert.equal(DEVICE_VERSION_REVIEW.status,"local-version-unconfirmed");
 assert.ok(DEVICE_VERSION_REVIEW.examples.length>=4);
 assert.match(DEVICE_VERSION_REVIEW.summary,/확인되지/);
 assert.match(DEVICE_VERSION_REVIEW.versionSpecificExample,/8\.4\.4\.3/);
 for(const link of DEVICE_VERSION_REVIEW.sourceLinks)assert.match(link.url,/^https:\/\//);
});
