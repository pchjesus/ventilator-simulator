import {chromium} from "playwright";
import fs from "node:fs/promises";
const out="artifacts/learning-room";
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const report=[];
async function capture(width=1440,height=1000){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
 await page.goto("http://127.0.0.1:8077/learn.html",{waitUntil:"networkidle",timeout:30000});
 let n=0;const prefix=String(width);
 async function shot(name){
  n++;
  await page.screenshot({path:`${out}/${prefix}-${name}.png`,fullPage:true,animations:"disabled"});
  const bounds=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  report.push({width,name,overflow:bounds.scroll-bounds.viewport,errors:[...errors]});
 }
 await shot("01-home");
 await page.locator('[data-action="learn"]').first().click();
 await shot("02-explore");
 await page.locator('[data-region="monitor"]').first().click();
 await shot("03-monitor-details");
 await page.locator('[data-mode="c"]').first().click();
 await shot("04-practice-overview");
 await page.locator('[data-lesson="cancel"]').first().click();
 await page.locator('[data-action="learn"]').first().click();
 await shot("05-practice-task");
 await page.locator('[data-setting="peep"]').first().click();
 await shot("06-pending-edit");
 await page.locator('[data-action="plus"]').first().click();
 await shot("07-pending-adjusted");
 await page.locator('[data-action="cancel-edit"]').first().click();
 await shot("08-practice-feedback");
 await page.locator('[data-action="start"]').first().click();
 await page.locator('[data-lesson="apply"]').first().click();
 await page.locator('[data-action="learn"]').first().click();
 await page.locator('[data-setting="peep"]').first().click();
 await page.locator('[data-action="plus"]').first().click();
 await page.locator('[data-action="apply-edit"]').first().click();
 await shot("09-applied-success");
 await page.close();
}
try {
 for(const width of [1440,1024,390,320]) await capture(width,width>=1024?960:812);
 await fs.writeFile(`${out}/capture-report.json`,JSON.stringify({commit:"5be92ce76469eca0309b2b6daf225fcfc05a1b1d",report},null,2));
 console.log("SCREENSHOT_AUDIT",JSON.stringify({files:report.length,overflow:report.filter(x=>x.overflow>2),errors:report.filter(x=>x.errors.length)}));
}finally{await browser.close();}
