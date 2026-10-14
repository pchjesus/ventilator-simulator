import test from "node:test";
import assert from "node:assert/strict";
import {PRECLINICAL_CASES,CASE_SOURCES} from "../src/preclinical-cases.js";
import {auditCaseBank,evidenceKindLabel} from "../src/case-quality.js";
const copy=()=>structuredClone(PRECLINICAL_CASES);
test("shipped case bank has six traceable items, pending review and no missing links",()=>{
 const report=auditCaseBank(PRECLINICAL_CASES,CASE_SOURCES);
 assert.deepEqual(report.errors,[]);
 assert.equal(report.caseCount,4);assert.equal(report.itemCount,12);
 assert.equal(report.warnings.length,4,"the cases must remain marked as not clinically reviewed");
 assert.equal(new Set(report.items.map(x=>x.caseId+":"+x.stepId)).size,12);
 assert.ok(report.items.every(x=>x.objectiveIds.length>=1&&x.sourceIds.length>=1));
});
test("duplicated objectives and missing per-question objective IDs fail closed",()=>{
 const cases=copy();
 cases[0].objectives[1].id=cases[0].objectives[0].id;
 cases[0].steps[1].objectiveIds=["missing"];
 const errors=auditCaseBank(cases,CASE_SOURCES).errors.map(e=>e.reason).join(" ");
 assert.match(errors,/중복/);assert.match(errors,/학습목표/);
});
test("invalid evidence references and unsupported evidence categories block acceptance",()=>{
 const cases=copy();
 cases[0].steps[0].sourceIds=["nonexistent"];
 cases[0].steps[2].evidenceKind="never-reviewed";
 const report=auditCaseBank(cases,CASE_SOURCES);
 assert.ok(report.errors.some(x=>x.path.endsWith("sourceIds")));
 assert.ok(report.errors.some(x=>x.path.endsWith("evidence")));
 assert.match(evidenceKindLabel("guideline-principle"),/임상/);
});
test("missing rationales, duplicate choices and wrong answer keys are detected",()=>{
 const cases=copy();
 const step=cases[1].steps[0];
 step.options[1].feedback="";
 step.options[1].id=step.options[0].id;
 step.answer="not-an-option";
 const errors=auditCaseBank(cases,CASE_SOURCES).errors.map(e=>e.reason).join(" ");
 assert.match(errors,/피드백/);assert.match(errors,/중복/);assert.match(errors,/정답/);
});
test("review metadata is never auto promoted to approved by a successful structure check",()=>{
 const cases=copy();
 cases[0].review.approved=true;
 const report=auditCaseBank(cases,CASE_SOURCES);
 assert.ok(report.errors.some(e=>e.path.endsWith("review")));
 assert.equal(PRECLINICAL_CASES[0].review.approved,false);
});
test("bad source URLs and absent structured debrief fields are rejected",()=>{
 const cases=copy();
 cases[0].debrief=[];
 const sources=structuredClone(CASE_SOURCES);
 sources.aarc.url="http://example.org/no";
 const report=auditCaseBank(cases,sources);
 assert.ok(report.errors.some(x=>x.path.includes("debrief")));
 assert.ok(report.errors.some(x=>x.path.includes("sources")));
});
test("empty input yields diagnostics rather than throwing",()=>{
 assert.ok(auditCaseBank([],CASE_SOURCES).errors.length>0);
 assert.ok(auditCaseBank(PRECLINICAL_CASES,null).errors.length>0);
});
