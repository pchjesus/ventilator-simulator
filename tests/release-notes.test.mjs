import test from "node:test";
import assert from "node:assert/strict";
import {RELEASE_CATEGORIES, RELEASE_NOTES,notesForCategory} from "../src/release-notes.js";
test("patch-note categories are unique, all entries are categorized",()=>{
 const categories=new Set(RELEASE_CATEGORIES.map(x=>x.id));
 assert.equal(categories.size,5);
 assert.equal(RELEASE_NOTES[0].version,"0.3.9");
 for(const version of RELEASE_NOTES){
  assert.ok(version.date);
  assert.ok(version.changes.length);
  for(const change of version.changes){
   assert.ok(categories.has(change.category));
   assert.ok(change.text.length>=15);
  }
 }
});
test("category filters retain only matching changes and preserve original data",()=>{
 assert.strictEqual(notesForCategory("all"),RELEASE_NOTES);
 for(const category of RELEASE_CATEGORIES){
  const notes=notesForCategory(category.id);
  assert.ok(notes.length>0,category.id);
  assert.ok(notes.every(x=>x.changes.length&&x.changes.every(c=>c.category===category.id)));
 }
 assert.deepEqual(notesForCategory("unknown"),[]);
 assert.ok(RELEASE_NOTES[0].changes.length>=5);
});
