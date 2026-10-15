import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";

const browser=await chromium.launch({headless:true});
await fs.mkdir("artifacts/browser",{recursive:true});
const errors=[];
async function open(width,height=900){
 const p=await browser.newPage({viewport:{width,height}});
 p.on("pageerror",err=>errors.push(width+" page: "+err.message));
 p.on("console",msg=>{if(msg.type()==="error")errors.push(width+" console: "+msg.text());});
 const res=await p.goto("http://127.0.0.1:8077",{waitUntil:"networkidle",timeout:30000});
 assert.equal(res.status(),200);
 return p;
}
async function observeNewLab(page){
 await page.locator("#lab-predict-root input[type=radio]").first().check();
 await page.locator("#lab-predict-submit").click();
 await page.locator("#lab-to-observation").click();
}
try{
 const p=await open(1440);
 assert.equal(await p.locator("#mobile-tools").getAttribute("open"),"");
 assert.equal(await p.locator("#study-only-toggle").isVisible(),true);
 const settings=await p.locator("#settings").textContent();
 const monitor=await p.locator("#monitor").textContent();
 await p.locator('[data-layout="device"]').click();
 assert.equal(await p.evaluate(()=>document.body.dataset.layout),"device");
 await p.locator("#core-quiz-root .core-quiz-primary").click();
 await p.locator(".core-quiz-answer").first().click();
 const feedback=await p.locator(".core-quiz-feedback").textContent();
 await p.locator("#lab-start").click();
 await p.locator('[data-lab-experiment="fio2"]').click();
 await observeNewLab(p);
 await p.locator('[data-lab-graph="flow"]').click();
 assert.equal(await p.locator("#lab-overlap-note").isVisible(),true);
 assert.match(await p.locator("#lab-overlap-note").textContent(),/실제 환자/);
 assert.equal(await p.locator('[data-lab-series="baseline"]').getAttribute("d"),await p.locator('[data-lab-series="trial"]').getAttribute("d"));
 await p.locator('[data-lab-experiment="rate"]').click();
 assert.equal(await p.locator("#lab-overlap-note").isVisible(),false);
 await p.locator("#study-only-toggle").click();
 assert.equal(await p.locator("#study-only-toggle").getAttribute("aria-pressed"),"true");
 assert.equal(await p.locator("#device-panel").isVisible(),false);
 assert.equal(await p.evaluate(()=>document.body.dataset.layout),"device","focus does not overwrite preset");
 const focusMeasure=await p.locator(".study-panel").evaluate(el=>({width:el.getBoundingClientRect().width,position:getComputedStyle(el).position,maxHeight:getComputedStyle(el).maxHeight}));
 assert.ok(focusMeasure.width>1000,"study-only must occupy whole reading width: "+focusMeasure.width);
 assert.equal(focusMeasure.position,"static","sticky quiz must be disabled while learning only");
 assert.equal(focusMeasure.maxHeight,"none");
 assert.equal(await p.locator(".core-quiz-feedback").textContent(),feedback);
 assert.equal(await p.locator('[data-lab-experiment="rate"]').getAttribute("aria-pressed"),"true");
 await p.screenshot({path:"artifacts/browser/v0533-study-only-desktop.png",fullPage:false});
 await p.locator('[data-learning-jump="case"]').click();
 assert.equal(await p.locator("#panel-case").isVisible(),true);
 assert.equal(await p.locator(".case-card").count(),4);
 await p.locator('[data-learning-jump="quiz"]').click();
 assert.equal(await p.locator("#panel-core").isVisible(),true);
 assert.equal(await p.locator(".core-quiz-feedback").textContent(),feedback);
 assert.equal(await p.locator("#settings").textContent(),settings);
 assert.equal(await p.locator("#monitor").textContent(),monitor);
 await p.locator("#study-only-toggle").click();
 assert.equal(await p.locator("#device-panel").isVisible(),true);
 assert.equal(await p.evaluate(()=>document.body.dataset.layout),"device");
 assert.equal(await p.locator('[data-lab-experiment="rate"]').getAttribute("aria-pressed"),"true");
 await p.locator("#open-reading").click();
 assert.equal(await p.locator("#reading-dialog").evaluate(d=>d.open),true);
 await p.keyboard.press("Escape");
 assert.equal(await p.locator("#reading-dialog").evaluate(d=>d.open),false);
 await p.screenshot({path:"artifacts/browser/v0533-study-split-desktop.png",fullPage:false});
 await p.close();
 console.log("PASS: desktop focus/readable A1 layout/preset/modal and CORE/CASE/LAB/device state preservation");

 for(const width of [1100,700,360,320]){
  const page=await open(width,780);
  assert.equal(await page.locator("#mobile-tools").evaluate(d=>d.open),width>700);
  if(width>700){
   await page.locator("#study-only-toggle").click();
   assert.equal(await page.locator("#device-panel").isVisible(),false);
   await page.locator("#study-only-toggle").click();
  }else{
   assert.equal(await page.locator("#study-only-toggle").isVisible(),false);
   const summary=page.locator("#mobile-tools > summary");
   assert.equal(await summary.isVisible(),true);
   assert.equal(await page.locator("#open-manual").isVisible(),false);
   await summary.click();
   assert.equal(await page.locator("#open-manual").isVisible(),true);
   assert.equal(await page.locator("#reset").isVisible(),true);
   await page.locator("#open-manual").click();
   assert.equal(await page.locator("#manual-dialog").evaluate(d=>d.open),true);
   await page.keyboard.press("Escape");
   assert.equal(await page.locator("#manual-dialog").evaluate(d=>d.open),false);
   await summary.click();
   assert.equal(await page.locator("#open-manual").isVisible(),false);
  }
  await page.locator('[data-learning-jump="lab"]').click();
  assert.equal(await page.locator("#panel-core").isVisible(),true);
  await page.locator("#lab-start").click();
  await page.locator('[data-lab-experiment="fio2"]').click();
  await observeNewLab(page);
  assert.equal(await page.locator("#lab-overlap-note").isVisible(),true);
  await page.locator('[data-lab-graph="volume"]').click();
  const r=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(r.scroll<=r.client+2,"horizontal overflow width "+width+": "+JSON.stringify(r));
  assert.match(await page.locator("#lab-graph-title").textContent(),/mL/);
  await page.locator("#lab-graph").scrollIntoViewIfNeeded();
  await page.screenshot({path:"artifacts/browser/v0533-study-lab-"+width+".png",fullPage:false});
  await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log("PASS: 1100/700/360/320 mobile tools, learning jumps, LAB and no JS errors");
}finally{await browser.close()}
