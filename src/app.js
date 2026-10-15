import {compareWaveforms,COMPARE_TYPES,COMPARE_DURATION} from "./waveform-compare.js";
import {createLabSession,submitLabPrediction,beginLabObservation,beginLabInterpretation,submitLabInterpretation,completeLab,labHasObservation,labHasPredictionFeedback,labHasInterpretationFeedback} from "./lab-engine.js";
import {LAB_LESSONS,LAB_SOURCES,labLesson,labQuestion,auditLabLessons} from "./lab-lessons.js";
import {VERSION, PARAMETERS, DEVICE_REFERENCE, MONITOR_REFERENCE, initialSettings, adjustSetting, formatSetting} from "./sim-model.js";
import {generateWaveform, previewScales} from "./waveform-model.js";
import {beginSettingEdit, preferredEditStep, stepSettingEdit, parseSettingEntry, defaultSettingEdit, acceptSettingEdit} from "./setting-editor.js";
import {CLINICAL_TOPICS, TOPIC_GROUPS, EDUCATION_SOURCES, MANUAL_SECTIONS} from "./education-content.js";
import {RELEASE_CATEGORIES, notesForCategory} from "./release-notes.js";
import {clampRatio, ratioFromClientX, inspectAt} from "./waveform-inspector.js";
import {PRECLINICAL_CASES,CASE_SOURCES,findCase} from "./preclinical-cases.js";
import {startCase,chooseCaseAnswer,advanceCase,caseScore} from "./case-engine.js";
import {auditCaseBank,evidenceKindLabel} from "./case-quality.js";
import {ALARM_LESSONS,DISPLAY_CATEGORIES,DEVICE_EDUCATION_SOURCES,DEVICE_VERSION_REVIEW,termsForCategory,findAlarmLesson,evaluateAlarmChoice,auditDeviceEducation} from "./device-learning.js";
import {CORE_LESSONS,CORE_SOURCES,CORE_LESSON_EXTRAS,STUDENT_GLOSSARY,ESSENTIAL_SETTING_IDS,auditCoreLearning} from "./student-learning.js";
import {CORE_QUESTIONS,CORE_QUIZ_REVIEW,CORE_QUIZ_VERSION,CORE_QUIZ_SOURCES,CORE_REVIEW_GUIDE,auditCoreQuiz,startCoreQuiz,chooseCoreAnswer,advanceCoreQuiz,scoreCoreQuiz} from "./core-quiz.js";
const settingsContainer = document.getElementById("settings");
const monitor = document.getElementById("monitor");
const status = document.getElementById("status");
const panelHelp = document.getElementById("panel-help");
const panelCircuit = document.getElementById("panel-circuit");
const panelCase = document.getElementById("panel-case");
const panelAlarm = document.getElementById("panel-alarm");
const panelCore = document.getElementById("panel-core");
const coreTab = document.getElementById("tab-core");
const extraLearning = document.getElementById("extra-learning");
const helpTab = document.getElementById("tab-help");
const circuitTab = document.getElementById("tab-circuit");
const caseTab = document.getElementById("tab-case");
const alarmTab = document.getElementById("tab-alarm");
const circuitContent = document.getElementById("circuit-content");
let state = initialSettings(); // committed state only: sole input to waveform model
let controlMode = "device"; // explicit opt-in for legacy quick study controls
let editState = null; // {id, original, pending}, never feeds waveform engine
let quickHoldDelay=null,quickHoldInterval=null;
function stopQuickHold(){
 if(quickHoldDelay!==null)clearTimeout(quickHoldDelay);
 if(quickHoldInterval!==null)clearInterval(quickHoldInterval);
 quickHoldDelay=null;quickHoldInterval=null;
}
window.addEventListener("blur",stopQuickHold);
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopQuickHold();});
let editorFocusTarget = null;
document.body.dataset.controlMode = controlMode;
/* Presentation and layout are read-only projections of the existing DOM.
 * Never reconstruct settings, waveform SVG, CORE quiz, or CASE state on a view change. */
