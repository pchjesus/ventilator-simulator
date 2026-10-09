import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS, initialSettings, adjustSetting, formatSetting} from "../src/sim-model.js";
test("initial state has one numeric value per control",()=>{
  const state=initialSettings();
  assert.equal(Object.keys(state).length, PARAMETERS.length);
  for(const p of PARAMETERS) assert.ok(state[p.id]>=p.min && state[p.id]<=p.max);
});
test("increments and bounds",()=>{
  const s=initialSettings();
  assert.equal(adjustSetting(s,"fio2",10).fio2,50);
  assert.equal(adjustSetting({...s,fio2:100},"fio2",10).fio2,100);
  assert.equal(adjustSetting({...s,peep:0},"peep",-0.1).peep,0);
});
test("decimal arithmetic is stable",()=>{
  let s=initialSettings();
  for(let i=0;i<7;i++) s=adjustSetting(s,"ti",0.1);
  assert.equal(s.ti,1.7);
  assert.equal(formatSetting("ti",s.ti),"1.7");
});
test("invalid changes leave state unchanged",()=>{
  const s=initialSettings();
  assert.strictEqual(adjustSetting(s,"missing",1),s);
  assert.strictEqual(adjustSetting(s,"fio2",0.1),s);
  assert.strictEqual(adjustSetting(s,"fio2",Number.NaN),s);
});
test("updates do not mutate previous state",()=>{
  const s=initialSettings();
  const next=adjustSetting(s,"rate",1);
  assert.notStrictEqual(next,s);
  assert.equal(s.rate,15);
  assert.equal(next.rate,16);
});
