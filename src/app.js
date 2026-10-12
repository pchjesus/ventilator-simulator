import {VERSION, PARAMETERS, DEVICE_REFERENCE, MONITOR_REFERENCE, initialSettings, adjustSetting, formatSetting} from "./sim-model.js";
import {generateWaveform, previewScales} from "./waveform-model.js";
import {beginSettingEdit, preferredEditStep, stepSettingEdit, acceptSettingEdit} from "./setting-editor.js";
import {CLINICAL_TOPICS, TOPIC_GROUPS, EDUCATION_SOURCES, MANUAL_SECTIONS} from "./education-content.js";
import {RELEASE_CATEGORIES, notesForCategory} from "./release-notes.js";
import {clampRatio, ratioFromClientX, inspectAt} from "./waveform-inspector.js";
import {PRECLINICAL_CASES,CASE_SOURCES,findCase} from "./preclinical-cases.js";
import {startCase,chooseCaseAnswer,advanceCase,caseScore} from "./case-engine.js";
import {auditCaseBank,evidenceKindLabel} from "./case-quality.js";
const settingsContainer = document.getElementById("settings");
const monitor = document.getElementById("monitor");
const status = document.getElementById("status");
const panelHelp = document.getElementById("panel-help");
const panelCircuit = document.getElementById("panel-circuit");
const panelCase = document.getElementById("panel-case");
const helpTab = document.getElementById("tab-help");
const circuitTab = document.getElementById("tab-circuit");
const caseTab = document.getElementById("tab-case");
const circuitContent = document.getElementById("circuit-content");
let state = initialSettings(); // committed state only: sole input to waveform model
let controlMode = "device"; // explicit opt-in for legacy quick study controls
let editState = null; // {id, original, pending}, never feeds waveform engine
let editorFocusTarget = null;
document.body.dataset.controlMode = controlMode;
let circuitView = "parts";
let assemblyStep = 0;
document.getElementById("version").textContent = "v" + VERSION;
let selectedTopicId=null;

