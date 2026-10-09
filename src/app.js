import {VERSION, PARAMETERS, DEVICE_REFERENCE, MONITOR_REFERENCE, initialSettings, adjustSetting, formatSetting} from "./sim-model.js";
import {generateWaveform, previewScales} from "./waveform-model.js";
const settingsContainer = document.getElementById("settings");
const monitor = document.getElementById("monitor");
const status = document.getElementById("status");
const panelHelp = document.getElementById("panel-help");
const panelCircuit = document.getElementById("panel-circuit");
const helpTab = document.getElementById("tab-help");
const circuitTab = document.getElementById("tab-circuit");
const circuitContent = document.getElementById("circuit-content");
let state = initialSettings();
let circuitView = "parts";
let assemblyStep = 0;
document.getElementById("version").textContent = "v" + VERSION;

function showSideTab(tab) {
  const help = tab === "help";
  panelHelp.hidden = !help;
  panelCircuit.hidden = help;
  helpTab.classList.toggle("active",help);
  circuitTab.classList.toggle("active",!help);
  helpTab.setAttribute("aria-selected",String(help));
  circuitTab.setAttribute("aria-selected",String(!help));
}
function explain(title, description, reference = null) {
  document.getElementById("help-title").textContent = title;
  document.getElementById("help-body").textContent = description;
  const info=document.getElementById("reference-info");
  info.hidden=!reference;
  info.textContent=reference
    ? "PB980 매뉴얼 기준 (성인·해당 설정): "+reference.detail+
      " · 화면의 ± 버튼/설정 범위는 별도의 교육용 예시이며, 실제 장비의 조작·제약조건을 완전히 재현하지 않아."
    : "";
  showSideTab("help");
}
function renderMonitor() {
  monitor.replaceChildren();
  for (const [label,value,unit] of MONITOR_REFERENCE) {
    const card=document.createElement("div");card.className="readout";
    const name=document.createElement("span");name.className="label";name.textContent=label;
    const number=document.createElement("strong");number.textContent=value;
    const suffix=document.createElement("span");suffix.className="unit";suffix.textContent=unit||"참고값";
    card.append(name,number,suffix);monitor.append(card);
  }
}
function renderSettings() {
  settingsContainer.replaceChildren();
  for (const param of PARAMETERS) {
    const card=document.createElement("div");card.className="setting";card.dataset.settingId=param.id;
    const label=document.createElement("div");label.className="setting-name";label.textContent=param.label;
    const value=document.createElement("div");value.className="setting-value";value.textContent=formatSetting(param.id,state[param.id]);
    const unit=document.createElement("div");unit.className="setting-unit";unit.textContent=param.unit;
    const buttons=document.createElement("div");buttons.className="step-buttons";
    for (const delta of param.steps) {
      const button=document.createElement("button");button.type="button";button.dataset.step=String(delta);
      button.textContent=delta>0?"+"+delta:String(delta);
      button.setAttribute("aria-label",param.label+" "+(delta>0?"증가 ":"감소 ")+Math.abs(delta));
      button.disabled = (delta<0 && state[param.id]<=param.min) || (delta>0 && state[param.id]>=param.max);
      button.addEventListener("click",()=>{
        const next=adjustSetting(state,param.id,delta);
        const changed=next[param.id]!==state[param.id];
        state=next;
        status.textContent=changed ? param.label+": "+formatSetting(param.id,state[param.id])+param.unit+" (학습용 설정만 변경)" : "설정 범위 끝이야.";
        refreshSettings();
        paintWaveforms();
      });
      buttons.append(button);
    }
    const help=document.createElement("button");help.type="button";help.className="help";help.textContent="?";
    help.setAttribute("aria-label",param.label+" 설명 보기");
    help.addEventListener("click",()=>explain(param.label,param.help,DEVICE_REFERENCE[param.id]));
    buttons.append(help);
    card.append(label,value,unit,buttons);settingsContainer.append(card);
  }
}
// Update existing nodes to preserve keyboard focus after a setting change.
function refreshSettings() {
  for (const card of settingsContainer.querySelectorAll(".setting")) {
    const id=card.dataset.settingId;
    const param=PARAMETERS.find(p=>p.id===id);
    if (!param) continue;
    const current=state[id];
    card.querySelector(".setting-value").textContent=formatSetting(id,current);
    for (const button of card.querySelectorAll("button[data-step]")) {
      const delta=Number(button.dataset.step);
      button.disabled=(delta<0 && current<=param.min)||(delta>0 && current>=param.max);
    }
  }
}
function circuitDiagram() {
  return `<svg viewBox="0 0 280 224" role="img" aria-label="기계와 환자를 연결하는 회로의 개념도">
    <rect x="7" y="76" width="69" height="60" rx="9" fill="#dae5eb" stroke="#567989"/><text x="41" y="100" font-size="11" text-anchor="middle">VENT</text><text x="41" y="116" font-size="10" text-anchor="middle">PB980</text>
    <rect x="118" y="11" width="71" height="31" rx="6" fill="#e1f3ff" stroke="#608caa"/><text x="154" y="30" font-size="10" text-anchor="middle">가습·흡기부</text>
    <circle cx="215" cy="103" r="17" fill="#e1ebe3" stroke="#6c987d"/><text x="215" y="106" font-size="10" text-anchor="middle">Y</text>
    <rect x="110" y="183" width="75" height="29" rx="6" fill="#f5e9d4" stroke="#b19966"/><text x="147" y="201" font-size="10" text-anchor="middle">호기부</text>
    <rect x="235" y="91" width="40" height="30" rx="7" fill="#f7e6e3" stroke="#bd8c83"/><text x="255" y="110" font-size="9" text-anchor="middle">환자</text>
    <path d="M44 76V26H118 M189 26H215V86" stroke="#3d94cc" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M215 120V198H185 M110 198H44V136" stroke="#bd9453" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M232 103H235" stroke="#587b69" stroke-width="5" fill="none"/>
    <text x="69" y="20" font-size="10" fill="#276893">흡기 →</text><text x="195" y="178" font-size="10" fill="#8b652c">↓ 호기</text></svg>`;
}
function renderCircuit() {
  for (const button of document.querySelectorAll("[data-view]")) button.classList.toggle("active",button.dataset.view===circuitView);
  if (circuitView==="parts") {
    circuitContent.innerHTML="<ul><li><strong>흡기 회로</strong> — 기계에서 환자 방향으로 가스 전달</li><li><strong>가습 장치</strong> — 가스의 온도·습도 조절(구성에 따라 달라짐)</li><li><strong>Y-piece</strong> — 흡기·호기 연결부가 환자 쪽에서 만나는 지점</li><li><strong>호기 회로</strong> — 배출된 가스를 장비의 호기 경로로 전달</li><li><strong>ETT/환자 연결부</strong> — 환자 쪽 연결 지점</li></ul><p class='circuit-notice'>교육용 구성품 개요이며 부품 순서와 필터·가습 방식은 PB980 실제 설정 자료로 추후 검증해야 해.</p>";
  } else if (circuitView==="assembly") {
    const steps=["회로 유형과 필요한 부품 확인","흡기 측 경로 확인","Y-piece·환자 연결부 확인","호기 측 경로 및 연결 상태 확인"];
    circuitContent.replaceChildren();
    const title=document.createElement("p");title.textContent="개념 학습 "+(assemblyStep+1)+"/4: "+steps[assemblyStep];
    const note=document.createElement("p");note.className="circuit-notice";note.textContent="실제 조립 절차가 아닌 학습용 순서 개요야. 연결 검사·장비 테스트 등 실제 절차는 공식 매뉴얼과 병원 지침을 따라야 해.";
    const prev=document.createElement("button");prev.type="button";prev.textContent="← 이전";prev.disabled=assemblyStep===0;
    const next=document.createElement("button");next.type="button";next.textContent=assemblyStep===steps.length-1?"처음부터":"다음 →";
    prev.style.marginRight="10px";
    prev.addEventListener("click",()=>{assemblyStep=Math.max(0,assemblyStep-1);renderCircuit();});
    next.addEventListener("click",()=>{assemblyStep=(assemblyStep+1)%steps.length;renderCircuit();});
    circuitContent.append(title,note,prev,next);
  } else {
    circuitContent.innerHTML=circuitDiagram()+"<p class='circuit-notice'>파란 선: 흡기 방향 · 갈색 선: 호기 방향. 비례·실물 연결도 아님. 회로 애니메이션은 후속 버전에서 구현.</p>";
  }
}
circuitTab.addEventListener("click",()=>showSideTab("circuit"));
document.getElementById("shortcut-circuit").addEventListener("click",()=>showSideTab("circuit"));
document.getElementById("shortcut-help").addEventListener("click",()=>showSideTab("help"));
helpTab.addEventListener("click",()=>showSideTab("help"));
document.getElementById("modeHelp").addEventListener("click",()=>explain("SIMV (PC) + PS","SIMV는 강제호흡과 자발호흡을 조합하는 모드야. 이 예시에서는 강제호흡은 압력제어(PC), 자발호흡은 압력보조(PS)로 표시했어. 정확한 설정 화면과 사용 범위는 PB980 매뉴얼을 확인해야 해."));
document.getElementById("reset").addEventListener("click",()=>{state=initialSettings();refreshSettings();paintWaveforms();status.textContent="기본 예시 설정으로 초기화했어.";});
document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>{circuitView=button.dataset.view;assemblyStep=0;renderCircuit();}));
// Single educational waveform preview state, independent of patient readouts.
const plotPhases=["mandatory","spontaneous","expiration"];
const plotNames=["pressure","flow","volume"];
const WAVE_WINDOW_SECONDS=16;
let waveformTime=0;
// Keep animations still by default when the device requests reduced motion.
// Students may explicitly choose Resume; the setting values remain interactive.
let waveformPaused=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let previousFrameTime=null;
let previousPaintTime=-1000;
function paintWaveforms(){
  const samples=generateWaveform(state,waveformTime,WAVE_WINDOW_SECONDS,320);
  const scale=previewScales(state,samples);
  document.getElementById("scale-pressure").textContent="0–"+scale.pressureMax+" cmH₂O";
  document.getElementById("scale-flow").textContent="±"+scale.flowMax+" L/min";
  document.getElementById("scale-volume").textContent="0–"+scale.volumeMax+" mL";
  for(const name of plotNames){
    const group=document.getElementById("graph-"+name);
    for(const phase of plotPhases){
      let path="";
      let active=false;
      for(let i=0;i<samples.length;i++){
        const sample=samples[i];
        const x=(760*i/(samples.length-1)).toFixed(1);
        const raw=sample[name];
        const y=(name==="flow" ? 64-raw/scale.flowMax*49 :
          116-raw/(name==="pressure"?scale.pressureMax:scale.volumeMax)*104).toFixed(1);
        if(sample.phase===phase){
          path+=(active?"L":"M")+x+" "+y+" ";
          active=true;
        }else if(active){
          path+="L"+x+" "+y+" ";
          active=false;
        }
      }
      group.querySelector('[data-phase="'+phase+'"]').setAttribute("d",path);
    }
  }
}
const pauseButton=document.getElementById("waveform-pause");
function refreshPauseControl(){
  pauseButton.setAttribute("aria-pressed",String(waveformPaused));
  pauseButton.setAttribute("aria-label",waveformPaused?"파형 재생":"파형 일시정지");
  pauseButton.textContent=waveformPaused?"▶ Resume":"Ⅱ Pause";
}
refreshPauseControl();
pauseButton.addEventListener("click",()=>{
  waveformPaused=!waveformPaused;
  refreshPauseControl();
  // Commit the frozen frame synchronously, preventing one later repaint jump.
  if(waveformPaused) paintWaveforms();
});
function animationFrame(now){
  if(previousFrameTime!==null&&!waveformPaused&&!document.hidden){
    waveformTime+=Math.min((now-previousFrameTime)/1000,0.12);
  }
  previousFrameTime=now;
  if(!document.hidden && !waveformPaused && now-previousPaintTime>=85){
    paintWaveforms();
    previousPaintTime=now;
  }
  requestAnimationFrame(animationFrame);
}
renderMonitor();renderSettings();renderCircuit();paintWaveforms();
requestAnimationFrame(animationFrame);