let studyArea="learning",clinicalDeviceExpanded=false;
const areaNote={
 simulator:"PB980 참고형 장비와 설정·파형을 관찰해. ALARM·CIRCUIT도 기존 메뉴에서 확인할 수 있어.",
 learning:"핵심 개념을 공부하면서 원래 장비 화면을 함께 볼 수 있어.",
 clinical:"가상 CASE의 환자 자료는 이 앱의 독립 고정 모니터·생성 파형과 연결되지 않아."
};
function setStudyArea(area){
 studyArea=area;document.body.dataset.studyArea=area;
 if(area!=="clinical")clinicalDeviceExpanded=false;
 document.body.dataset.clinicalDeviceExpanded=String(clinicalDeviceExpanded);
 document.querySelectorAll("[data-study-target]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.studyTarget===area)));
 document.getElementById("study-area-note").textContent=areaNote[area];
 const btn=document.getElementById("clinical-device-toggle");
 btn.hidden=area!=="clinical";btn.setAttribute("aria-expanded",String(clinicalDeviceExpanded));
 btn.textContent=clinicalDeviceExpanded?"참고용 장비 화면 접기 (CASE와 독립)":"참고용 장비 화면 펼치기 (CASE와 독립)";
}
function selectStudyArea(area){
 if(!["simulator","learning","clinical"].includes(area))return;
 presentationMode=area==="simulator"?"device":"learning";
 document.body.dataset.presentation=presentationMode;deviceExpanded=false;
 if(area==="clinical"){renderCase();showSideTab("case");}
 else showSideTab(area==="learning"?"core":"help");
 setStudyArea(area);syncViewChoices();syncResponsiveSections();
}
document.querySelectorAll("[data-study-target]").forEach(b=>b.addEventListener("click",()=>selectStudyArea(b.dataset.studyTarget)));
document.getElementById("clinical-device-toggle").addEventListener("click",()=>{
 clinicalDeviceExpanded=!clinicalDeviceExpanded;setStudyArea("clinical");syncResponsiveSections();
});
setStudyArea("learning");
let presentationMode="learning";
let layoutPreset="learning";
document.body.dataset.presentation=presentationMode;
document.body.dataset.layout=layoutPreset;
function syncViewChoices(){
  document.querySelectorAll("button[data-presentation]").forEach(button=>{
    button.setAttribute("aria-pressed",String(button.dataset.presentation===presentationMode));
  });
  document.querySelectorAll("button[data-layout]").forEach(button=>{
    button.setAttribute("aria-pressed",String(button.dataset.layout===layoutPreset));
  });
}
document.querySelectorAll("button[data-presentation]").forEach(button=>button.addEventListener("click",()=>{
  const next=button.dataset.presentation;
  if(!["learning","device"].includes(next))return;
  presentationMode=next;document.body.dataset.presentation=next;
  // When clinical study is focused, the existing device/learning presentation
  // buttons must also control the explicitly optional reference-device view.
  if(studyArea==="clinical"){clinicalDeviceExpanded=(next==="device");setStudyArea("clinical");}
  syncViewChoices();syncResponsiveSections();
}));
document.querySelectorAll("button[data-layout]").forEach(button=>button.addEventListener("click",()=>{
  const next=button.dataset.layout;
  if(!["learning","balanced","device"].includes(next))return;
  layoutPreset=next;document.body.dataset.layout=next;syncViewChoices();
}));
syncViewChoices();
// v0.5.3.2: isolated visual focus state, never mutates device/editor/quiz/case/LAB.
let studyOnly=false;
const studyOnlyToggle=document.getElementById("study-only-toggle");
function syncStudyOnly(){
 document.body.dataset.studyOnly=String(studyOnly);
 studyOnlyToggle.setAttribute("aria-pressed",String(studyOnly));
 studyOnlyToggle.textContent=studyOnly?"장비 함께 보기":"학습만 크게 보기";
}
studyOnlyToggle.addEventListener("click",()=>{
 studyOnly=!studyOnly;
 syncStudyOnly();
});
syncStudyOnly();
// Reorder existing DOM nodes only. Device, editor, quiz and CASE data remain unchanged.
const compactWorkspace=window.matchMedia("(max-width:1100px)");
const narrowDevice=window.matchMedia("(max-width:700px)");
// One responsive disclosure owns the SAME three header controls; never clone Reset/dialog buttons.
const mobileTools=document.getElementById("mobile-tools");
function syncMobileTools(){mobileTools.open=!narrowDevice.matches;}
narrowDevice.addEventListener("change",syncMobileTools);
syncMobileTools();
const workspace=document.querySelector(".workspace");
const devicePanel=document.getElementById("device-panel");
const learningPanel=document.getElementById("learning-panel");
const mobileDeviceToggle=document.getElementById("mobile-device-toggle");
let deviceExpanded=false;
function syncResponsiveSections(){
 const first=compactWorkspace.matches&&presentationMode==="learning"?learningPanel:devicePanel;
 if(workspace.firstElementChild!==first)workspace.insertBefore(first,workspace.firstElementChild);
 document.body.dataset.deviceExpanded=String(deviceExpanded);
 mobileDeviceToggle.setAttribute("aria-expanded",String(deviceExpanded));
 mobileDeviceToggle.textContent=deviceExpanded?"장비 화면 접기":"장비 화면 펼치기";
}
mobileDeviceToggle.addEventListener("click",()=>{
 deviceExpanded=!deviceExpanded;syncResponsiveSections();
 if(deviceExpanded){devicePanel.scrollIntoView({block:"start",behavior:"auto"});document.getElementById("mobile-learning-back").focus();}
 else learningPanel.scrollIntoView({block:"start",behavior:"auto"});
});
document.getElementById("mobile-learning-back").addEventListener("click",()=>{
 presentationMode="learning";deviceExpanded=false;document.body.dataset.presentation="learning";
 syncViewChoices();syncResponsiveSections();
 learningPanel.scrollIntoView({block:"start",behavior:"auto"});
 learningPanel.querySelector(".core-tabs button[aria-selected='true']")?.focus();
});
document.querySelector('a[href="#device-panel"]').addEventListener("click",event=>{
 if(narrowDevice.matches&&presentationMode==="learning"&&!deviceExpanded){
  event.preventDefault();deviceExpanded=true;syncResponsiveSections();
  devicePanel.scrollIntoView({block:"start",behavior:"auto"});
 }
});
compactWorkspace.addEventListener("change",syncResponsiveSections);
syncResponsiveSections();
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
  const supplementary=document.getElementById("more-clinical-topics");
  if(supplementary&&["pi","ti","ps","trigger","mode","waveforms","circuit","abga"].includes(id))supplementary.open=true;
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
    const supplementary=group.level==="additional";
    const wrapper=makeElement(supplementary?"details":"div","topic-group"+(supplementary?" clinical-extra":""));
    if(supplementary)wrapper.id="more-clinical-topics";
    wrapper.append(makeElement(supplementary?"summary":"div","topic-group-title",group.title));
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

// Quick links only change active visible panel/scroll; they never mark completion.
document.querySelectorAll("[data-learning-jump]").forEach(link=>link.addEventListener("click",event=>{
 event.preventDefault();
 const type=link.dataset.learningJump;
 if(type==="case"){selectStudyArea("clinical");}
 else{selectStudyArea("learning");}
 const target=document.getElementById(({concepts:"core-learning-content",quiz:"core-quiz-root",lab:"core-labs",case:"panel-case"})[type]);
 if(target){
  target.scrollIntoView({block:"start",behavior:"auto"});
  target.focus({preventScroll:true});
 }
}));
function showSideTab(tab) {
  if(tab==="circuit"||tab==="alarm")extraLearning.open=true;
  for (const [id,button,panel] of [
    ["core",coreTab,panelCore],["help",helpTab,panelHelp],["circuit",circuitTab,panelCircuit],["case",caseTab,panelCase],["alarm",alarmTab,panelAlarm]
  ]) {
    const active=id===tab;
    panel.hidden=!active;
    button.classList.toggle("active",active);
    button.setAttribute("aria-selected",String(active));
  }
  setStudyArea(tab==="core"?"learning":tab==="case"?"clinical":"simulator");
  syncCoreQuizPanel();
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
/* v0.5.1 reading surface: UI-only state; no edits to committed, pending,
 * monitor, waveform playback, quiz, or CASE session values. */
const readingDialog=document.getElementById("reading-dialog");
const readingTrigger=document.getElementById("open-reading");
const readingBody=document.getElementById("reading-dialog-body");
const MONITOR_READ_NAMES=Object.freeze([
  "최고 기도압 (Ppeak)",
  "평균 기도압 (Pmean)",
  "호기말 양압 (PEEP)",
  "흡기:호기 시간 비율 (I:E)",
  "총 호흡수 (fTOT)",
  "호기 일회호흡량 (VTE)",
  "총 호기 분당환기량 (V̇E TOT)"
]);
const SETTING_READ_NAMES=Object.freeze({
  fio2:"흡입 산소 농도 (FiO₂)",
  peep:"호기말 양압 설정 (PEEP)",
  rate:"설정 강제호흡수 (f)",
  pi:"압력제어 흡기압 설정 (Pᵢ)",
  ti:"강제흡기 시간 (Tᵢ)",
  ps:"자발호흡 압력보조 (PS)",
  trigger:"유량 트리거 감도 (V-TRIG)"
});
const WAVE_READ_NAMES=Object.freeze([
  {label:"Pressure / Time",title:"기도압-시간 파형",unit:"cmH₂O",description:"시간에 따른 기도압의 교육용 생성 곡선이야."},
  {label:"Flow / Time",title:"유량-시간 파형",unit:"L/min",description:"시간에 따른 유량의 교육용 생성 곡선이야."},
  {label:"Volume / Time",title:"용적-시간 파형",unit:"mL",description:"시간에 따른 용적의 교육용 생성 곡선이야."}
]);
let readingCategory="monitor"; // independent presentation state only
function makeReadingCard(label,value,unit,tag,description,source){
  const article=makeElement("article","reading-item");
  article.append(makeElement("h3",null,label));
  if(value!==null){
    const number=makeElement("strong","reading-value",value);
    if(unit)number.append(" ",makeElement("span","reading-unit",unit));
    article.append(number);
  }else if(unit){
    article.append(makeElement("strong","reading-wave-unit","단위 · "+unit));
  }
  article.append(makeElement("span","reading-tag",tag));
  if(description)article.append(makeElement("p","reading-explainer",description));
  article.append(makeElement("p","reading-source","자료 출처: "+source));
  return article;
}
function renderReadingCategory(){
  for(const button of document.querySelectorAll("[data-reading-category]")){
    button.setAttribute("aria-pressed",String(button.dataset.readingCategory===readingCategory));
  }
  readingBody.replaceChildren();
  const list=makeElement("div","reading-list");
  if(readingCategory==="monitor"){
    readingBody.append(makeElement("p","reading-notice",
      "서로 독립적인 7개 고정 예시값이야. 한 환자의 동시 측정값이 아니며 설정값이나 파형과 연동되지 않아."));
    MONITOR_REFERENCE.forEach(([label,value,unit],index)=>{
      list.append(makeReadingCard(label+" · "+MONITOR_READ_NAMES[index],value,unit||(label==="I:E"?"비율 (단위 없음)":""),
        "독립 고정 모니터 표시 예시",
        "이 숫자는 화면 표시를 연습하기 위한 예시야. 환자 실측값이나 치료 반응이 아니야.",
        "프로젝트 src/sim-model.js의 MONITOR_REFERENCE (고정 화면 예시)"));
    });
  }else if(readingCategory==="settings"){
    readingBody.append(makeElement("p","reading-notice",
      "교육용 설정의 현재 확정값만 표시해. Pending(미확정 편집값)은 반영되지 않고, 이 창에서는 설정을 변경할 수 없어."));
    for(const parameter of PARAMETERS){
      list.append(makeReadingCard(parameter.label+" · "+SETTING_READ_NAMES[parameter.id],
        formatSetting(parameter.id,state[parameter.id]),parameter.unit,
        "교육용 설정값 · 확정됨 (Committed)",parameter.help,
        "프로젝트 src/sim-model.js의 PARAMETERS와 현재 확정 설정 state"));
    }
    readingBody.append(makeElement("p","reading-notice",
      "상단의 PEEP 고정 표시 예시(5.8 cmH₂O)와 아래 교육용 PEEP 설정 기본값(5.0 cmH₂O)은 서로 다른 자료야."));
  }else{
    readingBody.append(makeElement("p","reading-notice",
      "Pressure·Flow·Volume은 일부 교육용 설정을 이용해 생성한 파형이야. 실제 PB980 신호나 환자 실측값이 아니야."));
    for(const wave of WAVE_READ_NAMES){
      list.append(makeReadingCard(wave.label+" · "+wave.title,null,wave.unit,
        "생성 곡선 · 실측 아님",wave.description+" 단위: "+wave.unit+".",
        "프로젝트 src/waveform-model.js의 교육용 generateWaveform 모델"));
    }
    readingBody.append(makeElement("p","reading-notice",
      "교육용 파형에 반영: PEEP·Pi·PS·f·Ti. FiO₂·V-TRIG 및 실제 환자의 SpO₂·ABGA·VTE·알람은 계산하거나 예측하지 않아. CASE의 가상 상황 자료도 별개야."));
  }
  readingBody.append(list);
  readingBody.scrollTop=0;
}
function initReadingUI(){
  readingTrigger.addEventListener("click",()=>{
    // Native modal prevents interacting with underlying controls. Never stack dialogs.
    if(Array.from(document.querySelectorAll("dialog")).some(dialog=>dialog.open))return;
    readingCategory="monitor";
    renderReadingCategory();
    readingDialog.showModal();
    document.getElementById("reading-close").focus();
  });
  document.querySelectorAll("[data-reading-category]").forEach(button=>{
    button.addEventListener("click",()=>{
      if(!readingDialog.open)return;
      readingCategory=button.dataset.readingCategory;
      renderReadingCategory();
    });
  });
  document.getElementById("reading-close").addEventListener("click",()=>readingDialog.close());
  readingDialog.addEventListener("close",()=>{
    if(readingTrigger.isConnected&&readingTrigger.getClientRects().length)readingTrigger.focus();
  });
  readingDialog.addEventListener("pointerdown",event=>{
    if(event.target!==readingDialog)return;
    const bounds=readingDialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||
       event.clientY<bounds.top||event.clientY>bounds.bottom){
      event.preventDefault();
      readingDialog.close();
    }
  });
}

function renderSettings() {
  settingsContainer.replaceChildren();
  for (const param of PARAMETERS) {
    const card=document.createElement("div");card.className="setting";card.dataset.settingId=param.id;
    const core=ESSENTIAL_SETTING_IDS.includes(param.id);
    card.dataset.learningTier=core?"core":"additional";
    const select=document.createElement("button");select.type="button";select.className="setting-select";
    select.setAttribute("aria-label",param.label+" 설정 선택");
    select.addEventListener("click",()=>openSettingEditor(param.id,select));
    const label=document.createElement("div");label.className="setting-name";label.textContent=param.label;
    const tier=makeElement("span","setting-tier",core?"핵심":"추가");label.append(tier);
    const value=document.createElement("div");value.className="setting-value";value.textContent=formatSetting(param.id,state[param.id]);
    const unit=document.createElement("div");unit.className="setting-unit";unit.textContent=param.unit;
    const buttons=document.createElement("div");buttons.className="step-buttons";
    for (const delta of param.steps) {
      const button=document.createElement("button");button.type="button";button.dataset.step=String(delta);
      button.textContent=delta>0?"+"+delta:String(delta);
      button.setAttribute("aria-label",param.label+" "+(delta>0?"증가 ":"감소 ")+Math.abs(delta));
      button.disabled = (delta<0 && state[param.id]<=param.min) || (delta>0 && state[param.id]>=param.max);
      const applyQuickStep=()=>{
        if(controlMode!=="quick")return;
        const next=adjustSetting(state,param.id,delta);
        const changed=next[param.id]!==state[param.id];
        state=next;
        status.textContent=changed ? param.label+": "+formatSetting(param.id,state[param.id])+param.unit+" (학습용 설정만 변경)" : "설정 범위 끝이야.";
        refreshSettings();
        if(changed)paintWaveforms();
      };
      button.addEventListener("pointerdown",event=>{
        if(event.pointerType==="mouse"&&event.button!==0)return;
        if(controlMode!=="quick"||button.disabled)return;
        stopQuickHold();
        applyQuickStep();
        quickHoldDelay=setTimeout(()=>{
          quickHoldDelay=null;
          quickHoldInterval=setInterval(()=>{
            if(button.disabled||controlMode!=="quick"){stopQuickHold();return;}
            applyQuickStep();
          },120);
        },400);
      });
      for(const type of ["pointerup","pointercancel","pointerleave","lostpointercapture"])button.addEventListener(type,stopQuickHold);
      button.addEventListener("click",event=>{if(event.detail===0)applyQuickStep();});
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
const editorNumber=document.getElementById("editor-number");
const editorEntryError=document.getElementById("editor-entry-error");
let editorRaw="",editorError=null;
let holdDelay=null,holdInterval=null;
function stopEditorHold(){
  if(holdDelay!==null)clearTimeout(holdDelay);
  if(holdInterval!==null)clearInterval(holdInterval);
  holdDelay=null;holdInterval=null;
}
window.addEventListener("blur",stopEditorHold);
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopEditorHold();});
function setEditorRaw(raw){
  editorRaw=raw;
  const parsed=parseSettingEntry(editState.id,raw);
  editorError=parsed.error;
  if(!editorError)editState={...editState,pending:parsed.value};
  editorNumber.setAttribute("aria-invalid",String(Boolean(editorError)));
  editorEntryError.hidden=!editorError;editorEntryError.textContent=editorError||"";
  document.getElementById("editor-accept").disabled=Boolean(editorError);
  if(!editorError)updateEditorDisplay(false);
}
editorNumber.addEventListener("input",()=>{if(editState)setEditorRaw(editorNumber.value);});
function startEditorHold(button,direction,event){
  if(event.pointerType==="mouse"&&event.button!==0)return;
  if(!editState||button.disabled)return;
  stopEditorHold();
  movePending(direction);
  holdDelay=setTimeout(()=>{
    holdDelay=null;
    holdInterval=setInterval(()=>{
      if(!editState||button.disabled){stopEditorHold();return;}
      movePending(direction);
    },120);
  },400);
}
for(const [button,dir] of [[incButton,1],[decButton,-1]]){
  button.addEventListener("pointerdown",event=>startEditorHold(button,dir,event));
  for(const type of ["pointerup","pointercancel","pointerleave","lostpointercapture"])button.addEventListener(type,stopEditorHold);
  // Pointerdown already applied one change. Keyboard-triggered clicks have detail 0.
  button.addEventListener("click",event=>{if(event.detail===0)movePending(dir);});
}

function setControlMode(next){
  if(next!=="device"&&next!=="quick")return;
  stopQuickHold();
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
function updateEditorDisplay(syncNumber=true){
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
  if(syncNumber){editorRaw=formatSetting(param.id,editState.pending);editorNumber.value=editorRaw;
    editorError=null;editorNumber.setAttribute("aria-invalid","false");
    editorEntryError.hidden=true;editorEntryError.textContent="";
    document.getElementById("editor-accept").disabled=false;
  }
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
  stopEditorHold();
  const focus=editorFocusTarget;
  editState=null;
  editorFocusTarget=null;
  if(editorDialog.open)editorDialog.close();
  if(focus&&focus.isConnected&&!focus.disabled)focus.focus();
}
function acceptEditor(){
  if(!editState||editorError)return;
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
document.getElementById("editor-cancel").addEventListener("click",closeSettingEditor);
document.getElementById("editor-reset").addEventListener("click",()=>{
  if(!editState)return;
  stopEditorHold();
  editState=defaultSettingEdit(editState);
  updateEditorDisplay();
  status.textContent="선택한 항목 기본값이 미확정값에 표시됐어. Accept로 반영해.";
});
editorForm.addEventListener("submit",event=>{
  event.preventDefault();
  if(!editState)return;
  // Validate again on submission; avoid applying stale typed drafts.
  const validated=parseSettingEntry(editState.id,editorNumber.value);
  if(validated.error){setEditorRaw(editorNumber.value);return;}
  editState={...editState,pending:validated.value};
  editorError=null;acceptEditor();
});
editorDialog.addEventListener("cancel",event=>{event.preventDefault();closeSettingEditor();});
editorDialog.addEventListener("keydown",event=>{
  if(event.target===editorNumber||event.isComposing)return;
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
const caseSessions=new Map(); // each fictional scenario is independently resumable in RAM
const caseActionAnswers=new Map(); // optional, unscored, independent of graded CASE state
let caseLearningReturnAvailable=false;
let reviewerCaseId=null;
function openCaseSession(caseId,restart=false){
 if(restart||!caseSessions.has(caseId))caseSessions.set(caseId,startCase(caseId));
 caseState=caseSessions.get(caseId);
 if(restart){
  reflectionNotes.delete(caseId);
  for(const key of caseActionAnswers.keys())if(key.startsWith(caseId+":"))caseActionAnswers.delete(key);
}
caseLearningReturnAvailable=false;
document.getElementById("case-study-return")?.setAttribute("hidden","");
 renderCase();
 document.querySelector("#case-content .case-answer, #case-content .case-back")?.focus();
}
function saveCaseSession(){if(caseState)caseSessions.set(caseState.caseId,caseState);}
const CASE_STEP_LABELS=Object.freeze({
 orientation:["예시 정보 출처","FiO₂ 설정 이해","환자·기도·회로 확인"],
 desaturation:["위험 신호 인지","추가 사정 정보","관찰 내용 보고"],
 "mas-neonate":["질환 이해","환자 악화 사정","흡인 원칙 구분"],
 "rsv-infant":["악화 신호 인지","분비물·기도 사정","출처 구분"]
});
function appendCaseRoadmap(root,scenario,activeIndex,done){
 const section=makeElement("section","case-roadmap");
 section.append(makeElement("h3",null,"이 사례의 학습 경로"));
 section.append(makeElement("p","case-roadmap-purpose","현재 목표를 확인하고 순서대로 판단해 봐. 이전 응답은 읽기만 가능하며 정답과 진행 상태는 수정할 수 없어."));
 const activeStep=scenario.steps[Math.min(activeIndex,scenario.steps.length-1)];
 const activeGoals=activeStep.objectiveIds.map(id=>scenario.objectives.find(goal=>goal.id===id)?.text).filter(Boolean);
 section.append(makeElement("p","case-current-goal",(done?"마지막 단계 목표: ":"현재 학습목표: ")+activeGoals.join(" / ")));
 const allGoals=makeElement("details","case-all-goals");
 allGoals.append(makeElement("summary",null,"이 사례의 전체 학습목표 펼치기"));
 const goals=makeElement("ul","case-roadmap-goals");
 for(const item of scenario.objectives)goals.append(makeElement("li",null,item.text));
 allGoals.append(goals);section.append(allGoals);
 const steps=makeElement("ol","case-roadmap-stages");
 const labels=CASE_STEP_LABELS[scenario.id]||scenario.steps.map((_,i)=>"문항 "+(i+1));
 for(const [i,label] of labels.entries()){
   const item=makeElement("li","case-roadmap-stage",label);
   if(i<activeIndex||done)item.classList.add("done");
   if(i===activeIndex&&!done)item.classList.add("current");
   item.append(makeElement("span",null,done||i<activeIndex?" · 확인함":i===activeIndex?" · 현재 단계":" · 다음 단계"));
   steps.append(item);
 }
 section.append(steps);
 section.append(makeElement("p","case-roadmap-end","이후: 결과·근거 복습 → 3개 디브리핑 질문"));
 root.append(section);
}
const reflectionNotes=new Map(); // intentionally RAM only, no student identity or storage
const clinicalDisclosureState=new Map(); // independent read-only panel state keyed by case/panel ID
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
/** Prior completed stages only. Never exposes an unanswered key or permits replay editing. */
function appendPriorCaseAnswers(root,scenario,state){
 const completed=state.answers.slice(0,state.index);
 if(!completed.length)return;
 const history=makeElement("details","case-history");
 history.append(makeElement("summary",null,"이전 응답 "+completed.length+"개 복습 · 읽기 전용"));
 for(const [i,answer] of completed.entries()){
  const step=scenario.steps[i];
  const chosen=step.options.find(option=>option.id===answer.choiceId);
  const entry=makeElement("section","case-history-item");
  entry.append(makeElement("strong",null,(i+1)+". "+step.question));
  entry.append(makeElement("p",null,"내가 선택한 답: "+(chosen?.label||"확인 불가")));
  entry.append(makeElement("p",null,"해설: "+step.explanation));
  history.append(entry);
 }
 root.append(history);
}
function appendCaseObjectiveReview(root,scenario,state){
 const section=makeElement("section","case-objective-review");
 section.append(makeElement("h4",null,"학습목표별 복습 방향"));
 for(const objective of scenario.objectives){
  const related=scenario.steps.map((step,i)=>({step,answer:state.answers[i]})).filter(x=>x.step.objectiveIds.includes(objective.id));
  const toReview=related.some(x=>!x.answer?.correct);
  const row=makeElement("p",null,null);
  row.append(makeElement("strong",null,objective.text+" · "),
    document.createTextNode(toReview?"관련 선택지를 다시 읽고 근거를 설명해 봐.":"관련 응답을 확인했어. 실제 환자 관찰과 보고에 적용할 수 있는지 생각해 봐."));
  section.append(row);
 }
 root.append(section);
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

/** Read-only CASE records, separate from static adult reference device and waveform. */
function appendCaseClinicalPanels(root,scenario,stepIndex,answeredCount,done){
 const data=scenario.clinicalData;
 if(!data)return;
 const section=makeElement("section","case-clinical-data");
 section.append(makeElement("h3",null,"가상 임상자료 · 검사와 관찰"));
 section.append(makeElement("p","case-clinical-policy",data.note));
 const available=data.panels.filter(panel=>done||stepIndex>=panel.availableFromStep);
 for(const panel of available){
  const card=makeElement("section","case-clinical-card");
  card.dataset.clinicalPanel=panel.id;
  card.append(makeElement("strong",null,panel.title));
  card.append(makeElement("p","case-clinical-preview",panel.preview));
  const details=makeElement("details","case-clinical-details");
  const key=scenario.id+":"+panel.id;
  details.open=clinicalDisclosureState.get(key)??false;
  details.addEventListener("toggle",()=>clinicalDisclosureState.set(key,details.open));
  details.append(makeElement("summary",null,"검체·채혈 시점·상세 자료 펼치기"));
  const body=makeElement("div","case-clinical-body");
  body.append(makeElement("p",null,"자료 확인 시점: "+panel.collectedAt));
  body.append(makeElement("p",null,"검체/종류: "+panel.sampleType+" · 측정 조건: "+panel.oxygenContext));
  if(panel.values){
   const table=makeElement("table","case-lab-table");
   const head=makeElement("tr");
   for(const text of ["항목","가상 값","단위"])head.append(makeElement("th",null,text));
   table.append(head);
   for(const value of panel.values){
    const line=makeElement("tr");
    for(const text of [value.label,String(value.value),value.unit||"—"])line.append(makeElement("td",null,text));
    table.append(line);
   }
   body.append(table);
  }
  if(panel.findings){
   const list=makeElement("ul","case-clinical-findings");
   for(const text of panel.findings)list.append(makeElement("li",null,text));
   body.append(list);
  }
  if(done||answeredCount>panel.availableFromStep){
   body.append(makeElement("p","case-clinical-interpretation","선택 후 자료 해석 · "+panel.interpretation));
  }else{
   body.append(makeElement("p","case-clinical-gate","검사 및 관찰 정보를 먼저 해석해 봐. 권장 해석은 현재 관련 문항 응답 후에 제공해."));
  }
  caseSources(body,panel.sourceIds);
  details.append(body);card.append(details);section.append(card);
 }
 if(!available.length)section.append(makeElement("p","case-clinical-pending","현재는 환자 직접 사정이 우선이야. 다음 학습 단계에서 별도로 이미 채혈된 검사자료를 확인할 수 있어."));
 root.append(section);
}

/** Optional non-scored RAAS-inspired nursing action: one choice per scenario. */
function renderCaseAction(root,scenario,step){
 const task=step.actionExercise;
 if(!task)return;
 const key=scenario.id+":"+step.id;
 const selectedId=caseActionAnswers.get(key);
 const panel=makeElement("section","case-action-exercise");
 panel.dataset.actionStep=step.id;
 panel.append(makeElement("h4",null,"간호 행동 확인 · 비채점 선택학습"));
 panel.append(makeElement("p","case-action-question",task.prompt));
 const buttons=makeElement("div","case-action-options");
 for(const option of task.options){
  const btn=caseButton(option.label,()=>{
   if(caseActionAnswers.has(key))return;
   caseActionAnswers.set(key,option.id);
   renderCase();
   document.querySelector(".case-action-result")?.focus();
  },"case-action-option");
  btn.disabled=Boolean(selectedId);
  if(selectedId===option.id){btn.classList.add("selected");btn.setAttribute("aria-pressed","true");}
  buttons.append(btn);
 }
 panel.append(buttons);
 if(selectedId){
  const selected=task.options.find(x=>x.id===selectedId);
  const recommended=task.options.find(x=>x.id===task.answer);
  const result=makeElement("section","case-action-result");
  result.tabIndex=-1;
  result.append(makeElement("h5",null,selectedId===task.answer?"간호 행동 판단 확인":"추가 복습이 필요한 행동"));
  result.append(makeElement("p",null,"내 선택 · "+selected.label));
  result.append(makeElement("p",null,"권장 행동 · "+recommended.label));
  result.append(makeElement("p",null,"내 선택의 이유 · "+selected.feedback));
  result.append(makeElement("p",null,"판단 근거 · "+task.rationale));
  result.append(makeElement("p",null,"사정 · "+task.assessment));
  result.append(makeElement("p",null,"보고 · "+task.escalation));
  result.append(makeElement("p",null,"추가 학습 · "+task.learning));
  const review=makeElement("div","case-action-review-links");
  for(const id of task.reviewConceptIds){
   review.append(caseButton(id==="blood-gas"?"혈액가스검사 기초 학습 →":"환자 우선 사정 핵심 학습 →",()=>openCaseRelatedLearning(id),"case-action-review-button"));
  }
  result.append(review);
  caseSources(result,task.sourceIds);
  panel.append(result);
 }else panel.append(makeElement("p","case-action-optional","선택하지 않아도 다음 문항으로 진행 가능해. 이 활동은 CASE 정답률에 포함되지 않아."));
 root.append(panel);
}
function appendCaseActionReview(root,scenario){
 const tasks=scenario.steps.filter(step=>step.actionExercise);
 if(!tasks.length)return;
 const section=makeElement("section","case-action-summary");
 section.append(makeElement("h4",null,"비채점 간호 행동 복습"));
 for(const step of tasks){
  const task=step.actionExercise;
  const chosen=caseActionAnswers.get(scenario.id+":"+step.id);
  const entry=makeElement("div","case-action-summary-entry");
  entry.append(makeElement("strong",null,task.prompt));
  if(chosen){
   const selected=task.options.find(x=>x.id===chosen);
   entry.append(makeElement("p",null,"내 선택: "+selected.label));
   entry.append(makeElement("p",null,"권장 행동: "+task.options.find(x=>x.id===task.answer).label));
   entry.append(makeElement("p",null,selected.feedback));
  }else entry.append(makeElement("p",null,"선택하지 않은 학습 활동이야. CASE 점수에는 영향을 주지 않았어."));
  entry.append(makeElement("p",null,task.rationale));
  section.append(entry);
 }
 root.append(section);
}
function openCaseRelatedLearning(id){
 if(!caseState)return;
 caseLearningReturnAvailable=true;
 showSideTab("core");
 const back=document.getElementById("case-study-return");
 back.hidden=false;
 if(id==="blood-gas"){
  const lesson=document.getElementById("blood-gas-basics");
  lesson.open=true;lesson.scrollIntoView({block:"nearest",behavior:"auto"});
  lesson.querySelector("summary")?.focus();
 }else openCoreConcept(id);
}
function returnToCaseFromLearning(){
 caseLearningReturnAvailable=false;
 document.getElementById("case-study-return").hidden=true;
 renderCase();showSideTab("case");
 (document.querySelector(".case-action-result")||document.querySelector(".case-next")||document.querySelector(".case-back"))?.focus();
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
    let lastGroup=null;
    for(const scenario of PRECLINICAL_CASES){
      const group=scenario.population||"adult";
      if(group!==lastGroup){root.append(makeElement("h3","case-group-heading",({adult:"성인 CASE",newborn:"신생아 CASE",infant:"영아 CASE"})[group]||"CASE"));lastGroup=group;}
      const card=makeElement("section","case-card");
      card.append(makeElement("h3",null,scenario.title));
      card.append(makeElement("p","case-meta",scenario.level+" · 약 "+scenario.minutes+"분 · "+scenario.status));
      card.append(makeElement("p",null,scenario.premise));
      const ul=makeElement("ul","case-objectives");
      for(const goal of scenario.objectives)ul.append(makeElement("li",null,goal.text));
      card.append(ul);
      const saved=caseSessions.get(scenario.id);
      card.append(makeElement("p","case-session-status",!saved?"진행 상태: 시작 전":saved.done?"진행 상태: 완료 · 결과 확인 가능":"진행 상태: "+(saved.index+1)+"/"+scenario.steps.length+"문항"));
      card.append(caseButton(!saved?"이 사례 시작":saved.done?"완료 결과 보기":"이어 하기",()=>{
        reviewerCaseId=null;openCaseSession(scenario.id);
      },"case-primary"));
      if(saved)card.append(caseButton("이 사례 처음부터 다시 시작",()=>{
        reviewerCaseId=null;openCaseSession(scenario.id,true);
      },"case-restart"));
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
  root.append(caseButton("← 사례 목록 (진행 유지)",()=>{saveCaseSession();caseState=null;renderCase();caseTab.focus();},"case-back"));
  appendCaseRoadmap(root,scenario,caseState.index,caseState.done);
  const context=makeElement("details","case-context");
  context.open=caseState.index===0&&!caseState.done;
  context.append(makeElement("summary",null,"가상 상황 자료·사전 안내 다시 보기 (언제든 펼치기)"));
  context.append(makeElement("p",null,scenario.premise));
  context.append(makeElement("p","case-prebrief",scenario.prebrief));
  const readings=makeElement("ul","case-vignette");
  for(const item of scenario.vignette)readings.append(makeElement("li",null,item));
  context.append(readings);
  root.append(context); // Objectives are in the roadmap disclosure, not duplicated here.
  appendCaseClinicalPanels(root,scenario,caseState.index,caseState.answers.length,caseState.done);

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
    appendCaseObjectiveReview(root,scenario,caseState);
    appendCaseActionReview(root,scenario);
    renderReflection(root,scenario);
    root.append(caseButton("이 사례 처음부터 다시 풀기",()=>openCaseSession(scenario.id,true),"case-primary"));
    caseSources(root,scenario.sources);
    return;
  }
  appendPriorCaseAnswers(root,scenario,caseState);
  const step=scenario.steps[caseState.index];
  root.append(makeElement("p","case-progress","현재 학습 단계 · 문항 "+(caseState.index+1)+" / "+score.total+" · "+(CASE_STEP_LABELS[scenario.id]?.[caseState.index]||"상황 판단")));
  root.append(makeElement("h3","case-question",step.question));
  const chosen=caseState.answers[caseState.index];
  const choiceRoot=makeElement("div","case-answers");
  for(const option of step.options){
    const btn=caseButton(option.label,()=>{
      if(caseState.answers.length>caseState.index)return;
      caseState=chooseCaseAnswer(caseState,option.id);
      saveCaseSession();renderCase();
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
    feedback.append(makeElement("p","case-why","판단 이유 · "+step.explanation));
    appendCaseEvidence(feedback,step,scenario);
    root.append(feedback);
    renderCaseAction(root,scenario,step);
    root.append(caseButton(caseState.index===score.total-1?"결과·복습 보기":"다음 문항 →",()=>{
      caseState=advanceCase(caseState);
      saveCaseSession();renderCase();
      (root.querySelector(".case-answer")||root.querySelector(".case-primary"))?.focus();
    },"case-next case-primary"));
  }else{
    root.append(makeElement("p","case-hint","선택 후 이유와 참고 근거가 나타나. 실제 장비 설정이나 사례 수치는 바뀌지 않아."));
  }
  caseSources(root,scenario.sources);
}

/* v0.4.1: student-first learning is a read-only explanation layer.
 * Never mutates device settings, synthetic graph or reference monitor data. */
const coreAudit=auditCoreLearning();
function renderCoreLearning(){
  const root=document.getElementById("core-learning-content");
  root.replaceChildren();
  const caseReturn=caseButton("← 진행하던 CASE로 돌아가기",returnToCaseFromLearning,"case-study-return");
  caseReturn.id="case-study-return";caseReturn.hidden=!caseLearningReturnAvailable;
  root.append(caseReturn);
  if(coreAudit.problems.length){
    root.append(makeElement("p","core-audit-error","학습 콘텐츠 검사 실패: "+coreAudit.problems.join(", ")));
    return;
  }
  for(const item of CORE_LESSONS){
    const card=makeElement("details","core-concept");
    card.dataset.conceptId=item.id;
    const header=makeElement("summary","core-concept-header");
    const title=makeElement("span","core-concept-title");
    title.append(makeElement("strong",null,item.title),makeElement("span",null,item.label));
    header.append(title,makeElement("span","core-concept-short",item.key),makeElement("span","core-observation","간호 관찰 · "+item.observe));
    card.append(header);
    const body=makeElement("div","core-concept-body");
    const extras=CORE_LESSON_EXTRAS[item.id];
    const content=[
      ["쉬운 정의",item.key+". "+item.meaning],
      ["작동 원리·의미",extras.principle],
      ["실제 간호 관찰",item.observe],
      ["흔한 오개념과 주의",item.caution],
      ["간단한 예시",extras.example],
      ["이 앱의 자료 구분",item.simulator]
    ];
    for(const [label,text] of content){
      const p=makeElement("p",null,null);
      p.append(makeElement("strong",null,label+" · "),document.createTextNode(text));
      body.append(p);
    }
    const deeper=makeElement("details","core-deep");
    deeper.append(makeElement("summary",null,"심화 개념·참고문헌 펼치기"));
    deeper.append(makeElement("p",null,extras.advanced));
    const source=makeElement("div","core-concept-sources");
    source.append(makeElement("strong",null,"참고"));
    for(const key of item.reference){
      const ref=CORE_SOURCES[key];
      const a=makeElement("a",null,ref.label);
      a.href=ref.url;a.target="_blank";a.rel="noopener noreferrer";
      source.append(a);
    }
    deeper.append(source);body.append(deeper);
    const returnButton=makeElement("button","core-return-button","학습 확인으로 돌아가기 →");
    returnButton.type="button";returnButton.hidden=true;
    returnButton.addEventListener("click",returnToCoreQuiz);
    body.append(returnButton);
    card.append(body);
    root.append(card);
  }
  const glossary=makeElement("details","student-glossary");
  glossary.append(makeElement("summary",null,"처음 보는 약어 · PBW, Pplat, auto-PEEP, ABGA, V-TRIG"));
  for(const entry of STUDENT_GLOSSARY){
    const term=makeElement("p",null,null);
    term.append(makeElement("strong",null,entry.term+" · "),document.createTextNode(entry.text));
    glossary.append(term);
  }
  root.append(glossary);
  const gas=makeElement("details","case-blood-gas-basics");gas.id="blood-gas-basics";
  gas.append(makeElement("summary",null,"혈액가스검사 기초 · ABGA와 CBG 구분"));
  const content=[
   "pH는 산-염기 상태를, PaCO₂/PCO₂는 CO₂ 배출과 환기 상태를 이해할 때 활용해. HCO₃⁻는 산-염기 평가의 중요한 구성요소야.",
   "ABGA는 동맥혈 채혈로 PaO₂를 평가할 수 있지만 채혈 시점과 당시 FiO₂·환자 상태를 같이 확인해야 해.",
   "CBG는 신생아·소아에서 pH와 PCO₂ 평가에 도움이 될 수 있으나, CBG의 PO₂를 동맥혈 PaO₂와 같은 산소화 지표로 해석하면 안 돼.",
   "SpO₂는 맥박산소측정기의 비침습 산소포화도 추정치로, PaO₂와 다른 검사야. 환자 상태와 측정 신호도 함께 확인해.",
   "이 CASE의 검사 결과는 미리 정한 가상 기록이며 시뮬레이터의 PB980 고정 모니터·생성 파형 또는 실제 환자 수치로 계산되지 않아."
  ];
  for(const value of content)gas.append(makeElement("p",null,value));
  const src=makeElement("p","case-blood-gas-source");
  const link=makeElement("a",null,"AARC 2022 · 소아 모세혈 혈액가스검사 지침");
  link.href="https://pubmed.ncbi.nlm.nih.gov/36002161/";link.target="_blank";link.rel="noopener noreferrer";
  src.append(link);gas.append(src);root.append(gas);
}


/* D5-A guided, optional CORE LAB. All answers belong to per-LAB RAM sessions.
 * Device committed/Pending, live waveforms, fixed monitors, CORE/CASE are untouched. */
const LAB_EXPERIMENTS=Object.freeze({
 peep:{id:"peep",baseline:5,trial:8,label:"PEEP",unit:"cmH₂O",note:"생성 Pressure 파형의 호기말 기준선이 이동해. 산소화·폐포 모집·순환 반응의 예측은 아니야."},
 rate:{id:"rate",baseline:15,trial:18,label:"설정 f",unit:"/min",note:"교육용 강제호흡 파형의 간격이 달라져. 실제 총호흡수나 자발호흡 빈도의 예측은 아니야."},
 fio2:{id:"fio2",baseline:40,trial:60,label:"FiO₂",unit:"%",note:"현재 생성 모델은 FiO₂를 파형 계산에 사용하지 않아서 두 곡선이 겹쳐. 실제 환자에서 산소화 반응이 없다는 뜻은 아니야."}
});
const labContentAudit=auditLabLessons();
if(!labContentAudit.valid)throw new Error("LAB lesson data failed validation: "+labContentAudit.errors.join("; "));
const LAB_NS="http://www.w3.org/2000/svg";
const labStart=document.getElementById("lab-start");
const labWorkspace=document.getElementById("lab-workspace");
const labSvg=document.getElementById("lab-graph");
const labObservationView=document.getElementById("lab-observation-view");
const labSessions=new Map(),labDrafts=new Map();
let labState={active:false,experiment:"peep",graph:"pressure"},labSnapshot=null;
function activeLabSession(){
 if(!labSessions.has(labState.experiment))labSessions.set(labState.experiment,createLabSession(labState.experiment));
 return labSessions.get(labState.experiment);
}
function storeLabSession(session){
 if(session.labId!==labState.experiment)throw new Error("LAB session identity mismatch");
 labSessions.set(session.labId,session);
}
function labSvgElement(tag,attrs={},label=null){
 const element=document.createElementNS(LAB_NS,tag);
 for(const [key,value] of Object.entries(attrs))element.setAttribute(key,String(value));
 if(label!==null)element.textContent=label;
 return element;
}
function renderLabGraph(){
 if(!labSnapshot||!labHasObservation(activeLabSession()))return;
 const name=labState.graph,axis=labSnapshot.axes[name],meta=COMPARE_TYPES[name];
 const compact=window.matchMedia("(max-width:550px)").matches;
 labSvg.setAttribute("viewBox",compact?"0 0 380 235":"0 0 760 235");
 const left=compact?47:61,right=compact?365:738,top=22,bottom=192,width=right-left,height=bottom-top;
 const x=i=>left+width*i/(labSnapshot.count-1);
 const y=v=>bottom-(v-axis.min)/(axis.max-axis.min)*height;
 labSvg.replaceChildren(
  labSvgElement("title",{},"교육용 "+meta.label+" · 기준/실험 겹침"),
  labSvgElement("desc",{},document.getElementById("lab-result-note").textContent)
 );
 for(let i=0;i<=4;i++){
  const value=axis.min+(axis.max-axis.min)*i/4,yy=y(value);
  labSvg.append(labSvgElement("line",{x1:left,y1:yy,x2:right,y2:yy,class:"lab-grid-line"}));
  labSvg.append(labSvgElement("text",{x:left-9,y:yy+4,"text-anchor":"end",class:"lab-tick"},String(Number(value.toFixed(1)))));
 }
 if(name==="flow")labSvg.append(labSvgElement("line",{x1:left,y1:y(0),x2:right,y2:y(0),class:"lab-zero-line"}));
 for(const t of [0,8,16])labSvg.append(labSvgElement("text",{x:left+width*t/COMPARE_DURATION,y:211,"text-anchor":"middle",class:"lab-tick"},t+" s"));
 const path=part=>labSnapshot[part].map((point,i)=>(i?"L":"M")+x(i).toFixed(2)+" "+y(point[name]).toFixed(2)).join(" ");
 labSvg.append(labSvgElement("path",{d:path("baseline"),class:"lab-line-baseline","data-lab-series":"baseline"}));
 labSvg.append(labSvgElement("path",{d:path("trial"),class:"lab-line-trial","data-lab-series":"trial"}));
 document.getElementById("lab-graph-title").textContent=meta.label+" · "+meta.unit+" · 공통 Y축 "+axis.min.toFixed(1)+" ~ "+axis.max.toFixed(1)+" "+meta.unit;
 labSvg.setAttribute("aria-label",meta.label+" · 기준 회색 점선과 실험 강조 실선 · "+meta.unit+" · 0–16초");
}
function renderLabSources(target,sourceIds){
 const refs=makeElement("div","lab-evidence");
 refs.append(makeElement("strong",null,"근거 및 자료 성격 (임상 감수 전)"));
 for(const id of sourceIds){
  const source=LAB_SOURCES[id];
  const entry=makeElement("p",null,source.title+" · "+source.note);
  if(source.url){
   const link=makeElement("a",null,"원문 확인");link.href=source.url;link.target="_blank";link.rel="noopener noreferrer";
   entry.append(" ",link);
  }
  refs.append(entry);
 }
 target.append(refs);
}
function renderLabQuestion(root,question,session){
 root.replaceChildren();
 const predict=question.phase==="predict",answered=predict?labHasPredictionFeedback(session):labHasInterpretationFeedback(session);
 const selected=predict?session.predictedChoice:session.interpretedChoice;
 const heading=makeElement("h4","lab-question-title",predict?"1단계 · 변화 예상":"3단계 · 결과 이해 확인");
 root.append(heading);
 const questionNumber=makeElement("p","lab-question-prompt",question.prompt);
 root.append(questionNumber);
 if(!answered){
  const form=makeElement("form","lab-question-form");
  const choices=makeElement("fieldset","lab-question-choices");
  const legend=makeElement("legend",null,"답안을 고른 다음 제출해.");
  choices.append(legend);
  const key=session.labId+":"+question.phase;
  for(const option of question.options){
   const label=makeElement("label","lab-question-choice");
   const input=makeElement("input");
   input.type="radio";input.name="lab-"+question.phase+"-"+session.labId;input.value=option.id;
   input.checked=labDrafts.get(key)===option.id;
   input.addEventListener("change",()=>labDrafts.set(key,option.id));
   label.append(input,makeElement("span",null,option.text));choices.append(label);
  }
  const submit=makeElement("button","lab-action lab-submit",predict?"예상 답안 제출":"결과 확인 답안 제출");
  submit.type="submit";submit.id=predict?"lab-predict-submit":"lab-interpret-submit";
  form.addEventListener("submit",event=>{
   event.preventDefault();
   const choice=labDrafts.get(key);
   if(!question.options.some(option=>option.id===choice)){
    root.querySelector("input")?.focus();return;
   }
   const allowed=question.options.map(option=>option.id);
   const next=predict?submitLabPrediction(activeLabSession(),choice,allowed):submitLabInterpretation(activeLabSession(),choice,allowed);
   storeLabSession(next);labDrafts.delete(key);renderWaveLab();
   document.getElementById(predict?"lab-to-observation":"lab-to-review").focus();
  });
  form.append(choices,submit);root.append(form);
  return;
 }
 const answer=question.options.find(option=>option.id===selected);
 const correct=selected===question.answer;
 const outcome=makeElement("p","lab-question-outcome",correct?"선택한 답안 · 이 앱 모델과 일치":"선택한 답안 · 다시 생각해 볼 지점");
 root.append(outcome,makeElement("p","lab-readonly","제출한 답안은 수정할 수 없어. 다시 풀려면 이 LAB만 재시작해."));
 for(const option of question.options){
  const entry=makeElement("div","lab-answer-explanation");
  if(option.id===selected)entry.classList.add("lab-answer-selected");
  const prefix=option.id===selected?"내가 선택함 · ":"";
  const isAnswer=option.id===question.answer?" · 모델 기준 정답":"";
  entry.append(makeElement("strong",null,prefix+option.text+isAnswer),makeElement("p",null,option.feedback));
  root.append(entry);
 }
 root.append(makeElement("p","lab-question-explanation",question.explanation));
 renderLabSources(root,question.sourceIds);
}
function renderWaveLab(){
 labStart.hidden=labState.active;labStart.setAttribute("aria-expanded",String(labState.active));
 labWorkspace.hidden=!labState.active;
 if(!labState.active)return;
 const exp=LAB_EXPERIMENTS[labState.experiment],lesson=labLesson(labState.experiment);
 const session=activeLabSession(),visible=labHasObservation(session);
 document.querySelectorAll("[data-lab-experiment]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.labExperiment===labState.experiment)));
 document.querySelectorAll("[data-lab-graph]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.labGraph===labState.graph)));
 document.getElementById("lab-comparison-summary").textContent=exp.label+" · 기준 "+exp.baseline+" → 실험 "+exp.trial+" "+exp.unit+" | 다른 초기 설정 동일 · 현재 장비 설정과 무관";
 document.getElementById("lab-objective").textContent="학습 목표 · "+lesson.objective;
 document.getElementById("lab-phase-status").textContent=({
  "predict-unanswered":"예상 답안 선택·제출 전 · 관찰 파형 비공개",
  "predict-answered":"예상 피드백 확인 · 관찰 시작 가능",
  observation:"기준/실험 생성 파형 관찰",
  "interpret-unanswered":"관찰 후 결과 이해 문제",
  "interpret-answered":"결과 이해 피드백 확인",
  completed:"실습 요약 완료 · 재시작이나 다른 LAB 선택 가능"
 })[session.phase];
 renderLabQuestion(document.getElementById("lab-predict-root"),labQuestion(session.labId,"predict"),session);
 const interpretRoot=document.getElementById("lab-interpret-root");
 const showInterpret=["interpret-unanswered","interpret-answered","completed"].includes(session.phase);
 interpretRoot.hidden=!showInterpret;
 if(showInterpret)renderLabQuestion(interpretRoot,labQuestion(session.labId,"interpret"),session);
 else interpretRoot.replaceChildren();
 document.getElementById("lab-to-observation").hidden=session.phase!=="predict-answered";
 document.getElementById("lab-to-interpret").hidden=session.phase!=="observation";
 document.getElementById("lab-to-review").hidden=session.phase!=="interpret-answered";
 const review=document.getElementById("lab-final-review");
 review.hidden=session.phase!=="completed";
 if(!review.hidden){
  review.replaceChildren(makeElement("h4",null,"4단계 · 실습 요약"),makeElement("p",null,lesson.summary),
   makeElement("p",null,"이 LAB은 교육용 생성 파형만 비교하고, 실제 환자 산소화·호흡노력·혈역학 반응 또는 PB980 펌웨어를 예측하지 않아. 임상 전문가 검토 전 자료야."));
  renderLabSources(review,["generator","aarc"]);
 }
 labObservationView.hidden=!visible;
 if(!visible){
  // Clearing the entire SVG and result nodes also prevents stale SVG title/desc,
  // hidden keyboard focus or screen-reader announcements from leaking answers.
  labSnapshot=null;labSvg.replaceChildren();
  labSvg.setAttribute("aria-label","예상 답안 제출 후 관찰 단계에서 그래프가 표시돼.");
  document.getElementById("lab-graph-title").textContent="";
  document.getElementById("lab-result-note").textContent="";
  document.getElementById("lab-overlap-note").textContent="";
  document.getElementById("lab-overlap-note").hidden=true;
  return;
 }
 if(!labSnapshot){
  const baseline=initialSettings(),trial={...initialSettings(),[exp.id]:exp.trial};
  labSnapshot=compareWaveforms(baseline,trial);
 }
 document.getElementById("lab-result-note").textContent=exp.note;
 const coincident=labSnapshot.baseline.every((point,i)=>Object.keys(COMPARE_TYPES).every(key=>point[key]===labSnapshot.trial[i][key]));
 const overlap=document.getElementById("lab-overlap-note");
 overlap.textContent=coincident?"두 교육용 생성 파형이 완전히 겹쳐 하나의 선처럼 보여. 이것이 실제 환자에서 산소화 반응이 없다는 의미는 아니야.":"";
 overlap.hidden=!coincident;
 renderLabGraph();
}
labStart.addEventListener("click",()=>{
 labState.active=true;labState.experiment="peep";labState.graph="pressure";labSnapshot=null;renderWaveLab();
 document.querySelector('[data-lab-experiment="peep"]').focus();
});
document.querySelectorAll("[data-lab-experiment]").forEach(b=>b.addEventListener("click",()=>{
 if(labState.experiment===b.dataset.labExperiment)return;
 labState.experiment=b.dataset.labExperiment;labSnapshot=null;renderWaveLab();
}));
document.querySelectorAll("[data-lab-graph]").forEach(b=>b.addEventListener("click",()=>{
 labState.graph=b.dataset.labGraph;renderWaveLab();
}));
document.getElementById("lab-to-observation").addEventListener("click",()=>{
 storeLabSession(beginLabObservation(activeLabSession()));labSnapshot=null;renderWaveLab();
 document.getElementById("lab-graph").focus();
});
document.getElementById("lab-to-interpret").addEventListener("click",()=>{
 storeLabSession(beginLabInterpretation(activeLabSession()));renderWaveLab();
 document.getElementById("lab-interpret-root").querySelector("input")?.focus();
});
document.getElementById("lab-to-review").addEventListener("click",()=>{
 storeLabSession(completeLab(activeLabSession()));renderWaveLab();document.getElementById("lab-final-review").focus();
});
document.getElementById("lab-restart").addEventListener("click",()=>{
 labSessions.set(labState.experiment,createLabSession(labState.experiment));
 labDrafts.delete(labState.experiment+":predict");labDrafts.delete(labState.experiment+":interpret");
 labSnapshot=null;renderWaveLab();document.getElementById("lab-predict-root").querySelector("input")?.focus();
});
document.getElementById("lab-exit").addEventListener("click",()=>{
 // Closing the surface is not restarting: each session stays in page RAM.
 labState.active=false;labState.experiment="peep";labState.graph="pressure";labSnapshot=null;
 labSvg.replaceChildren();renderWaveLab();labStart.focus();
});
window.addEventListener("resize",()=>{if(labState.active&&labHasObservation(activeLabSession()))renderLabGraph();});

/* v0.4.2: isolated knowledge-check state; resetting device values or revisiting CASE
 * must never mutate this assessment or any waveform/fixed-monitor content. */
const coreQuizAudit=auditCoreQuiz();
let coreQuizState=null;
function syncCoreQuizPanel(){
 const panel=document.querySelector(".study-panel");
 const active=Boolean(coreQuizState)&&!panelCore.hidden;
 panel.classList.toggle("core-quiz-active",active);
 if(active)panel.tabIndex=0;
 else panel.removeAttribute("tabindex");
}
function returnToCoreQuiz(){
 const root=document.getElementById("core-quiz-root");
 root.scrollIntoView({block:"nearest",behavior:"auto"});
 const focus=root.querySelector(".core-quiz-next, .core-quiz-answer:not(:disabled), .core-quiz-primary");
 (focus||root).focus();
}
function quizButton(label,handler,css=""){
 const button=makeElement("button",css,label);
 button.type="button";
 button.addEventListener("click",handler);
 return button;
}
function openCoreConcept(conceptId){
 showSideTab("core");
 const card=document.querySelector('.core-concept[data-concept-id="'+conceptId+'"]');
 if(!card)return;
 card.open=true;
 const summary=card.querySelector("summary");
 summary?.focus();
 card.scrollIntoView({block:"nearest",behavior:"auto"});
}
function quizSources(root,ids){
 const sources=makeElement("div","core-quiz-sources");
 sources.append(makeElement("strong",null,"원문 참고·앱 구현 근거 · 전문가 미감수"));
 for(const id of ids){
   const reference=CORE_QUIZ_SOURCES[id];
   if(!reference)continue;
   if(reference.scope==="internal"){
     const info=makeElement("span","core-quiz-internal-source",reference.label+" (외부 임상 문헌 아님)");
     sources.append(info);
   }else{
     const link=makeElement("a",null,reference.label);
     link.href=reference.url;
     link.target="_blank";
     link.rel="noopener noreferrer";
     sources.append(link);
   }
 }
 root.append(sources);
}
function renderCoreQuiz(){
 const root=document.getElementById("core-quiz-root");
 syncCoreQuizPanel();
 document.querySelectorAll(".core-return-button").forEach(button=>button.hidden=!coreQuizState);
 root.replaceChildren();
 root.append(makeElement("h3","core-quiz-heading","핵심 개념 학습 확인"));
 root.append(makeElement("p","core-quiz-scope","10문항 · 스스로 점검하는 형성평가 · 정답률은 임상 역량을 인증하지 않아. 답안은 이 페이지 메모리에만 남으며 새로고침 시 사라져."));
 if(coreQuizAudit.errors.length){
   root.append(makeElement("p","core-audit-error","문항 구조 검사 실패: "+coreQuizAudit.errors.join(" / ")));
   return;
 }
 if(!coreQuizState){
   root.append(makeElement("p","core-quiz-instruction","핵심 카드 6개를 읽은 다음 시작해. 한 문항씩 풀고 선택지별 근거를 확인한 뒤 오개념을 복습할 수 있어."));
   root.append(quizButton("10문항 학습 확인 시작",()=>{
     coreQuizState=startCoreQuiz();renderCoreQuiz();
     if(window.matchMedia("(min-width:1101px)").matches)document.querySelector(".workspace").scrollIntoView({block:"start",behavior:"auto"});
     root.querySelector(".core-quiz-answer")?.focus();
   },"core-quiz-primary"));
   return;
 }
 const score=scoreCoreQuiz(coreQuizState);
 if(coreQuizState.done){
   const categories=[{id:"app",name:"앱 동작 이해",questions:CORE_QUESTIONS.filter(q=>q.evidenceKind==="simulator-contract")},{id:"nursing",name:"간호 기초 개념",questions:CORE_QUESTIONS.filter(q=>q.evidenceKind!=="simulator-contract")}];
   const typeSummary=makeElement("section","core-quiz-type-summary");
   typeSummary.append(makeElement("h4",null,"학습 목적별 확인 · 임상 역량 점수 아님"));
   for(const group of categories){
     const ids=new Set(group.questions.map(q=>q.id));
     const correct=coreQuizState.answers.filter(a=>ids.has(a.questionId)&&a.correct).length;
     typeSummary.append(makeElement("p",null,group.name+": "+correct+"/"+group.questions.length+" · 형성 피드백"));
   }
   root.append(typeSummary);
   root.append(makeElement("p","core-quiz-score","완료 · "+score.correct+" / "+score.total+"문항 · 형성학습 참고 정보"));
   root.append(makeElement("p","core-quiz-instruction",score.reviewConcepts.length?"복습할 개념을 다시 확인하고 CASE에 적용해봐.":"모든 문항을 확인했어. CASE에 적용하며 관찰·보고 과정을 연습해봐."));
   if(score.reviewConcepts.length){
     const review=makeElement("section","core-quiz-review");
     review.append(makeElement("h4",null,"오개념 복습 · "+score.reviewConcepts.length+"개 주제"));
     for(const id of score.reviewConcepts){
       const lesson=CORE_LESSONS.find(x=>x.id===id);
       const questions=coreQuizState.answers.filter(a=>!a.correct&&CORE_QUESTIONS.find(q=>q.id===a.questionId)?.conceptId===id);
       const entry=makeElement("div","core-quiz-review-entry");
       entry.append(makeElement("strong",null,lesson.title+" · "+lesson.label));
       for(const answer of questions){
         const question=CORE_QUESTIONS.find(q=>q.id===answer.questionId);
         const choice=question.options.find(o=>o.id===answer.choiceId);
         entry.append(makeElement("p",null,choice?.misconception||"핵심 개념을 다시 확인해."));
       }
       entry.append(quizButton(lesson.title+" 카드 복습",()=>openCoreConcept(id),"core-quiz-secondary"));
       review.append(entry);
     }
     root.append(review);
   }else root.append(quizButton("6개 핵심 개념 다시 읽기",()=>openCoreConcept("peep"),"core-quiz-secondary"));
   root.append(quizButton("CASE 01~04에 적용하기 →",()=>{renderCase();showSideTab("case");caseTab.focus();},"core-quiz-primary"));
   root.append(quizButton("학습 확인 다시 풀기",()=>{coreQuizState=startCoreQuiz();renderCoreQuiz();root.querySelector(".core-quiz-answer")?.focus();},"core-quiz-secondary"));
   const preview=makeElement("details","core-quiz-instructor");
   preview.append(makeElement("summary",null,"교수자·개발자 검토 미리보기 · 정답 공개"));
   preview.append(makeElement("p","case-review-warning","정답·학습목표·오개념을 모두 공개하는 인증 없는 미리보기야. 임상 전문가 미감수 · 승인 없음 · 문항 버전 "+CORE_QUIZ_VERSION));
   for(const [i,q] of CORE_QUESTIONS.entries()){
     const group=makeElement("section","core-quiz-preview-item");
     const trace=CORE_REVIEW_GUIDE[q.id];
     group.append(makeElement("strong",null,(i+1)+". "+q.stem));
     group.append(makeElement("p",null,"학습목표: "+q.objective));
     group.append(makeElement("p",null,"정답: "+q.answer.toUpperCase()+" · "+q.options.find(o=>o.id===q.answer)?.label));
     for(const opt of q.options)group.append(makeElement("p",null,opt.id.toUpperCase()+". "+opt.feedback+(opt.misconception?" · 오개념: "+opt.misconception:"")));
     group.append(makeElement("p",null,"근거 성격: "+evidenceKindLabel(q.evidenceKind)));
     group.append(makeElement("p","core-quiz-evidence-note","근거의 해석 범위: "+trace.referenceNote));
     group.append(makeElement("p","core-quiz-review-prompt","교수자 확인 질문(미검토): "+trace.reviewPrompt));
     quizSources(group,q.sourceIds);
     preview.append(group);
   }
   root.append(preview);
   return;
 }
 const question=CORE_QUESTIONS[coreQuizState.index];
 const answered=coreQuizState.answers[coreQuizState.index];
 root.append(makeElement("p","core-quiz-progress","문항 "+(coreQuizState.index+1)+" / "+CORE_QUESTIONS.length+" · "+CORE_LESSONS.find(x=>x.id===question.conceptId).title));
 root.append(makeElement("p","core-quiz-kind",question.evidenceKind==="simulator-contract"?"구분: 앱 동작 이해 확인":"구분: 간호 기초 개념 이해 확인 (임상 수행평가 아님)"));
 const progress=makeElement("progress","core-quiz-meter");
 progress.max=CORE_QUESTIONS.length;progress.value=coreQuizState.index+(answered?1:0);
 progress.setAttribute("aria-label","학습 확인 완료 문항");
 root.append(progress);
 root.append(makeElement("h4","core-quiz-question",question.stem));
 const answers=makeElement("div","core-quiz-options");
 for(const choice of question.options){
   const answer=quizButton(choice.id.toUpperCase()+". "+choice.label,()=>{
     if(coreQuizState.answers.length!==coreQuizState.index)return;
     coreQuizState=chooseCoreAnswer(coreQuizState,choice.id);
     renderCoreQuiz();
     root.querySelector(".core-quiz-next")?.focus();
   },"core-quiz-answer");
   answer.disabled=Boolean(answered);
   if(answered&&answered.choiceId===choice.id){answer.classList.add("selected");answer.setAttribute("aria-pressed","true");}
   answers.append(answer);
 }
 root.append(answers);
 if(answered){
   const feedback=makeElement("section","core-quiz-feedback");
   feedback.setAttribute("role","status");
   feedback.append(makeElement("strong",null,answered.correct?"개념 확인":"오개념 복습"));
   feedback.append(makeElement("p",null,question.rationale));
   const notes=makeElement("ol","core-quiz-explanations");
   for(const choice of question.options){
     const entry=makeElement("li",null,choice.id.toUpperCase()+". "+choice.feedback);
     if(choice.misconception)entry.append(makeElement("span","core-quiz-misconception","오개념: "+choice.misconception));
     notes.append(entry);
   }
   feedback.append(notes);
   quizSources(feedback,question.sourceIds);
   root.append(feedback);
   root.append(quizButton("관련 핵심 카드 복습",()=>openCoreConcept(question.conceptId),"core-quiz-secondary"));
   root.append(quizButton(coreQuizState.index===CORE_QUESTIONS.length-1?"결과·오개념 복습 보기":"다음 문항 →",()=>{
     coreQuizState=advanceCoreQuiz(coreQuizState);renderCoreQuiz();
     (root.querySelector(".core-quiz-answer")||root.querySelector(".core-quiz-primary"))?.focus();
   },"core-quiz-next core-quiz-primary"));
 }else root.append(makeElement("p","core-quiz-instruction","답을 선택하면 선택지 전체의 간결한 해설과 근거가 나타나. 실제 시뮬레이터 수치는 변하지 않아."));
}

coreTab.addEventListener("click",()=>showSideTab("core"));
extraLearning.addEventListener("toggle",()=>{
  // When learners collapse advanced navigation, never strand them in a hidden-tab view.
  if(!extraLearning.open&&( !panelCircuit.hidden||!panelAlarm.hidden))showSideTab("core");
});

caseTab.addEventListener("click",()=>{renderCase();showSideTab("case");});

/* PB980 alarm vocabulary and device-readout literacy, independent of real or simulated
 * alarms; no threshold comparison, no time-based alarm state, and no patient intervention. */
let alarmLearningView="alarms";
let selectedAlarmLesson=null;
let displayTermCategory="all";
const alarmAnswers=new Map();
const alarmAudit=auditDeviceEducation();
function makeAlarmButton(label,handler,className=""){
  const button=makeElement("button",className,label);
  button.type="button";button.addEventListener("click",handler);
  return button;
}
function appendAlarmSources(container,keys){
  const box=makeElement("div","alarm-source-links");
  box.append(makeElement("strong",null,"원문 참고자료 · 의료지침/장비매뉴얼"));
  for(const key of keys){
    const source=DEVICE_EDUCATION_SOURCES[key];
    if(!source)continue;
    const anchor=makeElement("a",null,source.name);
    anchor.href=source.url;anchor.target="_blank";anchor.rel="noopener noreferrer";
    box.append(anchor);
  }
  container.append(box);
}
function renderDeviceTerms(root){
  root.append(makeElement("p","alarm-context","현재 앱에 표시되는 설정값 7종, 고정 모니터 예시 7종, 환기 모드 예시를 어떻게 구분하는지 연습해."));
  const filters=makeElement("div","alarm-term-filters");
  filters.setAttribute("role","group");filters.setAttribute("aria-label","장비 화면 용어 분류");
  for(const group of DISPLAY_CATEGORIES){
    const button=makeAlarmButton(group.label,()=>{displayTermCategory=group.id;renderAlarmLearning();root.querySelector('[data-term-category="'+group.id+'"]')?.focus();},"alarm-term-filter");
    button.dataset.termCategory=group.id;
    button.setAttribute("aria-pressed",String(displayTermCategory===group.id));
    filters.append(button);
  }
  root.append(filters);
  const terms=makeElement("div","alarm-term-list");
  for(const term of termsForCategory(displayTermCategory)){
    const section=makeElement("section","alarm-term-card");
    const heading=makeElement("h3",null,term.symbol);
    const label=makeElement("span","alarm-term-kind",({setting:"장비 설정",measured:"모니터 수치 · 이 앱에선 고정",mode:"환기 모드"})[term.category]);
    heading.append(label);section.append(heading);
    section.append(makeElement("p",null,term.meaning));
    section.append(makeElement("p","alarm-simulator-difference",term.simulator));
    terms.append(section);
  }
  root.append(terms);
  appendAlarmSources(root,["pb980","aarc"]);
}
function renderAlarmLesson(root,lesson){
  root.append(makeAlarmButton("← 알람 목록",()=>{selectedAlarmLesson=null;renderAlarmLearning();alarmTab.focus();},"alarm-return"));
  root.append(makeElement("h3","alarm-detail-title",lesson.title));
  root.append(makeElement("p","alarm-detail-subtitle",lesson.subtitle));
  const technical=makeElement("details","alarm-technical-details");
  technical.append(makeElement("summary",null,"추가 학습 · PB980 매뉴얼 용어와 적용 버전"));
  technical.append(makeElement("p","alarm-source-tag",lesson.manualSection));
  const meaning=makeElement("section","alarm-learning-section");
  meaning.append(makeElement("h4",null,"제조사 매뉴얼의 용어·의미"));
  meaning.append(makeElement("p",null,lesson.manufacturerMeaning));
  technical.append(meaning);
  technical.append(makeElement("p","alarm-version-note",DEVICE_VERSION_REVIEW.summary));
  root.append(technical);
  const context=makeElement("section","alarm-learning-section");
  context.append(makeElement("h4",null,"가상 학습 상황"));
  context.append(makeElement("p",null,lesson.observation));
  root.append(context);
  const focus=makeElement("section","alarm-learning-section");
  focus.append(makeElement("h4",null,"간호학생의 관찰·보고 학습 포인트"));
  const list=makeElement("ol","alarm-observation-list");
  for(const line of lesson.nursingFocus)list.append(makeElement("li",null,line));
  focus.append(list);root.append(focus);
  const question=makeElement("section","alarm-quiz");
  question.append(makeElement("h4",null,"학습 확인 · "+lesson.question));
  const saved=alarmAnswers.get(lesson.id);
  const choices=makeElement("div","alarm-choices");
  for(const choice of lesson.choices){
    const button=makeAlarmButton(choice.label,()=>{
      if(alarmAnswers.has(lesson.id))return;
      alarmAnswers.set(lesson.id,evaluateAlarmChoice(lesson.id,choice.id));
      renderAlarmLearning();
      root.querySelector(".alarm-feedback")?.focus();
    },"alarm-choice");
    if(saved){button.disabled=true;if(saved.choiceId===choice.id)button.classList.add("selected");}
    choices.append(button);
  }
  question.append(choices);
  if(saved){
    const feedback=makeElement("div","alarm-feedback");
    feedback.tabIndex=-1;
    feedback.append(makeElement("strong",null,saved.correct?"핵심 판단 확인":"다시 확인할 판단"));
    feedback.append(makeElement("p",null,saved.feedback));
    feedback.append(makeElement("p",null,saved.rationale));
    feedback.append(makeElement("p","alarm-limits",lesson.uncertainty));
    feedback.append(makeAlarmButton("이 알람 다시 풀기",()=>{alarmAnswers.delete(lesson.id);renderAlarmLearning();root.querySelector(".alarm-choice")?.focus();},"alarm-retry"));
    question.append(feedback);
  }else question.append(makeElement("p","alarm-quiz-hint","선택하면 정답 근거와 반응이 표시돼. 기기의 알람이나 환기 파형은 전혀 바뀌지 않아."));
  root.append(question);
  appendAlarmSources(root,lesson.sources);
}
function renderAlarmLearning(){
  const root=document.getElementById("alarm-learning-root");
  root.replaceChildren();
  if(alarmAudit.errors.length){
    root.append(makeElement("h3","alarm-error","장비 교육 데이터 검사 실패"));
    for(const error of alarmAudit.errors)root.append(makeElement("p","alarm-error",error));
    return;
  }
  const switches=makeElement("div","alarm-learning-modes");
  switches.setAttribute("role","group");switches.setAttribute("aria-label","ALARM 학습 방식");
  for(const item of [{id:"alarms",label:"알람 인지"},{id:"terms",label:"설정·모니터 용어"}]){
    const btn=makeAlarmButton(item.label,()=>{
      alarmLearningView=item.id;renderAlarmLearning();root.querySelector('[data-alarm-view="'+item.id+'"]')?.focus();
    },"alarm-view-switch");
    btn.dataset.alarmView=item.id;
    btn.setAttribute("aria-pressed",String(alarmLearningView===item.id));
    switches.append(btn);
  }
  root.append(switches);
  if(alarmLearningView==="terms"){renderDeviceTerms(root);return;}
  if(selectedAlarmLesson){
    const lesson=findAlarmLesson(selectedAlarmLesson);
    if(lesson){renderAlarmLesson(root,lesson);return;}
    selectedAlarmLesson=null;
  }
  root.append(makeElement("p","alarm-context","제조사 문서에 등장하는 4가지 알람의 의미와 학생의 관찰·보고 원칙을 학습해. 세부 알람 알고리즘·우선순위·경보음은 구현하지 않았어."));
  const variant=makeElement("details","alarm-version-details");
  variant.append(makeElement("summary",null,"추가 학습 · PB980 소프트웨어 버전별 차이"));
  variant.append(makeElement("p",null,DEVICE_VERSION_REVIEW.summary));
  variant.append(makeElement("p",null,DEVICE_VERSION_REVIEW.versionSpecificExample));
  const versions=makeElement("ul",null);
  for(const label of DEVICE_VERSION_REVIEW.examples)versions.append(makeElement("li",null,label));
  variant.append(versions);
  for(const link of DEVICE_VERSION_REVIEW.sourceLinks){
    const anchor=makeElement("a",null,link.label);
    anchor.href=link.url;anchor.target="_blank";anchor.rel="noopener noreferrer";
    variant.append(anchor);
  }
  root.append(variant);
  for(const lesson of ALARM_LESSONS){
    const card=makeElement("section","alarm-lesson-card");
    card.append(makeElement("h3",null,lesson.title));
    card.append(makeElement("p",null,lesson.subtitle));
    card.append(makeElement("p","alarm-source-tag",lesson.manualSection));
    if(alarmAnswers.has(lesson.id))card.append(makeElement("p","alarm-attempt-note","학습 확인 완료 · 정답 근거 다시 확인 가능"));
    card.append(makeAlarmButton("알람 이해하기",()=>{
      selectedAlarmLesson=lesson.id;renderAlarmLearning();root.querySelector(".alarm-return")?.focus();
    },"alarm-open"));
    root.append(card);
  }
  appendAlarmSources(root,["pb980","aarc"]);
}
alarmTab.addEventListener("click",()=>{renderAlarmLearning();showSideTab("alarm");});


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
initEducationUI();renderMonitor();renderSettings();initReadingUI();renderCircuit();renderCoreLearning();renderCoreQuiz();renderWaveLab();showSideTab("core");paintWaveforms();
requestAnimationFrame(animationFrame);