// All educational text is inserted through textContent: no copied page HTML,
// no runtime medical-data/network dependency and no untrusted HTML in overlays.
function makeElement(tag,className,text){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text!==undefined)element.textContent=text;
  return element;
}
function addSources(container,ids){
  const refs=makeElement("div","clinical-sources");
  refs.append(makeElement("strong",null,"참고 근거 · 직접 원문 확인"));
  for(const id of ids){
    const source=EDUCATION_SOURCES[id];
    if(!source)continue;
    const link=makeElement("a",null,source.name);
    link.href=source.url;link.target="_blank";link.rel="noopener noreferrer";
    refs.append(link);
  }
  container.append(refs);
}
function renderClinicalTopic(id){
  const root=document.getElementById("clinical-detail");
  root.replaceChildren();
  const topic=CLINICAL_TOPICS[id];
  selectedTopicId=topic?id:null;
  for(const button of document.querySelectorAll("#topic-buttons button[data-topic]")){
    button.setAttribute("aria-pressed",String(button.dataset.topic===selectedTopicId));
  }
  if(!topic)return;
  root.append(makeElement("p","clinical-intro",topic.summary));
  for(const section of topic.sections){
    const region=makeElement("section","clinical-block");
    region.append(makeElement("h3",null,section.heading));
    const list=document.createElement("ul");
    for(const point of section.points)list.append(makeElement("li",null,point));
    region.append(list);root.append(region);
  }
  addSources(root,topic.sourceIds);
}
function renderTopicNavigation(){
  const root=document.getElementById("topic-buttons");
  root.replaceChildren();
  for(const group of TOPIC_GROUPS){
    const wrapper=makeElement("div","topic-group");
    wrapper.append(makeElement("div","topic-group-title",group.title));
    const row=makeElement("div","topic-buttons");
    for(const id of group.ids){
      const param=PARAMETERS.find(p=>p.id===id);
      const button=makeElement("button",null,param?param.label:CLINICAL_TOPICS[id].title.split(" ·")[0]);
      button.type="button";button.dataset.topic=id;button.setAttribute("aria-pressed","false");
      button.addEventListener("click",()=>{
        const topic=CLINICAL_TOPICS[id];
        explain(param?param.label:topic.title,param?param.help:"핵심 개념과 간호 관찰, 시뮬레이터의 한계를 아래에서 확인해.",DEVICE_REFERENCE[id]||null,id);
      });
      row.append(button);
    }
    wrapper.append(row);root.append(wrapper);
  }
}
function configureInfoDialog(id,triggerId){
  const dialog=document.getElementById(id),trigger=document.getElementById(triggerId);
  let previousFocus=null;
  trigger.addEventListener("click",()=>{
    if(dialog.open||editorDialog.open)return;
    previousFocus=trigger;
    if(id==="changelog-dialog")selectReleaseCategory("all");
    dialog.showModal();
    dialog.querySelector(".info-close").focus();
  });
  dialog.querySelector(".info-close").addEventListener("click",()=>dialog.close());
  // Native dialog backdrops are hit-tested as the dialog element itself.
  // Close ONLY when pointer starts outside the dialog's visual rectangle.
  dialog.addEventListener("pointerdown",event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||
       event.clientY<bounds.top||event.clientY>bounds.bottom){
      event.preventDefault(); // a backdrop gesture must not focus/activate a behind-dialog control
      dialog.close();
    }
  });
  dialog.addEventListener("close",()=>{
    if(previousFocus&&previousFocus.isConnected)previousFocus.focus();
    previousFocus=null;
  });
}
function renderManual(){
  const root=document.getElementById("manual-dialog-body");root.replaceChildren();
  root.append(makeElement("p","info-intro","본 설명서는 v"+VERSION+" 교육용 웹 시뮬레이터 사용법이야. 실제 환자 치료나 PB980 실물 설정 조작을 위한 사용설명서가 아니야."));
  for(const section of MANUAL_SECTIONS){
    const block=makeElement("section","manual-section");
    block.append(makeElement("h3",null,section.title));
    const list=document.createElement("ul");
    for(const line of section.lines)list.append(makeElement("li",null,line));
    block.append(list);root.append(block);
  }
  addSources(root,Object.keys(EDUCATION_SOURCES));
}
let activeReleaseCategory="all";
function renderReleaseNotes(){
  const root=document.getElementById("changelog-dialog-body");root.replaceChildren();
  const entries=notesForCategory(activeReleaseCategory);
  root.append(makeElement("p","info-intro","버전별 변경 사항을 카테고리로 나눠 표시해. 세부 검증 결과는 TEST_REPORT와 DEVLOG에 기록돼 있어."));
  for(const entry of entries){
    const region=makeElement("section","release-entry");
    region.append(makeElement("h3",null,"v"+entry.version));
    region.append(makeElement("p","release-date",entry.date));
    for(const change of entry.changes){
      const item=makeElement("div","release-item");
      const category=RELEASE_CATEGORIES.find(c=>c.id===change.category);
      const badge=makeElement("span","release-category",category.label);
      badge.dataset.category=change.category;
      item.append(badge,makeElement("p",null,change.text));
      region.append(item);
    }
    root.append(region);
  }
}
function selectReleaseCategory(id){
  if(id!=="all"&&!RELEASE_CATEGORIES.some(category=>category.id===id))return;
  activeReleaseCategory=id;
  for(const button of document.querySelectorAll("#changelog-filters button")){
    button.setAttribute("aria-pressed",String(button.dataset.category===id));
  }
  renderReleaseNotes();
}
function initEducationUI(){
  renderTopicNavigation();renderManual();
  const filters=document.getElementById("changelog-filters");
  for(const category of [{id:"all",label:"전체"},...RELEASE_CATEGORIES]){
    const button=makeElement("button",null,category.label);
    button.type="button";button.dataset.category=category.id;
    button.setAttribute("aria-pressed",String(category.id==="all"));
    button.addEventListener("click",()=>selectReleaseCategory(category.id));
    filters.append(button);
  }
  renderReleaseNotes();
  configureInfoDialog("manual-dialog","open-manual");
  configureInfoDialog("changelog-dialog","open-changelog");
}

