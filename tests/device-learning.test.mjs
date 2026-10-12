import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS,MONITOR_REFERENCE} from "../src/sim-model.js";
import {ALARM_LESSONS,DISPLAY_TERMS,DISPLAY_CATEGORIES,DEVICE_EDUCATION_SOURCES,auditDeviceEducation,evaluateAlarmChoice,findAlarmLesson,termsForCategory} from "../src/device-learning.js";

test("every settings control and fixed readout maps to exactly one teaching concept",()=>{
 const audit=auditDeviceEducation();
 assert.deepEqual(audit.errors,[]);
 assert.equal(audit.termCount,PARAMETERS.length+MONITOR_REFERENCE.length+1);
 assert.equal(termsForCategory("setting").length,PARAMETERS.length);
 assert.equal(termsForCategory("measured").length,MONITOR_REFERENCE.length);
 assert.equal(termsForCategory("mode").length,1);
});
test("glossary classifications and filters are deterministic, no unlisted category",()=>{
 assert.equal(termsForCategory("all"),DISPLAY_TERMS);
 assert.equal(termsForCategory("xyz").length,0);
 assert.equal(DISPLAY_CATEGORIES.length,4);
 assert.ok(termsForCategory("measured").every(x=>x.simulator.includes("고정")));
 assert.ok(termsForCategory("setting").every(x=>x.id.startsWith("setting:")));
});
test("four unique manual-grounded recognition lessons have complete educational warnings",()=>{
 assert.deepEqual(auditDeviceEducation().errors,[]);
 assert.equal(ALARM_LESSONS.length,4);
 assert.equal(new Set(ALARM_LESSONS.map(x=>x.id)).size,4);
 for(const lesson of ALARM_LESSONS){
   assert.match(lesson.manualSection,/Table 6-5/);
   assert.ok(lesson.manufacturerMeaning.length>45);
   assert.ok(lesson.observation.includes("가상 상황"));
   assert.ok(lesson.nursingFocus.length>=3);
   assert.ok(lesson.uncertainty.length>30);
   assert.ok(lesson.sources.includes("pb980")&&lesson.sources.includes("aarc"));
 }
});
test("all alarm lessons have only one correct and individual feedback per response",()=>{
 for(const lesson of ALARM_LESSONS){
   assert.equal(lesson.choices.length,3);
   assert.equal(lesson.choices.filter(x=>x.id===lesson.answer).length,1);
   for(const choice of lesson.choices){
     const result=evaluateAlarmChoice(lesson.id,choice.id);
     assert.equal(result.correct,choice.id===lesson.answer);
     assert.ok(result.feedback.length>25);
     assert.ok(result.rationale.length>25);
     assert.equal(result.lessonId,lesson.id);
   }
 }
});
test("invalid alarm or option IDs are rejected",()=>{
 assert.equal(findAlarmLesson("unknown"),null);
 assert.throws(()=>evaluateAlarmChoice("unknown","a"),RangeError);
 assert.throws(()=>evaluateAlarmChoice(ALARM_LESSONS[0].id,"invalid"),RangeError);
});
test("recognition grading never changes static training data or settings metadata",()=>{
 const before=JSON.stringify({lessons:ALARM_LESSONS,terms:DISPLAY_TERMS,parameters:PARAMETERS,monitor:MONITOR_REFERENCE});
 evaluateAlarmChoice("pressure","c");
 evaluateAlarmChoice("disconnect","a");
 assert.equal(JSON.stringify({lessons:ALARM_LESSONS,terms:DISPLAY_TERMS,parameters:PARAMETERS,monitor:MONITOR_REFERENCE}),before);
});
test("primary and general guideline source links are HTTPS",()=>{
 for(const source of Object.values(DEVICE_EDUCATION_SOURCES))assert.match(source.url,/^https:\/\//);
});
