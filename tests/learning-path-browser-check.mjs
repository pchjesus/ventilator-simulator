import assert from "node:assert/strict";
import {chromium} from "playwright";
const browser=await chromium.launch({headless:true}),errors=[];
async function open(width){
 const p=await browser.newPage({viewport:{width,height:900}});
 p.on("pageerror",e=>errors.push(width+": "+e.message));
 const r=await p.goto("http://127.0.0.1:8077",{waitUntil:"networkidle"});
 assert.equal(r.status(),200);return p;
}
try{
 for(const w of [320,360,390,700,960,1100,1440]){
  const p=await open(w);
  assert.equal(await p.locator(".core-learning-steps [role=listitem]").count(),5);
  assert.equal(await p.locator(".learning-quick-nav [data-learning-jump]").count(),5);
  assert.equal(await p.locator("[data-review-target]").count(),3);
  assert.match(await p.locator("#learning-progress-status").textContent(),/CORE: 시작 전.*LAB: 시작 전.*CASE: 시작 전/);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=4,"viewport "+w+" overflow "+overflow);
  await p.close();
 }
 const p=await open(1440);
 const monitor=await p.locator("#monitor").textContent();
 const settings=await p.locator("#settings").textContent();
 await p.locator("#core-quiz-root .core-quiz-primary").click();
 assert.match(await p.locator("#learning-progress-status").textContent(),/CORE: 학습 중/);
 await p.locator(".core-quiz-answer").first().click();
 const feedback=await p.locator(".core-quiz-feedback").textContent();
 await p.locator('[data-learning-jump="lab"]').click();
 await p.locator("#lab-start").click();
 assert.match(await p.locator("#learning-progress-status").textContent(),/LAB: 완료 0\/3 · 진행 1/);
 assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
 await p.locator("#lab-predict-root input[type=radio]").first().check();
 await p.locator("#lab-predict-submit").click();
 assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
 await p.locator("#lab-to-observation").click();
 await p.locator("#lab-to-interpret").click();
 await p.locator("#lab-interpret-root input[type=radio]").first().check();
 await p.locator("#lab-interpret-submit").click();
 await p.locator("#lab-to-review").click();
 assert.match(await p.locator("#learning-progress-status").textContent(),/LAB: 완료 1\/3/);
 assert.equal(await p.locator("#lab-final-review .learning-next-actions button").count(),2);
 assert.equal(await p.locator("#lab-predict-submit").count(),0,"finished LAB cannot resubmit prediction");
 await p.locator("#lab-final-review .learning-next-actions button").last().click();
 assert.equal(await p.locator(".case-card").count(),4);
 await p.locator(".case-card .case-primary").first().click();
 assert.match(await p.locator("#learning-progress-status").textContent(),/CASE: 완료 0\/4 · 진행 1/);
 await p.locator('[data-learning-jump="quiz"]').click();
 assert.equal(await p.locator(".core-quiz-feedback").textContent(),feedback);
 assert.equal(await p.locator("#settings").textContent(),settings);
 assert.equal(await p.locator("#monitor").textContent(),monitor);
 // Review must never replace a partially answered CORE/LAB/CASE session.
 await p.locator('.learning-quick-nav [data-learning-jump="review"]').click();
 assert.equal(await p.locator("#learning-review").isVisible(),true);
 assert.equal(await p.locator("#learning-review").evaluate(el=>el===document.activeElement),true);
 await p.locator('[data-review-target="quiz"]').click();
 assert.equal(await p.locator(".core-quiz-feedback").textContent(),feedback);
 await p.locator('[data-review-target="lab"]').click();
 assert.equal(await p.locator("#panel-core").isVisible(),true);
 await p.locator('[data-review-target="case"]').click();
 assert.match(await p.locator(".case-progress").textContent(),/문항 1 \/ 3/);
 assert.deepEqual(errors,[]);
 await p.close();
 console.log("v0.6.0 guided path and seven responsive widths passed");
}finally{await browser.close();}