function showSideTab(tab) {
  for (const [id,button,panel] of [
    ["help",helpTab,panelHelp],["circuit",circuitTab,panelCircuit],["case",caseTab,panelCase]
  ]) {
    const active=id===tab;
    panel.hidden=!active;
    button.classList.toggle("active",active);
    button.setAttribute("aria-selected",String(active));
  }
}
function explain(title, description, reference = null, explicitTopicId = null) {
  document.getElementById("help-title").textContent = title;
  document.getElementById("help-body").textContent = description;
  const info=document.getElementById("reference-info");
  info.hidden=!reference;
  info.textContent=reference
    ? "PB980 매뉴얼 기준 (성인·해당 설정): "+reference.detail+
      " · 화면의 ± 버튼/설정 범위는 별도의 교육용 예시이며, 실제 장비의 조작·제약조건을 완전히 재현하지 않아."
    : "";
  const topicId=explicitTopicId||
    (title==="SIMV (PC) + PS"?"mode":PARAMETERS.find(p=>p.label===title)?.id);
  renderClinicalTopic(topicId);
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
    const select=document.createElement("button");select.type="button";select.className="setting-select";
    select.setAttribute("aria-label",param.label+" 설정 선택");
    select.addEventListener("click",()=>openSettingEditor(param.id,select));
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
    select.append(label,value,unit);
    const deviceHelp=document.createElement("button");deviceHelp.type="button";deviceHelp.className="device-help";deviceHelp.textContent="?";
    deviceHelp.setAttribute("aria-label",param.label+" 설명 보기");
    deviceHelp.addEventListener("click",()=>explain(param.label,param.help,DEVICE_REFERENCE[param.id]));
    select.disabled=controlMode==="quick";
    card.append(select,buttons,deviceHelp);settingsContainer.append(card);
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
    card.querySelector(".setting-select").disabled=controlMode==="quick";
    for (const button of card.querySelectorAll("button[data-step]")) {
      const delta=Number(button.dataset.step);
      button.disabled=(delta<0 && current<=param.min)||(delta>0 && current>=param.max);
    }
  }
}

const editorDialog=document.getElementById("setting-editor");
const editorForm=document.getElementById("editor-form");
const incButton=document.getElementById("editor-increase");
const decButton=document.getElementById("editor-decrease");

