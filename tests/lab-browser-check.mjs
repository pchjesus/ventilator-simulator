import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";

const browser=await chromium.launch({headless:true});
await fs.mkdir("artifacts/browser",{recursive:true});
const errors=[];
async function open(width=1440,height=900){
 const page=await browser.newPage({viewport:{width,height}});
 page.on("pageerror",e=>errors.push("pageerror "+width+": "+e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push("console "+width+": "+m.text())});
 const response=await page.goto("http://127.0.0.1:8077",{waitUntil:"networkidle",timeout:30000});
 assert.equal(response.status(),200);
 return page;
}
async function observeNewLab(page){
 await page.locator("#lab-predict-root input[type=radio]").first().check();
 await page.locator("#lab-predict-submit").click();
 await page.locator("#lab-to-observation").click();
}
try{
 const p=await open();
 assert.equal(await p.locator(".study-area-nav button").count(),3);
 assert.equal(await p.locator(".core-concept").count(),6);
 assert.equal(await p.locator(".case-card").count(),0);
 assert.equal(await p.locator("#lab-workspace").isVisible(),false);
 const settingText=await p.locator("#settings").textContent();
 const monitorText=await p.locator("#monitor").textContent();
 await p.locator("#waveform-pause").click();
 const originalGraph=await p.locator('#graph-pressure [data-phase="mandatory"]').first().getAttribute("d");
 await p.locator("#core-quiz-root .core-quiz-primary").click();
 await p.locator(".core-quiz-answer").first().click();
 const quizText=await p.locator(".core-quiz-feedback").textContent();
 await p.locator('#settings .setting[data-setting-id="peep"] .setting-select').click();
 await p.locator("#editor-number").fill("9");
 assert.equal(await p.locator("#setting-editor").evaluate(d=>d.open),true);
 // Pending must not affect fixed-baseline LAB; close existing modal before entering.
 await p.locator("#editor-cancel").click();
 await p.locator("#lab-start").click();
 assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
 await observeNewLab(p);
 assert.equal(await p.locator("#lab-workspace").isVisible(),true);
 assert.match(await p.locator("#lab-comparison-summary").textContent(),/기준 5 → 실험 8/);
 const base=p.locator('[data-lab-series="baseline"]'),trial=p.locator('[data-lab-series="trial"]');
 assert.notEqual(await base.getAttribute("d"),await trial.getAttribute("d"));
 assert.equal(await p.locator("#lab-graph path").count(),2);
 await p.locator('[data-lab-experiment="rate"]').click();
 await observeNewLab(p);
 assert.match(await p.locator("#lab-comparison-summary").textContent(),/기준 15 → 실험 18/);
 assert.notEqual(await base.getAttribute("d"),await trial.getAttribute("d"));
 await p.locator('[data-lab-experiment="fio2"]').click();
 await observeNewLab(p);
 assert.equal(await base.getAttribute("d"),await trial.getAttribute("d"));
 assert.match(await p.locator("#lab-result-note").textContent(),/산소화 반응이 없다는 뜻은 아니야/);
 await p.locator('[data-lab-graph="flow"]').click();
 assert.equal(await p.locator(".lab-zero-line").count(),1);
 assert.match(await p.locator("#lab-graph-title").textContent(),/L\/min/);
 await p.locator('[data-lab-graph="volume"]').click();
 assert.match(await p.locator("#lab-graph-title").textContent(),/mL/);
 await p.locator('[data-study-target="clinical"]').click();
 assert.equal(await p.locator("#panel-case").isVisible(),true);
 assert.equal(await p.locator(".case-card").count(),4);
 await p.locator('[data-study-target="learning"]').click();
 assert.equal(await p.locator('[data-lab-experiment="fio2"]').getAttribute("aria-pressed"),"true");
 assert.equal(await p.locator('[data-lab-graph="volume"]').getAttribute("aria-pressed"),"true");
 assert.equal(await p.locator(".core-quiz-feedback").textContent(),quizText);
 assert.equal(await p.locator("#settings").textContent(),settingText);
 assert.equal(await p.locator("#monitor").textContent(),monitorText);
 assert.equal(await p.locator('#graph-pressure [data-phase="mandatory"]').first().getAttribute("d"),originalGraph);
 await p.screenshot({path:"artifacts/browser/v053-lab-desktop.png",fullPage:false});
 await p.locator("#lab-graph").scrollIntoViewIfNeeded();
 await p.screenshot({path:"artifacts/browser/v053-lab-compare-focused.png",fullPage:false});
 await p.locator("#lab-exit").click();
 assert.equal(await p.locator("#lab-workspace").isVisible(),false);
 assert.equal(await p.evaluate(()=>document.activeElement.id),"lab-start");
 await p.locator("#lab-start").click();
 assert.equal(await p.locator('[data-lab-experiment="peep"]').getAttribute("aria-pressed"),"true");
 await p.close();
 console.log("PASS: v0.5.3 desktop overlays, presets, CORE/CASE/device/Pending isolation, pause and focus");
 for(const width of [700,360,320]){
  const mobile=await open(width,780);
  await mobile.locator("#lab-start").click();
  await mobile.locator('[data-lab-graph="volume"]').click();
  await mobile.locator('[data-lab-experiment="rate"]').click();
  await observeNewLab(mobile);
  const graph=await mobile.locator("#lab-graph").boundingBox();
  assert.ok(graph.x>=-1&&graph.x+graph.width<=width+1,"SVG viewport "+width);
  if(width===320){
   const trace=await mobile.locator('#lab-graph [data-lab-series="trial"]').boundingBox();
   assert.ok(trace.height>=75,"mobile LAB trace too compressed for study: "+trace.height);
   assert.equal(await mobile.locator("#lab-graph").getAttribute("viewBox"),"0 0 380 235");
  }
  const bounds=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(bounds.scroll<=bounds.client+2,"horizontal page overflow at "+width+": "+JSON.stringify(bounds));
  await mobile.setViewportSize({width:Math.max(320,width-40),height:780});
  if(width===700)assert.equal(await mobile.locator("#lab-graph").getAttribute("viewBox"),"0 0 760 235");
  assert.equal(await mobile.locator('[data-lab-graph="volume"]').getAttribute("aria-pressed"),"true");
  assert.equal(await mobile.locator('[data-lab-experiment="rate"]').getAttribute("aria-pressed"),"true");
  await mobile.screenshot({path:"artifacts/browser/v053-lab-"+width+".png",fullPage:false});
  await mobile.close();
 }
 console.log("PASS: v0.5.3 LAB responsive graph selection at 700/360/320 and viewport changes");
 assert.deepEqual(errors,[]);
 console.log("PASS: v0.5.3 no browser JS errors");
}finally{await browser.close()}
