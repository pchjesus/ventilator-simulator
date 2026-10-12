/**
 * PB980 manual-grounded terminology RECOGNITION teaching, not an alarm engine.
 * This module never reads/measures patient data or calculates alarm thresholds.
 * Facts verified against PB980 Operator Manual ch. 6, especially Table 6-5.
 * Individual priorities/trigger windows vary with event; intentionally not reproduced.
 */
import {PARAMETERS,MONITOR_REFERENCE} from "./sim-model.js";
export const DEVICE_EDUCATION_SOURCES=Object.freeze({
  pb980:{name:"Medtronic · Puritan Bennett 980 Operator's Manual, ch. 6 / Table 6-5",url:"https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf"},
  aarc:{name:"AARC · Patient–Ventilator Assessment (2024)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/"}
});
/** Documentation release review; installed ICU firmware/version remains UNKNOWN.
 * These are catalog version labels, not assertions of installed features.
 */
export const DEVICE_VERSION_REVIEW=Object.freeze({
 status:"local-version-unconfirmed",
 summary:"병원 PB980의 실제 소프트웨어 버전·옵션 구성이 확인되지 않았어. 화면·알람 세부 동작이 동일하다고 가정하지 않아.",
 examples:["제조사 매뉴얼: 7.6.1.0 이상","제조사 매뉴얼: 8.0.9.0 이상","제조사 매뉴얼: 8.1.0.46 이상","제조사 매뉴얼: 8.2.0.54 이상"],
 versionSpecificExample:"Medtronic은 High PEEP Alarm 설정 안내에 소프트웨어 8.4.4.3 이상 조건을 명시해. 이 앱은 해당 제어 기능을 구현하지 않아.",
 sourceLinks:[
  {label:"Medtronic 공식 PB980 버전별 매뉴얼 목록",url:"https://www.medtronic.com/covidien/it-it/support/product-manuals.html"},
  {label:"Medtronic PB980 제품·버전별 기능 안내",url:"https://www.medtronic.com/en-us/healthcare-professionals/products/respiratory/mechanical-ventilation/ventilators/puritan-bennett-980-series-ventilator.html"}
 ]
});
export const DISPLAY_CATEGORIES=Object.freeze([
  {id:"all",label:"전체"},
  {id:"setting",label:"설정값"},
  {id:"measured",label:"모니터 예시"},
  {id:"mode",label:"환기 모드"}
]);
const settingText={
 fio2:["FiO₂","설정된 공급 산소 농도. SpO₂·PaO₂를 직접 계산하지 않는다."],
 peep:["PEEP","호기말 기도압 설정. 실제 측정 PEEP와 구분한다."],
 rate:["f","설정된 강제호흡 빈도. 총 호흡수 fTOT와 구분한다."],
 pi:["Pᵢ","PC 흡기압 설정. 실제 최고기도압 PPEAK와 구분한다."],
 ti:["Tᵢ","강제호흡 흡기 시간 설정. 실제 I:E 및 호흡 상태는 별도 자료다."],
 ps:["PS","자발호흡 압력보조 설정. 발생한 일회호흡량을 보장하지 않는다."],
 trigger:["V-TRIG","자발 흡기 노력을 감지하는 유량 감도 설정."]
};
const monitorText={
 PPEAK:"한 번 호흡에서 관찰되는 최고 기도압의 표기",
 PMEAN:"평균 기도압의 표기",
 PEEP:"모니터에 측정된 호기말 양압의 표기",
 "I:E":"흡기와 호기 시간 비율의 표기",
 fTOT:"실제 관찰된 전체 호흡수의 표기",
 VTE:"호기 일회호흡량의 표기",
 "V̇E TOT":"호기 분당환기량의 표기"
};
export const DISPLAY_TERMS=Object.freeze([
 ...PARAMETERS.map(p=>({
   id:"setting:"+p.id,category:"setting",symbol:settingText[p.id][0],
   title:p.label,meaning:settingText[p.id][1],
   simulator:"이 앱의 설정 카드: 값 변경은 교육용 파형의 일부에만 영향을 줄 수 있음",
   reference:["pb980","aarc"]
 })),
 ...MONITOR_REFERENCE.map(([name,value,unit])=>({
   id:"measured:"+name,category:"measured",symbol:name,
   title:monitorText[name],meaning:monitorText[name],
   simulator:"이 앱의 상단 숫자 "+value+(unit?" "+unit:"")+"은 고정 그림용 예시이며 실제 측정·파형과 연동되지 않음",
   reference:["pb980","aarc"]
 })),
 {id:"mode:simv",category:"mode",symbol:"SIMV (PC) + PS",
  title:"강제호흡·자발호흡 혼합 구성",
  meaning:"SIMV, PC 및 PS는 장비 설정 구조를 설명하는 용어이며, 실제 환자 모드 전환을 제공하는 앱은 아님.",
  simulator:"이 앱의 모드 표시는 변경할 수 없는 교육용 화면 구성 예시",
  reference:["pb980"]}
]);
export function termsForCategory(category="all"){
  if(category==="all")return DISPLAY_TERMS;
  if(!DISPLAY_CATEGORIES.some(c=>c.id===category))return [];
  return DISPLAY_TERMS.filter(t=>t.category===category);
}
export const ALARM_LESSONS=Object.freeze([
  {
    id:"disconnect",title:"CIRCUIT DISCONNECT",subtitle:"회로 연결 이탈 인지",
    manualSection:"PB980 Operator's Manual Table 6-5 · 인쇄 페이지 6-17",
    manufacturerMeaning:"장비가 환자 호흡회로의 이탈을 감지하면 나타나는 알람 명칭이다. 해당 매뉴얼은 환자 확인과 회로 재연결을 안내한다.",
    observation:"가상 상황: 회로 연결 이상을 의심할 단서가 있고 환자에게 전달되는 환기가 불충분할 수 있다. 앱에서는 실제 연결 상태가 변하지 않는다.",
    nursingFocus:["먼저 환자 상태·호흡 양상과 환기 가능 여부를 즉시 확인한다.","즉시 지도자·담당 의료진에게 알리고 기관의 환기 장애 대응 절차를 따른다.","인공기도·회로 연결 상태는 지도자와 함께 점검한다."],
    uncertainty:"환기 회로/장비 구성·알람 상세 표시는 기관과 장비 소프트웨어 상태에 따라 다르다.",
    question:"이 알람을 학습하는 실습학생에게 가장 적절한 우선순위는?",
    choices:[
      {id:"a",label:"알람 음소거만 하고 상태 변화가 있는지 기다린다.",feedback:"환기 장애 가능성을 무시할 수 있어. 알람을 끄는 것으로 환자 문제가 해결되지 않아."},
      {id:"b",label:"환자를 즉시 살피고 지도자에게 알리면서 회로·인공기도 상태 확인에 협력한다.",feedback:"맞아. 환자 우선 사정과 도움 요청을 먼저 두고, 실제 조작은 현장 지침과 감독을 따라야 해."},
      {id:"c",label:"실습학생이 임의로 환기 모드와 설정을 바꿔본다.",feedback:"무감독 설정 변경으로 환기 문제를 해결한다고 가정하면 위험해."}
    ],answer:"b",rationale:"제조사 매뉴얼 Table 6-5는 환자 확인과 회로 연결 확인을 명시한다. AARC의 포괄적 환자–인공호흡기 사정과 결합해 관찰·즉시 보고를 학습한다.",sources:["pb980","aarc"]
  },
  {
    id:"pressure",title:"HIGH CIRCUIT PRESSURE (↑PPEAK)",subtitle:"높은 기도압 알람 인지",
    manualSection:"PB980 Operator's Manual Table 6-5 · 인쇄 페이지 6-17",
    manufacturerMeaning:"측정된 기도압이 설정된 최고압 제한에 도달할 때 나타날 수 있는 알람이다. 매뉴얼은 환자, 회로, 기관내관을 확인하도록 설명한다.",
    observation:"가상 상황: 높은 압력 알람이 화면에 나타났다고 가정한다. 기도 내 분비물·회로·환자 움직임 등 가능한 원인을 이 숫자 하나로 단정하지 않는다.",
    nursingFocus:["먼저 환자 호흡 양상·산소화 등 현재 상태를 관찰하고 즉시 보고한다.","지도자와 함께 회로·기관내관 관련 단서를 확인한다.","압력 경보 상한 자체를 무작정 조절하지 않는다."],
    uncertainty:"PB980 알람의 단계·발생 횟수 기준은 매뉴얼에 따로 정의돼 있으며 본 앱은 그 알고리즘을 구현하지 않는다.",
    question:"HIGH CIRCUIT PRESSURE가 표시되었다는 가상 상황에서 옳은 해석은?",
    choices:[
      {id:"a",label:"압력 수치만으로 기도 분비물이 유일한 원인이라고 확정한다.",feedback:"원인은 다양하므로 단일 알람만으로 특정 원인을 단정할 수 없어."},
      {id:"b",label:"장비 경보 상한을 먼저 높이면 원인 확인을 대신할 수 있다.",feedback:"경보 설정만 바꿔서는 환자 안전과 원인 평가를 보장하지 못해."},
      {id:"c",label:"환자 상태를 우선 확인하고, 회로·인공기도 문제 가능성을 지도자와 함께 평가한다.",feedback:"맞아. 제조사 매뉴얼의 확인 항목과 환자 중심 사정 원칙을 함께 고려한 선택이야."}
    ],answer:"c",rationale:"Table 6-5는 환자·회로·기관내관 확인을 권고한다. 해당 알람이 항상 같은 원인을 뜻하지 않는 점을 분명히 해야 한다.",sources:["pb980","aarc"]
  },
  {
    id:"minute-volume",title:"LOW EXHALED MINUTE VOLUME (↓V̇E TOT)",subtitle:"낮은 호기 분당환기량 인지",
    manualSection:"PB980 Operator's Manual Table 6-5 · 인쇄 페이지 6-24",
    manufacturerMeaning:"측정 호기 분당환기량이 설정된 낮은 경보 한계에 도달하거나 이하로 관찰될 때 나타날 수 있는 알람이다. 매뉴얼은 환자와 설정 확인을 안내한다.",
    observation:"가상 상황: 호기 분당환기량 감소 경보가 표시됐다. 파형·환자 호흡노력·누출 가능성을 실제 관찰 없이 결론 내리지 않는다.",
    nursingFocus:["환자 상태와 환기 관련 변화 징후를 살피고 담당자에게 보고한다.","실제 측정값·경향, 설정값, 환자·기도·회로 상태를 구분해 함께 확인한다.","앱의 고정 V̇E TOT 숫자로 알람을 계산하거나 발생시키지 않는다."],
    uncertainty:"실제 알람에는 시간 지속 조건과 우선순위 변화가 있으나, 앱은 이를 계산하거나 소리로 알리지 않는다.",
    question:"LOW EXHALED MINUTE VOLUME 학습에서 가장 타당한 설명은?",
    choices:[
      {id:"a",label:"분당환기량이 낮게 표시되어도 환자 평가는 필요 없다.",feedback:"호흡·환기 관련 변화는 환자와 측정 장비를 함께 살펴야 해."},
      {id:"b",label:"실제 측정값·환자 호흡 상태·회로를 종합해 확인하고 지도자에게 보고한다.",feedback:"맞아. 알람 원인을 단정하지 않고 환자 중심으로 정보를 확인해."},
      {id:"c",label:"이 웹앱 상단 고정 예시 숫자가 자동으로 경보를 만들고 있으니 확인을 생략해도 된다.",feedback:"현재 웹앱의 상단 모니터는 고정 참고 숫자라서 경보와 연결되지 않아."}
    ],answer:"b",rationale:"PB980 Table 6-5는 낮은 호기 분당환기량 알람의 환자·설정 점검을 제시하며 AARC는 침상 직접 사정을 강조한다.",sources:["pb980","aarc"]
  },
  {
    id:"apnea",title:"APNEA",subtitle:"무호흡 감지 알람 인지",
    manualSection:"PB980 Operator's Manual Table 6-5 · 인쇄 페이지 6-16~17",
    manufacturerMeaning:"설정된 무호흡 간격 동안 장비·환자·사용자에 의해 호흡이 시작되지 않으면 나타날 수 있는 알람이다. 매뉴얼은 환자와 설정 확인을 안내한다.",
    observation:"가상 상황: APNEA라는 장비 알람 명칭을 보았다고 가정한다. 앱은 무호흡 타이머·백업환기·실제 무호흡을 시뮬레이션하지 않는다.",
    nursingFocus:["즉시 환자 호흡 상태와 호흡노력 및 산소화를 확인한다.","지도자·담당 의료진의 즉각적 평가와 기관 응급 절차에 따라 대응한다.","무호흡 백업환기 구현 여부를 현재 화면에서 추정하지 않는다."],
    uncertainty:"장비의 무호흡 환기·경보 우선순위·발생 기준은 개별 설정과 조건에 따라 달라진다.",
    question:"APNEA 알람을 처음 인지한 학생의 안전한 학습 목표는?",
    choices:[
      {id:"a",label:"환자 호흡 상태를 신속히 확인하고 지도자·의료진에게 즉시 알린다.",feedback:"맞아. 인지·환자 사정·보고를 우선하고 실제 기기 조작은 감독과 병원 지침을 따라야 해."},
      {id:"b",label:"무호흡이므로 모든 상황에서 동일한 설정값으로 변경한다.",feedback:"환자 정보와 현재 장비 상황에 대한 확인 없이 설정을 획일적으로 변경할 수 없어."},
      {id:"c",label:"알람을 해제한 뒤 다음 근무자에게 전달한다.",feedback:"환자 호흡 문제는 즉시 평가와 도움 요청이 필요해."}
    ],answer:"a",rationale:"Table 6-5는 무호흡 간격 조건과 환자·설정 확인을 제시한다. 앱에서는 임상 알고리즘이 아닌 학생의 인지와 보고 태도만 연습한다.",sources:["pb980","aarc"]
  }
]);
export function findAlarmLesson(id){return ALARM_LESSONS.find(x=>x.id===id)||null;}
export function evaluateAlarmChoice(lessonId,choiceId){
 const lesson=findAlarmLesson(lessonId);
 if(!lesson)throw new RangeError("Unknown educational alarm");
 const choice=lesson.choices.find(x=>x.id===choiceId);
 if(!choice)throw new RangeError("Unknown choice");
 return Object.freeze({lessonId,choiceId,correct:choiceId===lesson.answer,feedback:choice.feedback,rationale:lesson.rationale});
}
export function auditDeviceEducation(){
 const errors=[];
 const settingIds=PARAMETERS.map(x=>x.id).sort();
 const refIds=DISPLAY_TERMS.filter(x=>x.category==="setting").map(x=>x.id.slice(8)).sort();
 if(JSON.stringify(settingIds)!==JSON.stringify(refIds))errors.push("setting term coverage mismatch");
 const monitorIds=MONITOR_REFERENCE.map(([name])=>name).sort();
 const renderIds=DISPLAY_TERMS.filter(x=>x.category==="measured").map(x=>x.id.slice(9)).sort();
 if(JSON.stringify(monitorIds)!==JSON.stringify(renderIds))errors.push("monitor term coverage mismatch");
 if(new Set(DISPLAY_TERMS.map(x=>x.id)).size!==DISPLAY_TERMS.length)errors.push("duplicate display term");
 if(new Set(ALARM_LESSONS.map(x=>x.id)).size!==ALARM_LESSONS.length)errors.push("duplicate alarm");
 for(const l of ALARM_LESSONS){
  if(!l.manualSection||!l.manufacturerMeaning||!l.observation||!l.nursingFocus?.length||!l.uncertainty||!l.rationale)errors.push("missing educational alarm content: "+l.id);
  if(l.choices?.length!==3||l.choices.filter(c=>c.id===l.answer).length!==1)errors.push("invalid answer choices: "+l.id);
  if(l.sources.some(k=>!DEVICE_EDUCATION_SOURCES[k]?.url.startsWith("https://")))errors.push("invalid source link: "+l.id);
 }
 return {errors,termCount:DISPLAY_TERMS.length,alarmCount:ALARM_LESSONS.length};
}
