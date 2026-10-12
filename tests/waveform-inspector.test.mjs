import test from "node:test";
import assert from "node:assert/strict";
import {clampRatio,ratioFromClientX,inspectAt} from "../src/waveform-inspector.js";
import {initialSettings} from "../src/sim-model.js";
import {generateWaveform} from "../src/waveform-model.js";

test("cursor ratios clamp to the graph interval",()=>{
 assert.equal(clampRatio(-2),0);assert.equal(clampRatio(2),1);
 assert.equal(clampRatio(.375),.375);
 assert.throws(()=>clampRatio(Infinity),RangeError);
 assert.throws(()=>clampRatio(NaN),RangeError);
});
test("pointer positions map safely to the nearest normalized fraction",()=>{
 assert.equal(ratioFromClientX(250,100,600),.25);
 assert.equal(ratioFromClientX(-400,100,600),0);
 assert.equal(ratioFromClientX(900,100,600),1);
 assert.throws(()=>ratioFromClientX(0,0,0),RangeError);
 assert.throws(()=>ratioFromClientX(NaN,0,100),RangeError);
});
test("cursor values come from existing synthetic waveform, not fixed monitoring data",()=>{
 const samples=generateWaveform(initialSettings(),0,16,320);
 const start=inspectAt(samples,0),middle=inspectAt(samples,.5),end=inspectAt(samples,1);
 assert.equal(start.index,0);
 assert.equal(end.index,319);
 assert.equal(middle.index,160);
 assert.deepEqual(middle.point,samples[160]);
 assert.ok(Number.isFinite(middle.point.flow));
 assert.ok(["mandatory","spontaneous","expiration"].includes(middle.point.phase));
});
test("cursor lookup is deterministic and doesn't mutate sample data",()=>{
 const samples=generateWaveform(initialSettings(),3.25,16,320);
 const before=JSON.stringify(samples);
 const first=inspectAt(samples,.73),second=inspectAt(samples,.73);
 assert.deepEqual(first,second);assert.equal(JSON.stringify(samples),before);
});
test("malformed sample lists fail safely",()=>{
 assert.throws(()=>inspectAt([],0),RangeError);
 assert.throws(()=>inspectAt([{pressure:1}],0),RangeError);
 assert.throws(()=>inspectAt([{pressure:1},{}],.5),RangeError);
 assert.throws(()=>inspectAt([{time:0,pressure:1,flow:1,volume:1,phase:"unknown"},{time:1,pressure:1,flow:1,volume:1,phase:"expiration"}],0),RangeError);
});
