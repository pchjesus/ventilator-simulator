import test from "node:test";
import assert from "node:assert/strict";
import {LAB_IDS,LAB_PHASES,createLabSession,submitLabPrediction,beginLabObservation,beginLabInterpretation,submitLabInterpretation,completeLab,labHasObservation,labHasPredictionFeedback,labHasInterpretationFeedback} from "../src/lab-engine.js";
import {LAB_LESSONS,LAB_SOURCES,labLesson,labQuestion,auditLabLessons} from "../src/lab-lessons.js";
test("D5-A lesson audit: 3 LABs, 6 unique questions, 2 phases each, pending review",()=>{
 const audit=auditLabLessons();
 assert.equal(audit.valid,true,audit.errors.join("; "));assert.equal(audit.count,6);
 assert.equal(LAB_LESSONS.length,3);
 for(const id of LAB_IDS){
  const lesson=labLesson(id);assert.ok(lesson);
  assert.deepEqual(lesson.questions.map(q=>q.phase),["predict","interpret"]);
  for(const q of lesson.questions){
   assert.equal(q.review.approved,false);assert.equal(q.review.status,"pending-clinical-review");
   assert.ok(q.sourceIds.some(s=>LAB_SOURCES[s].kind==="app-implementation"));
   assert.ok(q.options.some(o=>o.id===q.answer));
  }
 }
});
test("prediction gate refuses interpretation and early observation",()=>{
 let s=createLabSession("fio2");
 assert.equal(s.phase,"predict-unanswered");
 assert.equal(labHasObservation(s),false);assert.equal(labHasPredictionFeedback(s),false);
 assert.throws(()=>beginLabObservation(s),/phase gate/);
 assert.throws(()=>beginLabInterpretation(s),/phase gate/);
 assert.throws(()=>completeLab(s),/phase gate/);
 assert.throws(()=>submitLabPrediction(s,"invalid",["a","b","c"]),/Invalid/);
 s=submitLabPrediction(s,"a",["a","b","c"]);
 assert.equal(s.phase,"predict-answered");assert.equal(s.predictedChoice,"a");
 assert.equal(labHasPredictionFeedback(s),true);assert.equal(labHasObservation(s),false);
 assert.throws(()=>submitLabPrediction(s,"b",["a","b","c"]),/already submitted/);
 assert.throws(()=>beginLabInterpretation(s),/phase gate/);
});
test("full D5-A predict → observation → interpret → completed read-only path",()=>{
 for(const id of LAB_IDS){
  const lesson=labLesson(id);
  let s=createLabSession(id),previous=s;
  const p=labQuestion(id,"predict"),i=labQuestion(id,"interpret");
  s=submitLabPrediction(s,p.options[0].id,p.options.map(o=>o.id));
  assert.equal(previous.predictedChoice,null,"previous immutable session");
  s=beginLabObservation(s);assert.equal(labHasObservation(s),true);
  assert.equal(labHasInterpretationFeedback(s),false);
  assert.throws(()=>submitLabInterpretation(s,i.options[0].id,i.options.map(o=>o.id)),/not available/);
  s=beginLabInterpretation(s);
  assert.equal(s.phase,"interpret-unanswered");
  assert.throws(()=>completeLab(s),/phase gate/);
  s=submitLabInterpretation(s,i.options[0].id,i.options.map(o=>o.id));
  assert.equal(s.phase,"interpret-answered");assert.equal(labHasInterpretationFeedback(s),true);
  assert.throws(()=>submitLabInterpretation(s,i.options[1].id,i.options.map(o=>o.id)),/already submitted/);
  s=completeLab(s);assert.equal(s.phase,"completed");
  assert.equal(s.predictedChoice,p.options[0].id);
  assert.equal(s.interpretedChoice,i.options[0].id);
  assert.throws(()=>beginLabObservation(s),/phase gate/);
  assert.notEqual(createLabSession(id),s);
 }
});
test("LAB identity, phase and options validation refuse cross-contamination",()=>{
 assert.deepEqual(LAB_PHASES,["not-started","predict-unanswered","predict-answered","observation","interpret-unanswered","interpret-answered","completed"]);
 assert.throws(()=>createLabSession("case"),/Unknown/);
 let a=createLabSession("peep"),b=createLabSession("rate");
 a=submitLabPrediction(a,"a",["a","b","c"]);
 assert.equal(b.phase,"predict-unanswered");assert.equal(b.predictedChoice,null);
 assert.throws(()=>submitLabPrediction(b,"a",["a","a","c"]),/Invalid/);
 assert.throws(()=>submitLabPrediction(b,undefined,["a","b","c"]),/Invalid/);
});
test("content audit detects missing answer, missing evidence and duplicate options",()=>{
 const clone=()=>structuredClone(LAB_LESSONS);
 let l=clone();l[0].questions[0].answer="missing";assert.ok(auditLabLessons(l).errors.some(s=>s.includes("Missing answer")));
 l=clone();l[1].questions[1].sourceIds=[];assert.ok(auditLabLessons(l).errors.some(s=>s.includes("source")));
 l=clone();l[2].questions[0].options[1].text=l[2].questions[0].options[0].text;assert.ok(auditLabLessons(l).errors.some(s=>s.includes("options")));
 l=clone();l[0].questions[0].review.approved=true;assert.ok(auditLabLessons(l).errors.some(s=>s.includes("Clinical approval")));
});
test("six questions have no merged CORE/CASE scoring or clinical approval attributes",()=>{
 const all=LAB_LESSONS.flatMap(l=>l.questions);
 assert.equal(all.length,6);assert.equal(new Set(all.map(q=>q.id)).size,6);
 assert.ok(all.every(q=>!Object.hasOwn(q,"score")&&!Object.hasOwn(q,"points")&&q.review.approved===false));
});
