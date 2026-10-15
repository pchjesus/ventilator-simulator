import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS,MONITOR_REFERENCE,initialSettings,VERSION} from "../src/sim-model.js";
import {CORE_LESSONS,auditCoreLearning} from "../src/student-learning.js";
import {CORE_QUESTIONS,CORE_QUIZ_REVIEW,auditCoreQuiz} from "../src/core-quiz.js";
import {LAB_IDS} from "../src/lab-engine.js";
import {LAB_LESSONS,LAB_SOURCES,auditLabLessons} from "../src/lab-lessons.js";
import {PRECLINICAL_CASES,CASE_SOURCES} from "../src/preclinical-cases.js";
import {CASE_ACTION_EXERCISES} from "../src/case-actions.js";
import {auditCaseBank} from "../src/case-quality.js";

// Frozen at v0.5.4 main 704e6401: changing a key requires an explicit
// product/content review, not merely updating these expectations to make CI pass.
const coreAnswers=[
 ["peep-meaning","a"],["peep-circulation","b"],["fio2-setting","c"],
 ["fio2-measure","a"],["vte-meaning","b"],["vte-pc","c"],
 ["rate-distinction","a"],["rate-static","b"],["ppeak-pi","c"],["patient-first","b"]
];
const labAnswers={
 peep:[["LAB-01-P","a"],["LAB-01-I","b"]],
 rate:[["LAB-02-P","b"],["LAB-02-I","c"]],
 fio2:[["LAB-03-P","a"],["LAB-03-I","b"]]
};
const caseAnswers={
 orientation:[["source","b"],["fio2","b"],["assessment","c"]],
 desaturation:[["first","a"],["verify","b"],["handoff","c"]],
 "mas-neonate":[["mechanism","a"],["observe","b"],["suction","c"]],
 "rsv-infant":[["deterioration","a"],["airway","b"],["source","c"]]
};
test("v0.5.4 device setting and fixed monitor baseline is unchanged",()=>{
 assert.equal(VERSION,"0.5.4");
 assert.deepEqual(PARAMETERS.map(p=>p.id),["fio2","peep","rate","pi","ti","ps","trigger"]);
 assert.deepEqual(initialSettings(),{fio2:40,peep:5,rate:15,pi:10,ti:1,ps:10,trigger:3});
 assert.deepEqual(MONITOR_REFERENCE,[
  ["PPEAK","15","cmH₂O"],["PMEAN","8.8","cmH₂O"],["PEEP","5.8","cmH₂O"],
  ["I:E","1:1.8",""],["fTOT","22","/min"],["VTE","352","mL"],["V̇E TOT","7.43","L/min"]
 ]);
});
test("v0.5.4 CORE lessons and 10 scored question IDs/keys are unchanged",()=>{
 assert.deepEqual(CORE_LESSONS.map(x=>x.id),["peep","fio2","vte","rate","ppeak","patient"]);
 assert.deepEqual(CORE_QUESTIONS.map(q=>[q.id,q.answer]),coreAnswers);
 assert.equal(CORE_QUIZ_REVIEW.approved,false);
 assert.equal(auditCoreLearning().problems.length,0);
 assert.deepEqual(auditCoreQuiz().errors,[]);
});
test("v0.5.4 guided LAB 3/6 unscored keys, sources and review gate are unchanged",()=>{
 assert.deepEqual([...LAB_IDS],["peep","rate","fio2"]);
 assert.deepEqual(LAB_LESSONS.map(x=>x.id),[...LAB_IDS]);
 for(const l of LAB_LESSONS){
  assert.deepEqual(l.questions.map(q=>[q.id,q.answer]),labAnswers[l.id]);
  for(const q of l.questions){
   assert.equal(q.review.approved,false);
   assert.equal(q.review.status,"pending-clinical-review");
   for(const id of q.sourceIds)assert.ok(LAB_SOURCES[id],`unknown LAB source ${id}`);
  }
 }
 assert.deepEqual(auditLabLessons(),{valid:true,errors:[],count:6});
});
test("v0.5.4 4 CASE/12 scored answers and 2 optional actions are unchanged",()=>{
 assert.deepEqual(PRECLINICAL_CASES.map(x=>x.id),Object.keys(caseAnswers));
 assert.equal(PRECLINICAL_CASES.reduce((sum,x)=>sum+x.steps.length,0),12);
 for(const c of PRECLINICAL_CASES){
  assert.deepEqual(c.steps.map(s=>[s.id,s.answer]),caseAnswers[c.id]);
  assert.equal(c.review.approved,false);
  assert.equal(c.review.status,"pending");
 }
 assert.deepEqual(Object.entries(CASE_ACTION_EXERCISES).map(([k,a])=>[k,a.id,a.answer]),[
  ["mas-neonate","mas-report","b"],["rsv-infant","rsv-airway-report","b"]
 ]);
 const result=auditCaseBank(PRECLINICAL_CASES,CASE_SOURCES);
 assert.deepEqual(result.errors,[]);
 assert.equal(result.caseCount,4);
 assert.equal(result.itemCount,12);
 assert.equal(result.warnings.length,4);
});
