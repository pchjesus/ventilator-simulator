import test from "node:test";
import assert from "node:assert/strict";
import {initialSettings} from "../src/sim-model.js";
import {generateWaveform,breathEvents,previewScales} from "../src/waveform-model.js";

const defaults=initialSettings();
test("waveform sample values remain finite and volume nonnegative",()=>{
  const s=generateWaveform(defaults,0,16,400);
  assert.equal(s.length,400);
  assert.ok(s.every(v=>Number.isFinite(v.pressure)&&Number.isFinite(v.flow)&&Number.isFinite(v.volume)&&v.volume>=-0.001));
  assert.ok(s.some(v=>v.phase==="mandatory")&&s.some(v=>v.phase==="spontaneous")&&s.some(v=>v.phase==="expiration"));
});
test("PEEP increases pressure baseline without changing modeled flow/volume",()=>{
  const a=generateWaveform(defaults,0,16,300);
  const b=generateWaveform({...defaults,peep:8},0,16,300);
  a.forEach((v,i)=>{assert.ok(Math.abs((b[i].pressure-v.pressure)-3)<1e-7);assert.equal(v.flow,b[i].flow);assert.equal(v.volume,b[i].volume);});
});
test("inspiratory pressure changes mandatory peak while spontaneous pressure support remains separate",()=>{
  const a=generateWaveform(defaults,0,16,600);
  const b=generateWaveform({...defaults,pi:18},0,16,600);
  assert.ok(b.some((v,i)=>v.phase==="mandatory"&&v.pressure>a[i].pressure+6));
  assert.ok(a.some((v,i)=>v.phase==="spontaneous"&&Math.abs(v.pressure-b[i].pressure)<1e-8));
});
test("PS changes spontaneous pressure without affecting mandatory portions",()=>{
  const a=generateWaveform(defaults,0,16,600);
  const b=generateWaveform({...defaults,ps:16},0,16,600);
  assert.ok(b.some((v,i)=>v.phase==="spontaneous"&&v.pressure>a[i].pressure+5));
  assert.ok(a.every((v,i)=>v.phase!=="mandatory"||v.pressure===b[i].pressure));
});
test("rate and inspiratory time alter breath timing",()=>{
  const regular=breathEvents(defaults,0,16).filter(x=>x.type==="mandatory").length;
  const fast=breathEvents({...defaults,rate:30},0,16).filter(x=>x.type==="mandatory").length;
  assert.ok(fast>regular);
  const short=generateWaveform({...defaults,ti:0.5},0,4,400);
  const long=generateWaveform({...defaults,ti:1.5},0,4,400);
  assert.notDeepEqual(short.map(v=>v.flow),long.map(v=>v.flow));
});
test("O2 and trigger do not falsely change unsupported physiological waveforms",()=>{
  const a=generateWaveform(defaults,1,12,200);
  const b=generateWaveform({...defaults,fio2:100,trigger:9},1,12,200);
  assert.deepEqual(a,b);
});
test("volume returns near zero at end expiration, expiration flow negative",()=>{
  const s=generateWaveform({...defaults,rate:35,ps:0},0,60/35,600);
  assert.ok(s.some(v=>v.phase==="expiration"&&v.flow<0));
  assert.ok(s[s.length-2].volume<1);
});
test("scales are positive and invalid sample arguments throw",()=>{
  const s=generateWaveform(defaults,0,10,100);
  const scales=previewScales(defaults,s);
  assert.ok(Object.values(scales).every(v=>v>0));
  assert.throws(()=>generateWaveform(defaults,0,0,100),RangeError);
  assert.throws(()=>generateWaveform(defaults,0,12,0),RangeError);
});

test("expiratory flow is the time derivative of expiratory volume",()=>{
  const settings={...defaults,rate:30,ps:0};
  const samples=generateWaveform(settings,0,2,1001);
  let verified=0;
  for(let i=1;i<samples.length-1;i++){
    const a=samples[i-1],b=samples[i],c=samples[i+1];
    if(a.phase!=="expiration"||b.phase!=="expiration"||c.phase!=="expiration")continue;
    const derivative=(c.volume-a.volume)/(c.time-a.time)*0.06;
    assert.ok(Math.abs(derivative-b.flow)<0.08, "inconsistent expiry flow at t="+b.time);
    verified++;
  }
  assert.ok(verified>150,"not enough expiratory samples");
});
test("expiratory flow smoothly returns to zero at breath boundary",()=>{
  const settings={...defaults,rate:30,ps:0};
  const samples=generateWaveform(settings,0,2,2000);
  const lastExpiration=samples.filter(s=>s.phase==="expiration").at(-1);
  assert.ok(lastExpiration.volume<0.01,"residual volume too high");
  assert.ok(Math.abs(lastExpiration.flow)<0.1,"expiratory flow should approach zero");
});
test("invalid external rates and settings reject safely",()=>{
  assert.throws(()=>breathEvents({...defaults,rate:0},0,16),RangeError);
  assert.throws(()=>breathEvents({...defaults,rate:1000},0,16),RangeError);
  assert.throws(()=>generateWaveform({...defaults,ti:0},0,16,200),RangeError);
  assert.throws(()=>generateWaveform({...defaults,pi:Infinity},0,16,200),RangeError);
});
