import test from "node:test";
import assert from "node:assert/strict";
import {DEVICE_REFERENCE, PARAMETERS, initialSettings} from "../src/sim-model.js";

test("all seven educational controls map to manufacturer range references",()=>{
 assert.deepEqual(PARAMETERS.map(p=>p.id).sort(),Object.keys(DEVICE_REFERENCE).sort());
 for(const ref of Object.values(DEVICE_REFERENCE)) assert.ok(ref.min<ref.max&&ref.resolution&&ref.detail);
});
test("adult reference bounds match PB980 Operator's Manual Table 11-9",()=>{
 const expected={fio2:[21,100],peep:[0,45],rate:[1,100],pi:[5,90],ti:[0.2,8],ps:[0,70],trigger:[0.2,20]};
 for(const [id,[min,max]] of Object.entries(expected))assert.deepEqual([DEVICE_REFERENCE[id].min,DEVICE_REFERENCE[id].max],[min,max],id);
});
test("manufacturer facts do not silently override stable study controls",()=>{
 assert.equal(initialSettings().pi,10);
 assert.equal(PARAMETERS.find(p=>p.id==="pi").max,30);
 assert.equal(DEVICE_REFERENCE.pi.max,90);
 assert.ok(PARAMETERS.find(p=>p.id==="ti").steps.includes(0.1));
 assert.equal(DEVICE_REFERENCE.ti.resolution,"0.01 s");
});