function setControlMode(next){
  if(next!=="device"&&next!=="quick")return;
  // A pending edit is never allowed to flow silently into quick study.
  if(editorDialog.open) closeSettingEditor();
  controlMode=next;
  document.body.dataset.controlMode=next;
  document.getElementById("mode-device").setAttribute("aria-pressed",String(next==="device"));
  document.getElementById("mode-quick").setAttribute("aria-pressed",String(next==="quick"));
  document.getElementById("control-instructions").textContent=next==="device"
    ?"설정 항목을 선택 → 값을 조절 → Accept를 눌러 반영해."
    :"빠른 학습: 기존 ± 버튼을 누르면 교육용 설정과 파형이 즉시 변경돼.";
  refreshSettings(); // update existing nodes; do not replace focused quick controls
}
function updateEditorDisplay(){
  if(!editState)return;
  const param=PARAMETERS.find(p=>p.id===editState.id);
  const step=preferredEditStep(editState.id);
  document.getElementById("editor-title").textContent=param.label+" · 설정값 조절";
  document.getElementById("editor-original").textContent=formatSetting(param.id,editState.original)+" "+param.unit;
  document.getElementById("editor-pending").textContent=formatSetting(param.id,editState.pending)+" "+param.unit;
  document.getElementById("editor-step-description").textContent=
    "모의 노브 증감: "+step+" "+param.unit+"씩 · 학습용 설정 범위 "+param.min+"–"+param.max;
  decButton.disabled=editState.pending<=param.min;
  incButton.disabled=editState.pending>=param.max;
}
function openSettingEditor(id,trigger){
  if(controlMode!=="device"||editorDialog.open)return;
  const next=beginSettingEdit(state,id);
  if(!next)return;
  editState=next;
  editorFocusTarget=trigger;
  updateEditorDisplay();
  editorDialog.showModal();
  document.getElementById("editor-accept").focus();
}
function movePending(direction){
  if(!editState)return;
  const increment=preferredEditStep(editState.id);
  editState=stepSettingEdit(editState,direction*increment);
  updateEditorDisplay();
}
function closeSettingEditor(){
  const focus=editorFocusTarget;
  editState=null;
  editorFocusTarget=null;
  if(editorDialog.open)editorDialog.close();
  if(focus&&focus.isConnected&&!focus.disabled)focus.focus();
}
function acceptEditor(){
  if(!editState)return;
  const id=editState.id;
  const before=state;
  state=acceptSettingEdit(state,editState);
  const changed=state!==before;
  closeSettingEditor();
  if(changed){refreshSettings();paintWaveforms();}
  const param=PARAMETERS.find(p=>p.id===id);
  status.textContent=changed
    ? param.label+": "+formatSetting(id,state[id])+param.unit+" (Accept · 학습용 설정 확정)"
    : "설정값 변화 없이 닫았어.";
}
document.getElementById("mode-device").addEventListener("click",()=>setControlMode("device"));
document.getElementById("mode-quick").addEventListener("click",()=>setControlMode("quick"));
incButton.addEventListener("click",()=>movePending(1));
decButton.addEventListener("click",()=>movePending(-1));
document.getElementById("editor-cancel").addEventListener("click",closeSettingEditor);
document.getElementById("editor-reset").addEventListener("click",()=>{
  closeSettingEditor();
  state=initialSettings();
  refreshSettings();paintWaveforms();
  status.textContent="전체 설정을 초기화했어.";
});
editorForm.addEventListener("submit",event=>{event.preventDefault();acceptEditor();});
editorDialog.addEventListener("cancel",event=>{event.preventDefault();closeSettingEditor();});
editorDialog.addEventListener("keydown",event=>{
  if(event.key==="ArrowUp"||event.key==="ArrowRight"){
    event.preventDefault();movePending(1);
  }else if(event.key==="ArrowDown"||event.key==="ArrowLeft"){
    event.preventDefault();movePending(-1);
  }
});

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

/* Pre-clinical choice-based education is intentionally isolated from settings,
 * waveform calculation and fixed monitor sample values. */
let caseState=null;
let reviewerCaseId=null;
const reflectionNotes=new Map(); // intentionally RAM only, no student identity or storage
const caseAudit=auditCaseBank(PRECLINICAL_CASES,CASE_SOURCES);
function caseButton(label,handler,cssClass=""){
  const button=makeElement("button",cssClass,label);
  button.type="button";button.addEventListener("click",handler);return button;
}
function caseSources(root,sourceIds){
  const links=makeElement("div","case-sources");
  links.append(makeElement("strong",null,"근거 자료"));
  for(const key of sourceIds){
    const source=CASE_SOURCES[key];if(!source)continue;
    const a=makeElement("a",null,source.label);
    a.href=source.url;a.rel="noopener noreferrer";a.target="_blank";
    links.append(a);
  }
  root.append(links);
}

