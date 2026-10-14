/**
 * RAAS-inspired OPTIONAL nursing actions after existing knowledge questions.
 * These do not add scored questions or mutate any model, patient or device state.
 */
export const CASE_ACTION_EXERCISES=Object.freeze({
 "mas-neonate":{
  id:"mas-report",forStepId:"observe",
  prompt:"MAS 신생아의 SpO₂ 감소와 흉곽 움직임 변화에 관해 지도간호사에게 어떻게 보고할까?",
  options:[
   {id:"a",label:"MAS이므로 원인이 태변으로 확정되었다고 보고한다.",feedback:"병명 하나만으로 현재 악화 원인을 확정할 수 없어. 확인한 사실과 추정은 구별해야 해."},
   {id:"b",label:"SpO₂ 감소와 흉곽 움직임 변화를 객관적으로 말하고, 환아 상태·측정 신호·기도·회로 확인 및 즉각적인 도움을 요청한다.",feedback:"맞아. 관찰한 객관적 변화와 아직 확인되지 않은 문제를 구분하여 신속하게 도움을 요청하는 연습이야."},
   {id:"c",label:"원래 PB980 화면의 VTE 352 mL가 정상이라며 관찰을 종료한다.",feedback:"참고 장비의 고정 모니터 숫자는 이 신생아 자료가 아니므로 환자에게 적용할 수 없어."}
  ],
  answer:"b",
  rationale:"저산소화 악화 의심 시 응급 사정을 미루지 않고 현장 환아·신호·인공기도·회로 상태를 확인하며 즉시 도움을 요청해. 검사 해석만으로 원인을 확정하지 않아.",
  assessment:"환아 호흡·관류 상태, SpO₂ 신호, 인공기도 위치·개방성, 회로와 확인된 과거 ABGA의 시점을 구분한다.",
  escalation:"확인한 변화와 아직 모르는 사항을 지도자·의료진에게 신속히 보고한다.",
  learning:"검사 수치의 검체·채혈 시점, PaCO₂와 PaO₂의 역할을 복습한다.",
  reviewConceptIds:["blood-gas","patient"],
  evidenceNote:"AARC 환자-인공호흡기 사정 및 MAS 학습에서 간호학생의 관찰·보고 중심 행동으로 구성.",
  sourceIds:["aarc","merck_mas"]
 },
 "rsv-infant":{
  id:"rsv-airway-report",forStepId:"airway",
  prompt:"RSV 영아의 분비물 증가·호흡 상태 변화에 대한 적절한 간호 행동은?",
  options:[
   {id:"a",label:"환아 상태를 보지 않고 매시간 흡인을 반드시 시행한다.",feedback:"AARC는 정시 반복보다 필요에 따른 흡인을 강조해. 의료진 판단과 환아 상태가 먼저야."},
   {id:"b",label:"환아·호흡음·인공기도·회로 상태를 확인하고 필요 시 지도자에게 즉시 보고하여 흡인 적응증을 함께 판단한다.",feedback:"맞아. 기도 개방성·환아 상태·분비물 징후를 종합하고 의료진과 협력하는 행동이 중요해."},
   {id:"c",label:"CBG의 PO₂가 기록되지 않았다는 이유만으로 산소화를 정상으로 판단한다.",feedback:"CBG PO₂는 동맥 산소화 판단에 한계가 있어. 환아 직접 사정과 SpO₂ 신호를 함께 확인해야 해."}
  ],
  answer:"b",
  rationale:"학생이 기도를 독자적으로 흡인하거나 기계환기 설정을 변경하지 않아. 환자의 악화 신호와 기도·회로를 확인하고 실제 의료진 판단으로 연결해야 해.",
  assessment:"분비물·호흡음·흉곽 움직임·SpO₂ 신뢰도 및 기관삽관 상태·회로를 확인한다.",
  escalation:"원인 미확정과 확인한 관찰 사실을 나누어 지도자·의료진에게 공유한다.",
  learning:"CBG PCO₂와 PaO₂ 차이, 필요에 따른 인공기도 흡인의 뜻을 복습한다.",
  reviewConceptIds:["patient","blood-gas"],
  evidenceNote:"NICE 세기관지염 악화 인지와 AARC 2022 필요 기반 인공기도 흡인 원칙을 교육적 행동 연습에 적용.",
  sourceIds:["aarc","suction","aarc_cbg"]
 }
});
const ALLOWED_REVIEW_CONCEPTS=new Set(["patient","blood-gas","peep","fio2","rate","vte","ppeak"]);
export function auditCaseAction(step,scenario,sources){
 const x=step.actionExercise;
 if(x===undefined)return [];
 const errors=[],bad=(path,reason)=>errors.push({path,reason});
 if(!x||typeof x.prompt!=="string"||x.prompt.length<20||x.forStepId!==step.id) return [{path:"actionExercise",reason:"간호 행동 문항 누락/연결 오류"}];
 if(!Array.isArray(x.options)||x.options.length!==3||new Set(x.options.map(y=>y.id)).size!==3||x.options.some(y=>!y.label||!y.feedback||y.feedback.length<15))bad("actionExercise.options","간호 행동 선지/해설 누락");
 if(x.options?.filter(y=>y.id===x.answer).length!==1)bad("actionExercise.answer","간호 행동 정답 참조 오류");
 for(const field of ["rationale","assessment","escalation","learning","evidenceNote"])if(typeof x[field]!=="string"||x[field].length<20)bad("actionExercise."+field,"판단 근거·사정·보고 누락");
 if(!Array.isArray(x.reviewConceptIds)||!x.reviewConceptIds.length||x.reviewConceptIds.some(y=>!ALLOWED_REVIEW_CONCEPTS.has(y)))bad("actionExercise.reviewConceptIds","연결 학습 주제 누락");
 if(!Array.isArray(x.sourceIds)||!x.sourceIds.length||x.sourceIds.some(id=>!sources[id]||!scenario.sources.includes(id)))bad("actionExercise.sourceIds","시나리오와 근거 참조 불일치");
 return errors;
}
