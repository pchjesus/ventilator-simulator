import test from "node:test";
import assert from "node:assert/strict";
import {PRECLINICAL_CASES,CASE_SOURCES} from "../src/preclinical-cases.js";
import {CASE_CLINICAL_DATA,auditClinicalData} from "../src/case-clinical-data.js";
import {auditCaseBank} from "../src/case-quality.js";

test("adult case fixtures unchanged; pediatric records are static, sourced, and medically unreviewed",()=>{
 assert.equal(PRECLINICAL_CASES.length,4);
 assert.equal(PRECLINICAL_CASES.filter(x=>x.clinicalData).length,2);
 assert.equal(PRECLINICAL_CASES[0].clinicalData,undefined);
 for(const c of PRECLINICAL_CASES.slice(2)){
  assert.equal(c.review.approved,false);
  assert.equal(c.clinicalData.modelPolicy,"reference-only");
  assert.equal(auditClinicalData(c,CASE_SOURCES).length,0);
  assert.deepEqual(c.clinicalData,CASE_CLINICAL_DATA[c.id]);
  assert.ok(c.clinicalData.panels.every(x=>x.sourceIds.length&&x.collectedAt&&x.oxygenContext));
 }
 assert.deepEqual(auditCaseBank(PRECLINICAL_CASES,CASE_SOURCES).errors,[]);
});
test("MAS ABGA samples, units, prior timing, and respiratory acid-base examples coherent",()=>{
 const c=PRECLINICAL_CASES[2],gas=c.clinicalData.panels.find(x=>x.id==="mas-abga");
 assert.equal(gas.sampleType,"arterial");
 assert.equal(gas.availableFromStep,1);
 assert.ok(gas.values.some(x=>x.id==="po2"&&x.unit==="mmHg"));
 assert.match(gas.collectedAt,/15분/);
 const copy=structuredClone(c);
 copy.clinicalData.panels.find(x=>x.id==="mas-abga").values.find(x=>x.id==="hco3").value=8;
 assert.ok(auditClinicalData(copy,CASE_SOURCES).some(x=>x.reason.includes("일관성")));
});
test("RSV capillary result never interpreted as arterial oxygenation and missing trace is rejected",()=>{
 const c=PRECLINICAL_CASES[3];
 const cbg=c.clinicalData.panels.find(x=>x.id==="rsv-cbg");
 assert.equal(cbg.sampleType,"capillary");
 assert.equal(cbg.availableFromStep,1);
 assert.equal(cbg.values.some(x=>x.id==="po2"),false);
 const copy=structuredClone(c);
 copy.clinicalData.panels.find(x=>x.id==="rsv-cbg").values.push({id:"po2",label:"PO2",value:40,unit:"mmHg"});
 assert.ok(auditClinicalData(copy,CASE_SOURCES).some(x=>x.reason.includes("CBG PO₂")));
 copy.clinicalData.panels[1].sourceIds=["not-valid"];
 assert.ok(auditClinicalData(copy,CASE_SOURCES).some(x=>x.reason.includes("근거")));
});
test("invalid publication step and unsafe physiology contract fail closed",()=>{
 const c=structuredClone(PRECLINICAL_CASES[2]);
 c.clinicalData.panels[0].availableFromStep=99;
 c.clinicalData.modelPolicy="predicted-patient-monitor";
 const errors=auditCaseBank([c],CASE_SOURCES).errors;
 assert.ok(errors.some(x=>x.path.includes("clinicalData")));
});
