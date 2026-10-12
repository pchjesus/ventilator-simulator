import test from "node:test";
import assert from "node:assert/strict";
import {CORE_LESSONS} from "../src/student-learning.js";
import {CORE_QUESTIONS,CORE_QUIZ_REVIEW,auditCoreQuiz,startCoreQuiz,chooseCoreAnswer,advanceCoreQuiz,scoreCoreQuiz} from "../src/core-quiz.js";
import {initialSettings,MONITOR_REFERENCE} from "../src/sim-model.js";
import {PRECLINICAL_CASES} from "../src/preclinical-cases.js";

test("ten curated items cover all six core concept cards and remain expert-unreviewed",()=>{
 const audit=auditCoreQuiz();
 assert.deepEqual(audit.errors,[]);
 assert.equal(audit.count,10);
 assert.deepEqual(CORE_QUIZ_REVIEW,{status:"pending",approved:false});
 assert.deepEqual(new Set(CORE_QUESTIONS.map(q=>q.conceptId)),new Set(CORE_LESSONS.map(q=>q.id)));
});
test("every item connects a learning objective, answer, all-option rationale and misconception to sources",()=>{
 for(const q of CORE_QUESTIONS){
  assert.ok(q.objective.length>10);
  assert.equal(q.options.length,3);
  assert.equal(q.options.filter(o=>o.id===q.answer).length,1);
  assert.ok(q.options.every(o=>o.feedback.length>11));
  assert.ok(q.options.filter(o=>o.id!==q.answer).every(o=>o.misconception.length>0));
  assert.ok(q.sourceIds.length>0);
 }
});
test("answer is gated until student chooses; retries, invalid answers and early advance are rejected",()=>{
 const fresh=startCoreQuiz();
 assert.equal(scoreCoreQuiz(fresh).answered,0);
 assert.throws(()=>advanceCoreQuiz(fresh),RangeError);
 assert.throws(()=>chooseCoreAnswer(fresh,"nonexistent"),RangeError);
 const wrong=CORE_QUESTIONS[0].options.find(o=>o.id!==CORE_QUESTIONS[0].answer);
 const selected=chooseCoreAnswer(fresh,wrong.id);
 assert.equal(scoreCoreQuiz(selected).correct,0);
 assert.deepEqual(scoreCoreQuiz(selected).reviewConcepts,["peep"]);
 assert.throws(()=>chooseCoreAnswer(selected,CORE_QUESTIONS[0].answer),RangeError);
 const next=advanceCoreQuiz(selected);
 assert.equal(next.index,1);
 assert.deepEqual(fresh,{index:0,answers:[],done:false});
 assert.deepEqual(startCoreQuiz(),fresh,"retry starts an independent in-memory run");
});
test("all ten questions progress exactly once and result is formative",()=>{
 let state=startCoreQuiz();
 for(let i=0;i<CORE_QUESTIONS.length;i++){
  state=chooseCoreAnswer(state,CORE_QUESTIONS[i].answer);
  state=advanceCoreQuiz(state);
 }
 assert.equal(state.done,true);
 assert.deepEqual(scoreCoreQuiz(state),{correct:10,answered:10,total:10,reviewConcepts:[]});
 assert.throws(()=>advanceCoreQuiz(state),RangeError);
 assert.throws(()=>chooseCoreAnswer(state,"a"),RangeError);
});
test("malformed content fails closed before rendering",()=>{
 const invalid=CORE_QUESTIONS.map(q=>({...q,options:q.options.map(o=>({...o}))}));
 invalid[0].conceptId="unknown";
 invalid[1].options[0].feedback="";
 invalid[2].sourceIds=["missing"];
 assert.ok(auditCoreQuiz(invalid).errors.length>=3);
});
test("knowledge check never modifies device settings, static monitoring or preclinical case data",()=>{
 const settings=JSON.stringify(initialSettings());
 const monitoring=JSON.stringify(MONITOR_REFERENCE);
 const cases=JSON.stringify(PRECLINICAL_CASES);
 let quiz=startCoreQuiz();
 quiz=chooseCoreAnswer(quiz,CORE_QUESTIONS[0].answer);
 quiz=advanceCoreQuiz(quiz);
 assert.equal(JSON.stringify(initialSettings()),settings);
 assert.equal(JSON.stringify(MONITOR_REFERENCE),monitoring);
 assert.equal(JSON.stringify(PRECLINICAL_CASES),cases);
});
