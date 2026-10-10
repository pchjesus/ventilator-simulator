import test from "node:test";
import assert from "node:assert/strict";
import {initialSettings,adjustSetting} from "../src/sim-model.js";
import {beginSettingEdit,preferredEditStep,stepSettingEdit,acceptSettingEdit} from "../src/setting-editor.js";

test("staged edit starts from committed state without mutation",()=>{
 const committed=initialSettings();
 const edit=beginSettingEdit(committed,"pi");
 assert.deepEqual(edit,{id:"pi",original:10,pending:10});
 const next=stepSettingEdit(edit,1);
 assert.equal(edit.pending,10);assert.equal(next.pending,11);assert.equal(committed.pi,10);
});
test("Accept commits exactly one setting, Cancel discards by leaving state intact",()=>{
 const committed=initialSettings();
 const edit=stepSettingEdit(beginSettingEdit(committed,"peep"),0.1);
 assert.equal(committed.peep,5);
 const changed=acceptSettingEdit(committed,edit);
 assert.equal(changed.peep,5.1);assert.equal(committed.peep,5);
 assert.deepEqual(acceptSettingEdit(committed,null),committed);
 assert.strictEqual(acceptSettingEdit(committed,beginSettingEdit(committed,"peep")),committed);
});
test("bounds, decimal increments and invalid directions follow study model",()=>{
 const original=beginSettingEdit(initialSettings(),"peep");
 let edit=original;
 for(let i=0;i<400;i++) edit=stepSettingEdit(edit,0.1);
 assert.equal(edit.pending,20);
 for(let i=0;i<400;i++) edit=stepSettingEdit(edit,-0.1);
 assert.equal(edit.pending,0);
 assert.strictEqual(stepSettingEdit(edit,3),edit);
 assert.strictEqual(stepSettingEdit(edit,NaN),edit);
 assert.equal(preferredEditStep("peep"),0.1);
 assert.equal(preferredEditStep("pi"),0.1); // existing teaching increments, not OEM precision
});
test("stale edit cannot overwrite changed quick-mode or reset values",()=>{
 const base=initialSettings();
 const editing=stepSettingEdit(beginSettingEdit(base,"fio2"),1);
 const changed=adjustSetting(base,"fio2",10);
 assert.strictEqual(acceptSettingEdit(changed,editing),changed);
 assert.equal(changed.fio2,50);
});
test("unknown setting and malformed payload cannot commit",()=>{
 const base=initialSettings();
 assert.equal(beginSettingEdit(base,"missing"),null);
 assert.equal(preferredEditStep("missing"),null);
 assert.strictEqual(acceptSettingEdit(base,{id:"pi",original:10,pending:1000}),base);
 assert.strictEqual(acceptSettingEdit(base,{id:"pi",original:10,pending:NaN}),base);
});
