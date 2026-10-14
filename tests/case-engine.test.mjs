import test from "node:test";
import assert from "node:assert/strict";
import {PRECLINICAL_CASES,CASE_SOURCES,findCase} from "../src/preclinical-cases.js";
import {startCase,chooseCaseAnswer,advanceCase,caseScore} from "../src/case-engine.js";

test("at least two preclinical cases have distinct objectives, 3 ordered stages and cited source links",()=>{
 assert.ok(PRECLINICAL_CASES.length>=2);
 assert.equal(new Set(PRECLINICAL_CASES.map(x=>x.id)).size,PRECLINICAL_CASES.length);
 for(const c of PRECLINICAL_CASES){
  assert.ok(c.premise.length>50);
  assert.ok(c.prebrief.length>40);
  assert.ok(c.vignette.length>=2);
  assert.ok(c.objectives.length>=3);
  assert.equal(c.steps.length,3);
  assert.ok(c.status.includes("미감수"));
  assert.equal(new Set(c.steps.map(x=>x.id)).size,c.steps.length);
  assert.ok(c.sources.length>0);
  for(const sourceId of c.sources){
    assert.match(CASE_SOURCES[sourceId].url,/^https:\/\//);
  }
  for(const s of c.steps){
    assert.ok(s.options.length>=3);
    assert.equal(new Set(s.options.map(o=>o.id)).size,s.options.length);
    assert.ok(s.options.some(o=>o.id===s.answer));
    assert.ok(s.options.every(o=>o.feedback.length>=15));
    assert.ok(s.explanation.length>=40);
  }
 }
});
test("case choice, feedback and progression form a deterministic independent state machine",()=>{
 const c=PRECLINICAL_CASES[0];
 let state=startCase(c.id);
 assert.equal(state.index,0);
 assert.deepEqual(caseScore(state),{correct:0,answered:0,total:3});
 for(let i=0;i<c.steps.length;i++){
   const prior=state;
   const correct=c.steps[i].answer;
   assert.throws(()=>advanceCase(state),RangeError);
   state=chooseCaseAnswer(state,correct);
   assert.equal(prior.answers.length,i,"old snapshot must not mutate");
   assert.throws(()=>chooseCaseAnswer(state,correct),RangeError,"cannot answer twice");
   assert.equal(caseScore(state).correct,i+1);
   state=advanceCase(state);
 }
 assert.equal(state.done,true);
 assert.deepEqual(caseScore(state),{correct:3,answered:3,total:3});
 assert.throws(()=>advanceCase(state),RangeError);
});
test("incorrect choices receive formative credit only and can be restarted",()=>{
 const c=PRECLINICAL_CASES[1];
 let state=startCase(c.id);
 const wrong=c.steps[0].options.find(o=>o.id!==c.steps[0].answer).id;
 state=chooseCaseAnswer(state,wrong);
 assert.deepEqual(caseScore(state),{correct:0,answered:1,total:3});
 state=advanceCase(state);
 assert.equal(state.index,1);
 assert.deepEqual(startCase(c.id),{caseId:c.id,index:0,answers:[],done:false});
});
test("invalid scenario and choices are rejected without side effects",()=>{
 assert.equal(findCase("not-found"),null);
 assert.throws(()=>startCase("not-found"),RangeError);
 const fresh=startCase(PRECLINICAL_CASES[0].id);
 assert.throws(()=>chooseCaseAnswer(fresh,"not-an-option"),RangeError);
 assert.equal(fresh.answers.length,0);
 assert.throws(()=>caseScore({caseId:"bad",index:0,answers:[],done:false}),RangeError);
 assert.throws(()=>advanceCase({caseId:fresh.caseId,index:-1,answers:[],done:false}),RangeError);
});

test("new MAS and RSV cases maintain separate three-step RAM states and pending review",()=>{for(const id of ["mas-neonate","rsv-infant"]){const c=findCase(id);assert.equal(c.review.approved,false);assert.equal(c.steps.length,3);let s=startCase(id);let n=chooseCaseAnswer(s,c.steps[0].answer);assert.equal(s.answers.length,0);assert.deepEqual(caseScore(n),{correct:1,answered:1,total:3});assert.throws(()=>chooseCaseAnswer(n,c.steps[0].answer),RangeError);}});
