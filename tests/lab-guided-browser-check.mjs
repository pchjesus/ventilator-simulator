import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";
const browser=await chromium.launch({headless:true});
await fs.mkdir("artifacts/browser",{recursive:true});
const errors=[];
async function open(width){
 const page=await browser.newPage({viewport:{width,height:820}});
 page.on("pageerror",error=>errors.push(width+" page: "+error.message));
 page.on("console",message=>{if(message.type()==="error")errors.push(width+" console: "+message.text());});
 const response=await page.goto("http://127.0.0.1:8077",{waitUntil:"networkidle",timeout:30000});
 assert.equal(response.status(),200);return page;
}
async function answer(p,phase="predict",index=0){
 const root=p.locator(phase==="predict"?"#lab-predict-root":"#lab-interpret-root");
 await root.locator("input[type=radio]").nth(index).check();
 await p.locator(phase==="predict"?"#lab-predict-submit":"#lab-interpret-submit").click();
}
async function observe(p){await answer(p);await p.locator("#lab-to-observation").click();}
try{
 for(const width of [1440,700,360,320]){
  const p=await open(width);
  const device=await p.locator("#settings").textContent(),fixed=await p.locator("#monitor").textContent();
  if(width>700)await p.locator("#waveform-pause").click();
  const graphBefore=await p.locator('#graph-pressure [data-phase="mandatory"]').first().getAttribute("d");
  await p.locator("#core-quiz-root .core-quiz-primary").click();
  await p.locator(".core-quiz-answer").first().click();
  const quiz=await p.locator(".core-quiz-feedback").textContent();
  await p.locator("#lab-start").click();
  assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
  assert.equal(await p.locator("#lab-graph title").count(),0);
  assert.equal(await p.locator("#lab-graph desc").count(),0);
  assert.equal(await p.locator("#lab-result-note").textContent(),"");
  assert.equal(await p.locator("#lab-overlap-note").textContent(),"");
  assert.equal(await p.locator("#lab-predict-root").getByText("모델 기준 정답").count(),0);
  assert.equal(await p.locator("#lab-interpret-root").isVisible(),false);
  assert.equal(await p.locator("#lab-to-observation").isVisible(),false);
  assert.equal(await p.locator("#lab-phase-status").textContent(),"예상 답안 선택·제출 전 · 관찰 파형 비공개");
  await p.locator("#lab-predict-root").scrollIntoViewIfNeeded();
  await p.screenshot({path:"artifacts/browser/v054-predict-"+width+".png",fullPage:false});
  // Exercise a wrong answer to make sure specific remediation is visible after submission only.
  await answer(p,"predict",2);
  assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
  assert.equal(await p.locator("#lab-predict-root .lab-answer-explanation").count(),3);
  assert.equal(await p.locator("#lab-predict-root input").count(),0);
  assert.equal(await p.locator("#lab-overlap-note").textContent(),"");
  await p.locator("#lab-to-observation").click();
  assert.equal(await p.locator("#lab-graph path[data-lab-series]").count(),2);
  assert.notEqual(await p.locator('[data-lab-series="baseline"]').getAttribute("d"),await p.locator('[data-lab-series="trial"]').getAttribute("d"));
  assert.equal(await p.locator("#lab-interpret-root").isVisible(),false);
  await p.locator("#lab-graph").scrollIntoViewIfNeeded();
  await p.screenshot({path:"artifacts/browser/v054-observe-"+width+".png",fullPage:false});
  await p.locator("#lab-to-interpret").click();
  assert.equal(await p.locator("#lab-interpret-root").isVisible(),true);
  assert.equal(await p.locator("#lab-interpret-root .lab-answer-explanation").count(),0);
  assert.equal(await p.locator("#lab-final-review").isVisible(),false);
  await answer(p,"interpret",0);
  assert.equal(await p.locator("#lab-interpret-root .lab-answer-explanation").count(),3);
  await p.locator("#lab-to-review").click();
  assert.equal(await p.locator("#lab-final-review").isVisible(),true);
  // FiO2 has its own unanswered state despite LAB-01 completion.
  await p.locator('[data-lab-experiment="fio2"]').click();
  assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
  assert.equal(await p.locator("#lab-result-note").textContent(),"");
  assert.equal(await p.locator("#lab-overlap-note").textContent(),"");
  assert.equal(await p.locator("#lab-graph title").count(),0);
  assert.equal(await p.locator("#lab-predict-root .lab-answer-explanation").count(),0);
  await observe(p);
  assert.equal(await p.locator("#lab-overlap-note").isVisible(),true);
  assert.equal(await p.locator('[data-lab-series="baseline"]').getAttribute("d"),await p.locator('[data-lab-series="trial"]').getAttribute("d"));
  await p.locator('[data-lab-graph="flow"]').click();
  assert.equal(await p.locator(".lab-zero-line").count(),1);
  await p.locator("#lab-graph").scrollIntoViewIfNeeded();
  await p.screenshot({path:"artifacts/browser/v054-fio2-"+width+".png",fullPage:false});
  await p.locator('[data-lab-experiment="rate"]').click();
  assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
  await observe(p);
  assert.equal(await p.locator("#lab-graph path[data-lab-series]").count(),2);
  await p.locator('[data-lab-experiment="peep"]').click();
  assert.equal(await p.locator("#lab-final-review").isVisible(),true,"LAB 01 must retain completed state");
  await p.locator('[data-lab-experiment="fio2"]').click();
  await p.locator("#lab-restart").click();
  assert.equal(await p.locator("#lab-observation-view").isVisible(),false);
  assert.equal(await p.locator("#lab-predict-root .lab-answer-explanation").count(),0);
  await p.locator('[data-lab-experiment="peep"]').click();
  assert.equal(await p.locator("#lab-final-review").isVisible(),true,"restart must not erase LAB 01");
  await p.locator('[data-study-target="clinical"]').click();
  assert.equal(await p.locator(".case-card").count(),4);
  await p.locator('[data-study-target="learning"]').click();
  assert.equal(await p.locator("#lab-final-review").isVisible(),true);
  assert.equal(await p.locator(".core-quiz-feedback").textContent(),quiz);
  assert.equal(await p.locator("#settings").textContent(),device);
  assert.equal(await p.locator("#monitor").textContent(),fixed);
  assert.equal(await p.locator('#graph-pressure [data-phase="mandatory"]').first().getAttribute("d"),graphBefore);
  const overflow=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(overflow.scroll<=overflow.client+2,"horizontal overflow "+width+" "+JSON.stringify(overflow));
  if(width<=360){const graph=await p.locator("#lab-graph").boundingBox();assert.ok(graph&&graph.x>=-1&&graph.x+graph.width<=width+1);}
  await p.locator("#lab-exit").click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),"lab-start");
  await p.locator("#lab-start").click();
  assert.equal(await p.locator("#lab-final-review").isVisible(),true,"close/reopen must retain LAB-01");
  await p.close();
 }
 assert.deepEqual(errors,[]);
 console.log("PASS: v0.5.4 D5-A phase gate, no early SVG/desc/result leak, six-question paths, per-LAB restart, CORE/CASE/device independence, 320/360/700/1440.");
}finally{await browser.close();}
