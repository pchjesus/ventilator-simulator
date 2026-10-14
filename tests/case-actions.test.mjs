import test from "node:test";
import assert from "node:assert/strict";
import {PRECLINICAL_CASES,CASE_SOURCES} from "../src/preclinical-cases.js";
import {CASE_ACTION_EXERCISES,auditCaseAction} from "../src/case-actions.js";
import {auditCaseBank} from "../src/case-quality.js";
import {startCase,chooseCaseAnswer,caseScore} from "../src/case-engine.js";

test("MAS and severe RSV have exactly one optional nursing action; original four CASE scores unchanged",()=>{
 assert.equal(PRECLINICAL_CASES.length,4);
 for(const c of PRECLINICAL_CASES.slice(0,2))assert.ok(c.steps.every(s=>s.actionExercise===undefined));
 for(const c of PRECLINICAL_CASES.slice(2)){
  const actions=c.steps.filter(s=>s.actionExercise);
  assert.equal(actions.length,1);
  assert.equal(actions[0].id,c.steps[1].id);
  assert.strictEqual(actions[0].actionExercise,CASE_ACTION_EXERCISES[c.id]);
  assert.deepEqual(auditCaseAction(actions[0],c,CASE_SOURCES),[]);
  assert.equal(actions[0].actionExercise.options.length,3);
  const progress=chooseCaseAnswer(startCase(c.id),c.steps[0].answer);
  assert.deepEqual(caseScore(progress),{correct:1,answered:1,total:3});
 }
 assert.deepEqual(auditCaseBank(PRECLINICAL_CASES,CASE_SOURCES).errors,[]);
});
test("invalid action answer, source and return concept fail static source tracing",()=>{
 const caseCopy=structuredClone(PRECLINICAL_CASES[2]);
 const step=caseCopy.steps[1],task=step.actionExercise;
 task.answer="not-a-choice";task.reviewConceptIds=["unknown"];task.sourceIds=["unknown"];
 const findings=auditCaseAction(step,caseCopy,CASE_SOURCES);
 assert.ok(findings.some(x=>x.path.includes("answer")));
 assert.ok(findings.some(x=>x.path.includes("reviewConceptIds")));
 assert.ok(findings.some(x=>x.path.includes("sourceIds")));
});