function renderReviewPreview(root,scenario){
  const section=makeElement("section","case-review");
  section.setAttribute("aria-label","교수자 미리보기: "+scenario.title);
  section.append(makeElement("h4",null,"문항·학습목표·근거 추적 미리보기"));
  section.append(makeElement("p","case-review-warning","주의: 정답을 공개하는 누구나 볼 수 있는 개발·교수자 검토용 화면이야. 권한 관리나 공식 임상 승인 기능이 아니야."));
  section.append(makeElement("p","case-review-status","임상 검토 상태: 미감수 / 승인 없음 · 콘텐츠 v"+scenario.contentVersion));
  section.append(makeElement("p",null,scenario.review.note));
  section.append(makeElement("p","case-audit-summary","구조 검사: "+caseAudit.itemCount+"개 문항의 연결 확인 · 오류 "+caseAudit.errors.length+"건. 구조 검사는 의학적 정확성을 보증하지 않아."));
  const points=makeElement("ol","case-review-items");
  for(const [index,step] of scenario.steps.entries()){
    const entry=makeElement("li","case-review-item");
    entry.append(makeElement("strong",null,"문항 "+(index+1)+" · "+step.id));
    entry.append(makeElement("p",null,step.question));
    const correct=step.options.find(x=>x.id===step.answer);
    entry.append(makeElement("p","case-review-answer","정답(교수자용): "+step.answer.toUpperCase()+" · "+correct.label));
    entry.append(makeElement("p",null,"정답 해설: "+step.explanation));
    const linked=step.objectiveIds.map(id=>scenario.objectives.find(o=>o.id===id)?.text||"[누락 목표]");
    entry.append(makeElement("p","case-review-trace","연결 학습목표: "+linked.join(" / ")));
    entry.append(makeElement("p","case-review-trace","근거 분류: "+evidenceKindLabel(step.evidenceKind)));
    entry.append(makeElement("p","case-review-trace","근거 메모: "+step.evidenceNote));
    caseSources(entry,step.sourceIds);
    points.append(entry);
  }
  section.append(points);
  section.append(makeElement("p","case-review-warning","교수자 점검 제안: 사실 정확성, 오답 선택지의 오개념, 실습학생 업무범위, 기관 지침과의 충돌을 별도 검토·기록해야 해."));
  root.append(section);
}
function appendCaseEvidence(root,step,scenario){
  const details=makeElement("details","case-evidence");
  details.append(makeElement("summary",null,"이 문항의 학습목표·근거 추적 보기"));
  const goals=step.objectiveIds.map(id=>scenario.objectives.find(o=>o.id===id)?.text).filter(Boolean);
  details.append(makeElement("p",null,"학습목표: "+goals.join(" / ")));
  details.append(makeElement("p",null,"근거 성격: "+evidenceKindLabel(step.evidenceKind)));
  details.append(makeElement("p",null,"근거 해설: "+step.evidenceNote));
  caseSources(details,step.sourceIds);
  root.append(details);
}
function renderReflection(root,scenario){
  const block=makeElement("section","case-reflection");
  block.append(makeElement("h4",null,"구조화 디브리핑 · 스스로 정리하기"));
  block.append(makeElement("p","case-hint","문항별 정답과 별개로 남은 의문을 적어볼 수 있어. 아래 기록은 이 페이지 메모리에만 남고 저장·전송되지 않아. 새로고침하면 사라져."));
  const notes=reflectionNotes.get(scenario.id)||["","",""];
  for(const [i,prompt] of scenario.debrief.entries()){
    const label=makeElement("label","case-reflection-item");
    const id="case-reflect-"+scenario.id+"-"+i;
    label.setAttribute("for",id);
    label.append(makeElement("span",null,(i+1)+". "+prompt));
    const area=document.createElement("textarea");
    area.id=id;area.className="case-reflection-input";area.rows=3;
    area.placeholder="관찰한 사실, 아직 확인되지 않은 점, 지도자에게 보고할 내용을 정리해봐.";
    area.value=notes[i]||"";area.maxLength=1000;
    area.addEventListener("input",()=>{
      const next=[...(reflectionNotes.get(scenario.id)||["","",""])];
      next[i]=area.value;
      reflectionNotes.set(scenario.id,next);
    });
    label.append(area);block.append(label);
  }
  root.append(block);
}

