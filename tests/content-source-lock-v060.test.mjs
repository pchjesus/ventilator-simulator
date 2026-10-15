import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

/* Frozen to main 704e6401eb35aad9aabdbb726d8d8d5f1455f8c5 (v0.5.4).
 * Do not update hashes to conceal changed model, answer, clinical or Boyacto content.
 * A normal release VERSION string bump is the only permitted normalization. */
const frozen={
  "src/sim-model.js": "a8fe649f9e561f11a65c5bb030f4c6473944b67c",
  "src/waveform-model.js": "e6d8ed6905eca0ec4dc15ee05a5e07553470be93",
  "src/waveform-compare.js": "f3ee7a719e6f11f2f69334e7ddaacae1ce406833",
  "src/lab-engine.js": "0f0c5db9aa7d674b6015aa11c8614f7529eba334",
  "src/lab-lessons.js": "da82de88d554e2acbac624507f9aeb65bc61823d",
  "src/setting-editor.js": "fafeea25e72da9e64d3e6f4a305eb88f5f36c78b",
  "src/student-learning.js": "9a650c4cc15eb720a4928437e90f56b0e9a4cd54",
  "src/core-quiz.js": "00c23176a68344941dcfbcad42848ee53fb38a8b",
  "src/preclinical-cases.js": "92ab73ffd3ac65cc7c8f0c86741b29b0ae36aea6",
  "src/case-clinical-data.js": "b1165f311b2358c1e6cf8f86120895a55347460c",
  "src/case-actions.js": "939a5750ec654fbbc532c91fe58ae2d0bafff61b",
  "src/case-engine.js": "44a6f1d8a288bf24d23a7ef361ab0f703d54bfd9",
  "src/case-quality.js": "a0a446a8e475354f3f01de02bbb951bb8c8a81f6",
  "src/device-learning.js": "372ab83b0015dab3aebce85eb50991cb8a917aa8",
  "src/education-content.js": "00535a948bac59a65c21ff9d36ffa6fa86f7dd97",
  "src/learning-room-state.js": "e3d8b4a3e07b9fb719ce9cd60ff7d981623dfe19",
  "src/learning-room.js": "b7eed013d7210f67b74477f2cde18a17b4c442c3",
  "src/waveform-inspector.js": "726595f38c0dda94564c97f004584e61d011b070",
  "learn.html": "9888e8b5a5abe13a7a1879656c65973c657e3d31",
  "learning-room.css": "9839ec2988dd453a28d3ef86b2b2b1d4ee387f19"
};
function gitBlobSha(path){
 let bytes=readFileSync(new URL("../"+path,import.meta.url));
 if(path==="src/sim-model.js"){
  const text=bytes.toString("utf8");
  assert.match(text,/export const VERSION = "[^"]+";/,"VERSION export shape changed");
  bytes=Buffer.from(text.replace(/export const VERSION = "[^"]+";/,'export const VERSION = "0.5.4";'),"utf8");
 }
 return createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");
}
test("original model, content, learning room and teaching source Git blobs remain unchanged",()=>{
 for(const [path,expected] of Object.entries(frozen)){
  assert.equal(gitBlobSha(path),expected,path+" drifted from approved v0.5.4; inspect risk and seek explicit approval");
 }
});
