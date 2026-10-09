import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";

const ROOT="http://127.0.0.1:8077";
await fs.mkdir("artifacts/browser", {recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const pass=(message)=>console.log("PASS:",message);

try {
  const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  desktop.on("pageerror",e=>errors.push("Desktop pageerror: "+e.message));
  desktop.on("console",m=>{if(m.type()==="error")errors.push("Desktop console: "+m.text());});
  const response=await desktop.goto(ROOT,{waitUntil:"networkidle",timeout:30000});
  assert.equal(response.status(),200);
  await desktop.locator(".setting").first().waitFor({state:"visible"});
  assert.equal(await desktop.locator(".setting").count(),7);
  assert.equal(await desktop.locator(".readout").count(),7);
  assert.equal(await desktop.locator("#panel-circuit").isVisible(),true);
  pass("desktop loads all 7 settings and 7 reference readouts");

  const monitorBefore=await desktop.locator("#monitor").innerText();
  await desktop.getByRole("button",{name:"O₂ 증가 10"}).click();
  assert.equal(await desktop.locator(".setting-value").first().innerText(),"50");
  assert.equal(await desktop.locator("#monitor").innerText(),monitorBefore);
  pass("FiO₂ changes; sample monitoring remains clearly independent");
  await desktop.getByRole("button",{name:"O₂ 설명 보기"}).click();
  assert.equal(await desktop.locator("#panel-help").isVisible(),true);
  assert.equal(await desktop.locator("#help-title").innerText(),"O₂");
  pass("setting help opens on right");
  await desktop.getByRole("tab",{name:"CIRCUIT"}).click();
  await desktop.getByRole("button",{name:"조립 개요"}).click();
  assert.match(await desktop.locator("#circuit-content").innerText(),/1\/4/);
  await desktop.getByRole("button",{name:"다음 →"}).click();
  assert.match(await desktop.locator("#circuit-content").innerText(),/2\/4/);
  await desktop.getByRole("button",{name:"완성 개념도"}).click();
  assert.equal(await desktop.locator("#circuit-content svg").count(),1);
  pass("CIRCUIT subtabs, assembly steps and schematic");
  await desktop.getByRole("button",{name:"설정 초기화"}).click();
  assert.equal(await desktop.locator(".setting-value").first().innerText(),"40");
  pass("reset restores initial settings");
  await desktop.screenshot({path:"artifacts/browser/desktop.png",fullPage:true});

  const mobile=await browser.newPage({viewport:{width:360,height:780},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  mobile.on("pageerror",e=>errors.push("Mobile pageerror: "+e.message));
  mobile.on("console",m=>{if(m.type()==="error")errors.push("Mobile console: "+m.text());});
  const mobileResponse=await mobile.goto(ROOT,{waitUntil:"networkidle",timeout:30000});
  assert.equal(mobileResponse.status(),200);
  await mobile.locator(".setting").first().waitFor({state:"visible"});
  assert.equal(await mobile.locator(".setting").count(),7);
  const width=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(width.scroll<=width.client+2,"mobile horizontal overflow "+JSON.stringify(width));
  await mobile.getByRole("button",{name:"PEEP 증가 0.1"}).click();
  const peepVal=await mobile.locator(".setting").nth(1).locator(".setting-value").innerText();
  assert.equal(peepVal,"5.1");
  await mobile.getByRole("tab",{name:"? 설명"}).click();
  assert.equal(await mobile.locator("#panel-help").isVisible(),true);
  pass("360px mobile layout, step control and help tab");
  await mobile.screenshot({path:"artifacts/browser/mobile.png",fullPage:true});
  assert.deepEqual(errors,[]);
  pass("no captured JS page errors or console errors");
} finally {
  await browser.close();
}