function renderCase(){
  const root=document.getElementById("case-content");
  root.replaceChildren();
  if(caseAudit.errors.length){
    root.append(makeElement("h2","case-heading","CASE 콘텐츠 구조 검사 실패"));
    root.append(makeElement("p","case-review-warning","학습 오류를 방지하기 위해 문항을 표시하지 않았어. 교육용 데이터의 누락·중복·참조 관계를 수정해야 해."));
    for(const issue of caseAudit.errors)root.append(makeElement("p","case-audit-error",issue.path+": "+issue.reason));
    return;
  }
  if(!caseState){
    root.append(makeElement("h2","case-heading","실습 전 CASE 학습"));
    root.append(makeElement("p","case-intro","관찰 우선순위와 정보 구분을 연습하는 입문 사례야. 정답률은 형성 피드백이며 임상 역량 인증이나 평가 점수가 아니야."));
    root.append(makeElement("p","case-audit-summary","콘텐츠 연결 구조 검사 통과 · "+caseAudit.caseCount+"개 사례 / "+caseAudit.itemCount+"문항 · 단, 의료 내용은 미감수"));
    for(const scenario of PRECLINICAL_CASES){
      const card=makeElement("section","case-card");
      card.append(makeElement("h3",null,scenario.title));
      card.append(makeElement("p","case-meta",scenario.level+" · 약 "+scenario.minutes+"분 · "+scenario.status));
      card.append(makeElement("p",null,scenario.premise));
      const ul=makeElement("ul","case-objectives");
      for(const goal of scenario.objectives)ul.append(makeElement("li",null,goal.text));
      card.append(ul);
      card.append(caseButton("이 사례 시작",()=>{reviewerCaseId=null;caseState=startCase(scenario.id);renderCase();root.querySelector(".case-answer")?.focus();},"case-primary"));
      const reviewBtn=caseButton(reviewerCaseId===scenario.id?"교수자 미리보기 닫기":"교수자 검토 미리보기 · 정답 공개",()=>{
        reviewerCaseId=reviewerCaseId===scenario.id?null:scenario.id;
        renderCase();
        root.querySelector('[data-review-case="'+scenario.id+'"]')?.focus();
      },"case-review-toggle");
      reviewBtn.setAttribute("aria-expanded",String(reviewerCaseId===scenario.id));
      reviewBtn.dataset.reviewCase=scenario.id;
      card.append(reviewBtn);
      if(reviewerCaseId===scenario.id)renderReviewPreview(card,scenario);
      root.append(card);
    }
    return;
  }
  const scenario=findCase(caseState.caseId);
  if(!scenario){caseState=null;renderCase();return;}
  const score=caseScore(caseState);
  root.append(makeElement("h2","case-heading",scenario.title));
  root.append(makeElement("p","case-meta",scenario.status+" · 별도의 가상 사례 자료"));
  root.append(caseButton("← 사례 목록",()=>{caseState=null;renderCase();caseTab.focus();},"case-back"));
  const context=makeElement("details","case-context");
  context.open=caseState.index===0&&!caseState.done;
  context.append(makeElement("summary",null,"사전 안내·상황 자료·학습 목표"));
  context.append(makeElement("p",null,scenario.premise));
  context.append(makeElement("p","case-prebrief",scenario.prebrief));
  const readings=makeElement("ul","case-vignette");
  for(const item of scenario.vignette)readings.append(makeElement("li",null,item));
  context.append(readings);
  context.append(makeElement("strong",null,"학습 목표"));
  const objectives=makeElement("ol","case-objectives");
  for(const item of scenario.objectives)objectives.append(makeElement("li",null,item.text));
  context.append(objectives);root.append(context);

  if(caseState.done){
    root.append(makeElement("h3","case-result","사례 학습 완료"));
    root.append(makeElement("p","case-score","학습 확인: "+score.correct+"/"+score.total+" 문항 (형성평가, 인증점수 아님)"));
    root.append(makeElement("p",null,"복습 질문: 무엇을 확인했으며, 어떤 정보가 부족했고, 실제 실습에서 어떤 근거로 지도자에게 보고해야 할까?"));
    root.append(makeElement("p","case-prebrief","이 결과는 학습 선택지에 대한 피드백일 뿐 실제 환자 상태 판단 능력이나 실기 수행 능력을 검증하지 않아."));
    const review=makeElement("details","case-answer-review");
    review.append(makeElement("summary",null,"내 응답과 정답·근거 복습"));
    for(const [index,item] of caseState.answers.entries()){
      const step=scenario.steps[index];
      const selected=step.options.find(x=>x.id===item.choiceId);
      const correct=step.options.find(x=>x.id===step.answer);
      const entry=makeElement("section","case-answer-comparison");
      entry.append(makeElement("strong",null,(index+1)+". "+step.question));
      entry.append(makeElement("p",null,"내 선택: "+selected.label+" ("+(item.correct?"일치":"복습 필요")+")"));
      entry.append(makeElement("p",null,"권장 선택: "+correct.label));
      appendCaseEvidence(entry,step,scenario);
      review.append(entry);
    }
    root.append(review);
    renderReflection(root,scenario);
    root.append(caseButton("처음부터 다시",()=>{reflectionNotes.delete(scenario.id);caseState=startCase(scenario.id);renderCase();root.querySelector(".case-answer")?.focus();},"case-primary"));
    caseSources(root,scenario.sources);
    return;
  }
  const step=scenario.steps[caseState.index];
  root.append(makeElement("p","case-progress","문항 "+(caseState.index+1)+" / "+score.total));
  root.append(makeElement("h3","case-question",step.question));
  const chosen=caseState.answers[caseState.index];
  const choiceRoot=makeElement("div","case-answers");
  for(const option of step.options){
    const btn=caseButton(option.label,()=>{
      if(caseState.answers.length>caseState.index)return;
      caseState=chooseCaseAnswer(caseState,option.id);
      renderCase();
      root.querySelector(".case-next")?.focus();
    },"case-answer");
    btn.disabled=Boolean(chosen);
    if(chosen&&option.id===chosen.choiceId){
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed","true");
    }
    choiceRoot.append(btn);
  }
  root.append(choiceRoot);
  if(chosen){
    const option=step.options.find(x=>x.id===chosen.choiceId);
    const feedback=makeElement("section","case-feedback");
    feedback.append(makeElement("strong",null,chosen.correct?"핵심 판단 확인":"복습이 필요한 판단"));
    feedback.append(makeElement("p",null,option.feedback));
    feedback.append(makeElement("p",null,step.explanation));
    appendCaseEvidence(feedback,step,scenario);
    root.append(feedback);
    root.append(caseButton(caseState.index===score.total-1?"결과·복습 보기":"다음 문항 →",()=>{
      caseState=advanceCase(caseState);
      renderCase();
      (root.querySelector(".case-answer")||root.querySelector(".case-primary"))?.focus();
    },"case-next case-primary"));
  }else{
    root.append(makeElement("p","case-hint","선택 후 이유와 참고 근거가 나타나. 실제 장비 설정이나 사례 수치는 바뀌지 않아."));
  }
  caseSources(root,scenario.sources);
}
caseTab.addEventListener("click",()=>{renderCase();showSideTab("case");});

