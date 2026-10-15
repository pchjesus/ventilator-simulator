import assert from "node:assert/strict";
import {chromium} from "playwright";

const browser=await chromium.launch({headless:true});
const errors=[];
async function pageAt(width,entry="learn.html"){
 const page=await browser.newPage({viewport:{width,height:920}});
 page.on("pageerror",e=>errors.push(width+" page: "+e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push(width+" console: "+m.text());});
 const response=await page.goto("http://127.0.0.1:8077/"+entry,{waitUntil:"networkidle"});
 assert.equal(response.status(),200);
 return page;
}
try{
 // A/B/C remain a separate page at all officially checked widths.
 for(const width of [320,360,390,700,960,1100,1440]){
  const page=await pageAt(width);
  assert.equal(await page.locator(".a-shell").count(),1);
  assert.equal(await page.locator("a.legacy-link").count(),2);
  await page.locator(".a-shell [data-action=learn]").click();
  assert.equal(await page.locator(".b-shell").count(),1);
  assert.equal(new URL(page.url()).hash,"#explore");
  assert.equal(await page.locator(".region-select").count(),3);
  await page.locator(".learning-toggle [data-mode=c]").click();
  assert.equal(await page.locator(".task-row").count(),3);
  assert.equal(new URL(page.url()).hash,"#practice");
  await page.close();
 }
 const page=await pageAt(1440);
 await page.locator(".a-shell [data-action=learn]").click();
 await page.locator('[data-region=monitor]').first().click();
 assert.equal(await page.locator(".panel-detail").count(),1);
 assert.match(await page.locator(".panel-detail").innerText(),/고정 표시 예시/);
 const monitor=await page.locator(".monitor-cell").allInnerTexts();
 assert.equal(monitor.length,7);
 await page.locator(".learning-toggle [data-mode=c]").click();
 // C cancellation applies nothing to the committed teaching setting.
 await page.locator('[data-lesson=cancel]').click();
 await page.locator(".mission-card [data-action=learn]").click();
 await page.locator('[data-setting=peep]').click();
 await page.locator('[data-action=plus]').click();
 await page.locator('[data-action=cancel-edit]').click();
 assert.match(await page.locator(".success").innerText(),/변경 중인 값은 적용되지 않았습니다/);
 assert.match(await page.locator(".success").innerText(),/5\.0 cmH₂O/);
 assert.deepEqual(await page.locator(".monitor-cell").allInnerTexts(),monitor);
 // B/C navigation must not destroy the original C lesson completion.
 await page.locator(".learning-toggle [data-mode=b]").click();
 assert.equal(await page.locator(".b-shell").count(),1);
 await page.locator(".learning-toggle [data-mode=c]").click();
 assert.match(await page.locator(".success").innerText(),/변경 중인 값은 적용되지 않았습니다/);
 await page.locator("[data-action=start]").first().click();
 await page.locator('[data-lesson=apply]').click();
 await page.locator(".mission-card [data-action=learn]").click();
 await page.locator('[data-setting=peep]').click();
 await page.locator('[data-action=plus]').click();
 await page.locator('[data-action=apply-edit]').click();
 assert.match(await page.locator(".success").innerText(),/설정값이 6\.0 cmH₂O로 바뀌었습니다/);
 assert.deepEqual(await page.locator(".monitor-cell").allInnerTexts(),monitor);
 // Full-page return does not falsely share A/B/C states with the main app.
 await page.locator("a.legacy-link").first().click();
 assert.match(page.url(),/\/index\.html$/);
 // Cross-document navigation can commit before the independent main ESM boot completes.
 await page.waitForFunction(()=>document.getElementById("learning-progress-status")?.textContent?.includes("CORE: 시작 전"));
 assert.match(await page.locator("#learning-progress-status").innerText(),/CORE: 시작 전.*LAB: 시작 전.*CASE: 시작 전/);
 assert.ok((await page.locator("#settings").innerText()).includes("PEEP"));
 assert.deepEqual(errors,[]);
 await page.close();
 console.log("Boyacto A/B/C seven-width navigation, settings cancellation/apply and independent main-state PASS");
}finally{await browser.close();}
