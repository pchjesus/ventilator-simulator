import test from "node:test";
import assert from "node:assert/strict";
import {initialSettings} from "../src/sim-model.js";
import {compareWaveforms,COMPARE_COUNT,COMPARE_TYPES} from "../src/waveform-compare.js";
const initial=()=>initialSettings();
const values=(result,part,name)=>result[part].map(p=>p[name]);
test("same clock and finite, shared scales for three comparison types",()=>{
 const r=compareWaveforms(initial(),{...initial(),peep:8});
 assert.equal(r.start,0);assert.equal(r.duration,16);assert.equal(r.count,COMPARE_COUNT);assert.equal(r.count,320);
 assert.equal(r.baseline[0].time,0);assert.equal(r.baseline.at(-1).time,16);
 for(let i=0;i<r.count;i++)assert.equal(r.baseline[i].time,r.trial[i].time);
 for(const name of Object.keys(COMPARE_TYPES)){
  const axis=r.axes[name];assert.ok(axis.min<axis.max);
  for(const part of ["baseline","trial"])for(const sample of r[part]){
   assert.ok(Number.isFinite(sample[name]));
   assert.ok(sample[name]>=axis.min-1e-8&&sample[name]<=axis.max+1e-8);
  }
 }
 assert.equal(r.axes.pressure.min,0);assert.equal(r.axes.volume.min,0);
 assert.equal(r.axes.flow.min,-r.axes.flow.max);
 assert.ok(r.baseline.some(x=>x.flow<0)&&r.baseline.some(x=>x.flow>0));
});
test("identical trial/settings are sample-by-sample equal",()=>{
 const r=compareWaveforms(initial(),initial());
 for(const name of Object.keys(COMPARE_TYPES))assert.deepEqual(values(r,"baseline",name),values(r,"trial",name));
 assert.deepEqual(r,compareWaveforms(initial(),initial()));
});
test("PEEP 5→8 shifts pressure, not flow or volume",()=>{
 const r=compareWaveforms(initial(),{...initial(),peep:8});
 assert.equal(r.trial[0].pressure-r.baseline[0].pressure,3);
 assert.notDeepEqual(values(r,"baseline","pressure"),values(r,"trial","pressure"));
 for(const n of ["flow","volume"])assert.deepEqual(values(r,"baseline",n),values(r,"trial",n));
});
test("f 15→18 changes generated breathing interval",()=>{
 const r=compareWaveforms(initial(),{...initial(),rate:18});
 assert.notDeepEqual(values(r,"baseline","pressure"),values(r,"trial","pressure"));
});
test("FiO2 and V-TRIG do not affect current simple waveform model",()=>{
 for(const [id,value]of[["fio2",60],["trigger",5]]){
  const r=compareWaveforms(initial(),{...initial(),[id]:value});
  for(const n of Object.keys(COMPARE_TYPES))assert.deepEqual(values(r,"baseline",n),values(r,"trial",n),id+" "+n);
 }
});
test("comparison copies inputs, never mutates device or pending edits",()=>{
 const baseline=initial(),trial={...initial(),peep:8},device=initial(),pending={peep:19};
 const r=compareWaveforms(baseline,trial);
 assert.deepEqual(device,initial());assert.deepEqual(pending,{peep:19});
 assert.equal(baseline.peep,5);assert.equal(trial.peep,8);
 baseline.peep=11;trial.rate=30;
 assert.equal(r.baselineSettings.peep,5);assert.equal(r.trialSettings.rate,15);
});
test("invalid rate rejected without mutation",()=>{
 const bad={...initial(),rate:0};
 assert.throws(()=>compareWaveforms(initial(),bad),RangeError);assert.equal(bad.rate,0);
});