circuitTab.addEventListener("click",()=>showSideTab("circuit"));
document.getElementById("shortcut-circuit").addEventListener("click",()=>showSideTab("circuit"));
document.getElementById("shortcut-help").addEventListener("click",()=>{
  if(!selectedTopicId)explain(CLINICAL_TOPICS.nursing.title,"간호 사정 원칙과 관찰 포인트를 아래에서 확인해.",null,"nursing");
  else showSideTab("help");
});
helpTab.addEventListener("click",()=>{
  if(!selectedTopicId)explain(CLINICAL_TOPICS.nursing.title,CLINICAL_TOPICS.nursing.summary,null,"nursing");
  else showSideTab("help");
});
document.getElementById("modeHelp").addEventListener("click",()=>explain("SIMV (PC) + PS","SIMV는 강제호흡과 자발호흡을 조합하는 모드야. 이 예시에서는 강제호흡은 압력제어(PC), 자발호흡은 압력보조(PS)로 표시했어. 정확한 설정 화면과 사용 범위는 PB980 매뉴얼을 확인해야 해."));
document.getElementById("reset").addEventListener("click",()=>{if(editorDialog.open)closeSettingEditor();state=initialSettings();refreshSettings();paintWaveforms();status.textContent="기본 예시 설정으로 초기화했어.";});
document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>{circuitView=button.dataset.view;assemblyStep=0;renderCircuit();}));
// Single educational waveform preview state, independent of patient readouts.
const plotPhases=["mandatory","spontaneous","expiration"];
const plotNames=["pressure","flow","volume"];
const WAVE_WINDOW_SECONDS=16;
const analysisButton=document.getElementById("waveform-inspect");
const gridButton=document.getElementById("waveform-grid");
const inspectionPanel=document.getElementById("inspection-panel");
const inspectionPosition=document.getElementById("inspection-position");
let inspectorActive=false;
let pausedBeforeInspection=false;
let inspectionRatio=0.5;
let displayedSamples=[];
let gridVisible=true;
const cursorLines=new Map();
for(const name of plotNames){
  const svg=document.getElementById("graph-"+name);
  const line=document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("y1","0");line.setAttribute("y2","130");
  line.setAttribute("class","study-cursor");
  svg.append(line);cursorLines.set(name,line);
  svg.addEventListener("pointerdown",event=>{
    if(!inspectorActive)return;
    const bounds=svg.getBoundingClientRect();
    inspectionRatio=ratioFromClientX(event.clientX,bounds.left,bounds.width);
    inspectionPosition.value=String(Math.round(inspectionRatio*100));
    renderInspection();
  });
}
function renderInspection(){
  for(const line of cursorLines.values())line.style.display=inspectorActive?"":"none";
  if(!inspectorActive||!displayedSamples.length)return;
  const selected=inspectAt(displayedSamples,inspectionRatio);
  const x=(selected.ratio*760).toFixed(1);
  for(const line of cursorLines.values()){
    line.setAttribute("x1",x);line.setAttribute("x2",x);
  }
  document.getElementById("inspection-time").textContent="표시 구간 +"+(selected.ratio*WAVE_WINDOW_SECONDS).toFixed(1)+" s / 16 s";
  document.getElementById("inspection-pressure").textContent=selected.point.pressure.toFixed(1);
  document.getElementById("inspection-flow").textContent=selected.point.flow.toFixed(1);
  document.getElementById("inspection-volume").textContent=selected.point.volume.toFixed(0);
  document.getElementById("inspection-phase").textContent=({mandatory:"강제 흡기 (예시)",spontaneous:"자발 흡기 (예시)",expiration:"호기 (예시)"})[selected.point.phase];
}
function setInspector(next){
  if(next===inspectorActive)return;
  if(next){
    pausedBeforeInspection=waveformPaused;
    waveformPaused=true;
    inspectorActive=true;
    inspectionPanel.hidden=false;
    analysisButton.setAttribute("aria-pressed","true");
    analysisButton.textContent="⌖ 분석 종료";
    refreshPauseControl();
    paintWaveforms();
    inspectionPosition.focus();
  }else{
    inspectorActive=false;
    inspectionPanel.hidden=true;
    analysisButton.setAttribute("aria-pressed","false");
    analysisButton.textContent="⌖ 파형 분석";
    waveformPaused=pausedBeforeInspection;
    refreshPauseControl();
    renderInspection();
    analysisButton.focus();
  }
}
gridButton.addEventListener("click",()=>{
  gridVisible=!gridVisible;
  document.querySelector(".graph-area").classList.toggle("show-grid",gridVisible);
  gridButton.setAttribute("aria-pressed",String(gridVisible));
  gridButton.setAttribute("aria-label",gridVisible?"파형 격자 숨기기":"파형 격자 표시하기");
});
analysisButton.addEventListener("click",()=>setInspector(!inspectorActive));
inspectionPosition.addEventListener("input",()=>{
  inspectionRatio=clampRatio(Number(inspectionPosition.value)/100);
  renderInspection();
});
let waveformTime=0;
// Keep animations still by default when the device requests reduced motion.
// Students may explicitly choose Resume; the setting values remain interactive.
let waveformPaused=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let previousFrameTime=null;
let previousPaintTime=-1000;
function paintWaveforms(){
  const samples=generateWaveform(state,waveformTime,WAVE_WINDOW_SECONDS,320);
  displayedSamples=samples;
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
  renderInspection();
}
const pauseButton=document.getElementById("waveform-pause");
function refreshPauseControl(){
  pauseButton.setAttribute("aria-pressed",String(waveformPaused));
  pauseButton.setAttribute("aria-label",waveformPaused?"파형 재생":"파형 일시정지");
  pauseButton.textContent=waveformPaused?"▶ Resume":"Ⅱ Pause";
}
refreshPauseControl();
pauseButton.addEventListener("click",()=>{
  if(inspectorActive){setInspector(false);waveformPaused=false;}
  else waveformPaused=!waveformPaused;
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
initEducationUI();renderMonitor();renderSettings();renderCircuit();paintWaveforms();
requestAnimationFrame(animationFrame);
