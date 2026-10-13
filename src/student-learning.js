/** Student-first curriculum: source-aware core concepts, no patient physiology model.
 * All "monitor" entries are fictional static samples from sim-model.js.
 */
import {PARAMETERS,MONITOR_REFERENCE} from "./sim-model.js";
export const ESSENTIAL_SETTING_IDS=Object.freeze(["fio2","peep","rate"]);
export const ADVANCED_SETTING_IDS=Object.freeze(["pi","ti","ps","trigger"]);
export const CORE_LESSONS=Object.freeze([
 {id:"peep",title:"PEEP",label:"호기말 양압",kind:"setting",
  key:"호기 끝에도 유지되는 압력",meaning:"호기말 양압은 폐포 허탈을 줄여 산소화에 도움을 줄 수 있어.",
  observe:"PEEP 변화와 함께 SpO₂ 추세, 혈압, 호흡 양상을 관찰해.",
  caution:"PEEP를 무조건 높이는 것은 안전하지 않아. 과도하면 과팽창·혈역학적 부담이 생길 수 있어.",
  simulator:"하단 PEEP 설정은 예시 압력 파형만 바꿔. 실제 산소화나 혈압은 계산하지 않아.",
  reference:["aarc","merck"]},
 {id:"fio2",title:"FiO₂",label:"흡입 산소 농도",kind:"setting",
  key:"환자에게 제공하는 산소의 비율",meaning:"FiO₂ 40%는 공급하는 혼합가스의 산소 비율이 40%라는 뜻이야.",
  observe:"환자 산소화는 SpO₂ 추세·임상 상태·필요 시 ABGA 자료로 별도로 확인해.",
  caution:"설정된 FiO₂만으로 SpO₂나 PaO₂를 알 수 없어.",
  simulator:"FiO₂ 버튼을 바꿔도 상단 값은 고정이고 SpO₂ 계산 기능도 없어.",
  reference:["aarc","merck"]},
 {id:"vte",title:"VTE",label:"호기 일회호흡량",kind:"monitor",
  key:"한 번의 호기에서 나온 가스 용적",meaning:"VTE는 설정된 용적이 아니라 환기 결과를 평가할 때 쓰는 측정 지표의 이름이야.",
  observe:"실제 환자에서는 목표 용적, 예측체중(PBW), 호흡 노력·누출 여부 등과 함께 평가해.",
  caution:"압력제어(PC) 모드에서 설정 압력만으로 실제 VTE를 확정할 수 없어.",
  simulator:"상단 VTE 352 mL는 예시 숫자일 뿐 실제 환자 측정값이 아니야.",
  reference:["aarc","pb980"]},
 {id:"rate",title:"f / fTOT",label:"설정 호흡수와 총 호흡수",kind:"setting-monitor",
  key:"기계가 정한 빈도와 실제 총 빈도의 차이",meaning:"SIMV에서 f는 강제호흡 설정 빈도, fTOT는 자발호흡을 포함한 전체 호흡수의 표시야.",
  observe:"호흡수 추세와 호흡 노력, 일회호흡량·환기 상태를 함께 관찰해.",
  caution:"호흡수가 크다고 항상 적절히 환기된다는 뜻은 아니야.",
  simulator:"f는 파형 간격에 반영되지만 fTOT 22/min은 고정 예시야.",
  reference:["aarc","pb980"]},
 {id:"ppeak",title:"Ppeak",label:"최고 기도압",kind:"monitor",
  key:"흡기 중 관찰되는 가장 높은 기도압",meaning:"Ppeak는 측정 용어이고 Pᵢ는 설정 용어야. 두 가지를 동일시하지 않아.",
  observe:"실제 환자에서는 압력 변화와 환자 호흡 양상·회로·기도 상태를 함께 확인해.",
  caution:"Ppeak 하나만 보고 분비물, 기도 저항 또는 순응도 문제를 확정할 수 없어.",
  simulator:"상단 PPEAK 15 cmH₂O는 파형이나 설정과 무관한 고정 예시야.",
  reference:["aarc","pb980"]},
 {id:"patient",title:"환자 우선 사정",label:"관찰하고 보고하기",kind:"observation",
  key:"모니터 숫자보다 환자의 상태가 먼저",meaning:"호흡 노력·흉곽 움직임·산소화 추세·기도 및 회로 상태를 같이 살펴야 해.",
  observe:"평소와 다른 호흡 상태나 급격한 악화가 있으면 즉시 지도자·담당 의료진에게 알려.",
  caution:"실습학생이 독자적으로 기기 설정을 변경하는 행동을 정답으로 삼지 않아.",
  simulator:"앱의 CASE/ALARM은 가상상황이어서 실제 기기나 환자의 변화를 발생시키지 않아.",
  reference:["aarc"]}
]);
/** Optional novice scaffolding; does not change assessment keys or simulator data. */
export const CORE_LESSON_EXTRAS=Object.freeze({
 peep:{principle:"호기 말 압력이 유지되면 일부 폐포 허탈을 줄이는 데 도움이 될 수 있지만, 효과와 위험은 환자의 폐·순환 상태에 따라 달라져.",example:"PEEP 5 cmH₂O는 호기 끝 압력을 설정한 예시야. 이 값만으로 SpO₂나 혈압을 예측하지 않아.",advanced:"Auto-PEEP는 충분히 호기하지 못해 폐에 남는 내인성 호기말 압력이야. 설정 PEEP와 같지 않아."},
 fio2:{principle:"산소 공급 비율을 설정한 것이며, 실제 혈액의 산소화 결과는 가스교환 상태에 따라 달라져.",example:"FiO₂ 40%는 혼합가스 산소 비율 0.40이지, SpO₂ 40%나 PaO₂ 40 mmHg가 아니야.",advanced:"ABGA(동맥혈가스분석)는 pH·PaO₂·PaCO₂ 등을 별도 측정해. FiO₂ 수치만으로 이 검사 결과를 계산할 수 없어."},
 vte:{principle:"호기에서 나온 용적을 살피는 지표로, 압력 설정만이 아니라 환자 호흡역학·노력·누출에 영향을 받아.",example:"상단 VTE 352 mL는 화면읽기를 위한 독립적인 고정 숫자야. 설정 변경 뒤 측정된 결과가 아니야.",advanced:"PBW(predicted body weight, 예측체중)는 키 등을 토대로 산정해 호흡량의 평가 맥락에 활용해. 이 앱에는 PBW 계산 기능이 없어."},
 rate:{principle:"SIMV의 설정 f는 강제호흡 빈도를 뜻하고, 총 호흡수 fTOT에는 자발호흡이 포함될 수 있어.",example:"설정 f 15/min과 고정 표시 fTOT 22/min은 다른 개념이야. 이 앱에서는 둘을 실제 환자 데이터로 연결하지 않아.",advanced:"호흡수 단독으로 호흡 깊이·환기 효율·호흡노력을 단정할 수 없어. 다른 지표와 환자 상태를 함께 관찰해."},
 ppeak:{principle:"Pᵢ는 이 앱에서 PEEP 위의 흡기압 설정을 뜻하고 Ppeak는 관찰하는 최대 기도압을 뜻해.",example:"Pᵢ 10 cmH₂O를 입력해도 상단 PPEAK 15 cmH₂O는 변하지 않아. 실제 측정치를 산출하지 않아.",advanced:"Pplat(plateau pressure, 고원압)은 적절한 조건에서 흡기 말 유량이 멈춘 상황의 압력 개념이야. Ppeak와 같지 않고 이 앱은 측정하지 않아."},
 patient:{principle:"모니터 숫자와 함께 환자의 호흡 노력, 흉곽 움직임 등 직접 관찰을 통합해야 해.",example:"호흡곤란이 의심되면 상태를 관찰하고 지도자와 담당 의료진에게 신속히 알려야 해.",advanced:"학생의 수행 범위는 기관 지침과 실습 지도에 따라 달라. 이 앱은 독자적 환기 설정 변경을 허용하는 근거가 아니야."}
});
export const STUDENT_GLOSSARY=Object.freeze([
 {term:"PBW",text:"Predicted Body Weight · 예측체중. 키 등을 바탕으로 산정하며 일회호흡량 평가에 활용하는 지표."},
 {term:"Pplat",text:"Plateau Pressure · 고원압. 특정 조건에서 확인하는 압력으로 Ppeak와 구별해."},
 {term:"auto-PEEP",text:"내인성 호기말 양압. 호기가 충분하지 않을 때 폐에 남을 수 있는 압력으로 설정 PEEP와 구별해."},
 {term:"ABGA",text:"Arterial Blood Gas Analysis · 동맥혈가스분석. pH·PaO₂·PaCO₂ 등의 측정 결과를 확인해."},
 {term:"V-TRIG",text:"Flow Trigger · 유량 트리거. 환자 흡기 노력에 따른 장비 반응과 관련된 설정."},
 {term:"SpO₂ / PaO₂",text:"SpO₂는 산소포화도 추정치(%), PaO₂는 동맥혈 산소분압(mmHg)으로 측정과 단위가 달라."}
]);
export const CORE_SOURCES=Object.freeze({
 aarc:{label:"AARC 환자–인공호흡기 사정 임상진료지침 (2024)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/"},
 merck:{label:"Merck Manual Professional · Overview of Mechanical Ventilation",url:"https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/overview-of-mechanical-ventilation"},
 pb980:{label:"Medtronic · PB980 Operator's Manual (기기 표기)",url:"https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf"}
});
export function auditCoreLearning(){
 const problems=[],all=PARAMETERS.map(p=>p.id);
 if(ESSENTIAL_SETTING_IDS.some(id=>!all.includes(id)))problems.push("missing core setting");
 if(ADVANCED_SETTING_IDS.some(id=>!all.includes(id)))problems.push("missing supplementary setting");
 if(new Set([...ESSENTIAL_SETTING_IDS,...ADVANCED_SETTING_IDS]).size!==all.length)problems.push("setting tier overlap/gap");
 if(MONITOR_REFERENCE.length!==7)problems.push("monitor reference drift");
 if(new Set(CORE_LESSONS.map(l=>l.id)).size!==CORE_LESSONS.length)problems.push("duplicate core lessons");
 for(const l of CORE_LESSONS){
  if(!l.title||!l.key||!l.meaning||!l.observe||!l.caution||!l.simulator||!l.reference.length)problems.push("incomplete core concept: "+l.id);
  for(const ref of l.reference)if(!CORE_SOURCES[ref]?.url.startsWith("https://"))problems.push("missing source: "+l.id);
 }
 return {problems,coreCount:CORE_LESSONS.length,coreSettingCount:ESSENTIAL_SETTING_IDS.length,supplementarySettingCount:ADVANCED_SETTING_IDS.length};
}
