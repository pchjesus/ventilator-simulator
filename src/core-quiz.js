/** v0.4.2: formative core-concept check only.
 * This bank neither reads nor updates simulator, monitor, waveform or CASE state.
 * Expert review pending: content validation is not clinical certification.
 */
import {CORE_LESSONS,CORE_SOURCES} from "./student-learning.js";

export const CORE_QUIZ_VERSION="0.4.2";
export const CORE_QUIZ_SOURCES=Object.freeze({...CORE_SOURCES,app:{label:"앱 내부 구현 규약 · README",url:"https://github.com/pchjesus/ventilator-simulator/blob/main/README.md"}});
export const CORE_QUIZ_REVIEW=Object.freeze({status:"pending",approved:false});
const option=(id,label,feedback,misconception="")=>({id,label,feedback,misconception});
export const CORE_QUESTIONS=Object.freeze([
 {id:"peep-meaning",conceptId:"peep",objective:"PEEP의 정의와 산소화에 미치는 가능성을 설명한다.",
  stem:"호기말 양압(PEEP)에 대한 설명으로 가장 적절한 것은?",
  options:[option("a","호기가 끝날 때도 양압을 유지하여 폐포 허탈을 줄이는 데 도움을 줄 수 있다.","맞아. PEEP는 호기말 양압이며 산소화에 도움이 될 수 있어."),
   option("b","산소포화도를 직접 측정하는 모니터 수치다.","PEEP는 압력 설정·측정 관련 용어이고 SpO₂는 산소포화도 측정값이야.","설정 압력과 산소화 측정값 혼동"),
   option("c","모든 환자에서 높일수록 산소화와 순환이 반드시 좋아진다.","PEEP 반응은 환자마다 다르며 지나치면 과팽창·혈역학적 부담이 생길 수 있어.","PEEP 상승의 무조건적 이득 가정")],
  answer:"a",rationale:"호기말 양압은 폐포 허탈 감소에 기여할 수 있지만 산소화 개선이 보장되지는 않아.",sourceIds:["aarc","merck"],evidenceKind:"educational-inference"},
 {id:"peep-circulation",conceptId:"peep",objective:"PEEP 변화 시 산소화뿐 아니라 혈역학을 함께 관찰한다.",
  stem:"PEEP 설정이 바뀐 상황에서 간호학생이 함께 관찰할 항목은?",
  options:[option("a","SpO₂ 추세만 보면 충분하다.","산소화와 함께 혈압·호흡 상태 등도 살펴야 해.","단일 모니터 지표에 의존"),
   option("b","SpO₂와 혈압, 환자의 호흡 양상 변화를 함께 관찰한다.","맞아. 산소화뿐 아니라 혈역학적 영향과 환자 상태를 함께 사정해."),
   option("c","PEEP 수치가 올랐으므로 혈압은 반드시 상승할 것이다.","PEEP의 혈역학적 영향은 환자 상태에 따라 달라지며 혈압 상승을 단정할 수 없어.","기계 설정값으로 혈압 변화 확정")],
  answer:"b",rationale:"PEEP 변화 뒤 산소화·혈압·임상 상태를 함께 살피는 것이 교육적 관찰의 핵심이야.",sourceIds:["aarc","merck"],evidenceKind:"educational-inference"},
 {id:"fio2-setting",conceptId:"fio2",objective:"FiO₂ 설정값과 SpO₂·PaO₂ 측정값을 구별한다.",
  stem:"FiO₂가 40%로 설정되어 있을 때 알 수 있는 것은?",
  options:[option("a","환자 SpO₂가 40%다.","FiO₂는 공급 산소 농도이고 SpO₂는 산소포화도야.","FiO₂와 SpO₂ 동일시"),
   option("b","환자 PaO₂가 40 mmHg다.","PaO₂는 동맥혈가스분석으로 측정하는 산소분압이고 FiO₂ 설정으로 확정할 수 없어.","FiO₂와 PaO₂ 동일시"),
   option("c","공급 혼합가스에서 산소가 차지하는 비율이 40%로 설정되었다.","맞아. 설정된 FiO₂만으로 실제 환자의 산소화는 알 수 없어.")],
  answer:"c",rationale:"FiO₂는 흡입 산소분율 설정이며, 실제 산소화는 환자 사정·SpO₂·필요 시 ABGA로 별도 평가해.",sourceIds:["aarc","merck"],evidenceKind:"guideline-principle"},
 {id:"fio2-measure",conceptId:"fio2",objective:"SpO₂와 PaO₂의 측정 방법을 구별한다.",
  stem:"SpO₂와 PaO₂에 관한 설명으로 적절한 것은?",
  options:[option("a","SpO₂는 산소포화도 추정치이며 PaO₂는 동맥혈 산소분압이다.","맞아. 두 수치는 서로 다른 산소화 정보를 제공해."),
   option("b","SpO₂와 PaO₂는 동일한 값이므로 숫자로 서로 바꿔 쓸 수 있다.","단위와 측정 원리가 달라 직접 같은 수치로 바꿔 쓸 수 없어.","산소포화도와 산소분압 동일시"),
   option("c","FiO₂만 확인하면 SpO₂·PaO₂ 확인은 불필요하다.","공급 산소 설정과 환자 반응은 구분해 평가해야 해.","설정만으로 환자 산소화 판단")],
  answer:"a",rationale:"SpO₂는 맥박산소측정의 추정 포화도, PaO₂는 동맥혈가스분석에서 얻는 산소분압이야.",sourceIds:["aarc","merck"],evidenceKind:"educational-inference"},
 {id:"vte-meaning",conceptId:"vte",objective:"호기 일회호흡량(VTE)을 설정값이 아닌 측정값으로 이해한다.",
  stem:"PB980 화면에서 VTE가 뜻하는 것은?",
  options:[option("a","반드시 기계에 입력된 목표 호흡량이다.","VTE는 호기 일회호흡량 측정 용어이며 설정 목표량과 구별해야 해.","호기 측정량과 설정 목표량 혼동"),
   option("b","한 번의 호기에서 나온 가스의 용적을 나타내는 측정 지표다.","맞아. 환기 효과 평가 시 다른 임상 정보와 함께 해석해."),
   option("c","환자가 흡입하는 산소의 백분율이다.","그것은 FiO₂와 관련된 개념이야.","VTE와 FiO₂ 혼동")],
  answer:"b",rationale:"VTE는 호기 일회호흡량을 의미하며 환기 평가에는 체중 조건과 환자 상태 등의 맥락이 필요해.",sourceIds:["aarc","pb980"],evidenceKind:"guideline-principle"},
 {id:"vte-pc",conceptId:"vte",objective:"압력제어 환기 설정만으로 실제 VTE를 예측할 수 없음을 인식한다.",
  stem:"SIMV(PC)+PS 화면에서 Pᵢ 설정을 보았을 때 VTE에 대해 가장 적절한 판단은?",
  options:[option("a","Pᵢ가 정해지면 실제 호기 용적도 환자와 관계없이 항상 일정하다.","압력 설정이 같아도 호흡 역학·노력·누출 등에 따라 용적이 달라질 수 있어.","설정 압력만으로 VTE 확정"),
   option("b","상단 고정 예시 VTE 352 mL가 설정 조절 뒤 실제 측정값으로 갱신된다.","이 앱의 상단 VTE는 고정 예시이며 설정·파형과 연동되지 않아.","시뮬레이터 예시값을 실제 측정값으로 해석"),
   option("c","설정 압력과 실제 호기 용적은 구분하며 실제 환자에서는 측정값과 상태를 함께 확인한다.","맞아. 특히 PC에서 실제 VTE를 설정 압력만으로 단정하면 안 돼.")],
  answer:"c",rationale:"압력제어 환기에서 용적은 환자 특성과 조건에 영향을 받으며 이 앱은 실제 용적을 계산하지 않아.",sourceIds:["aarc","pb980"],evidenceKind:"educational-inference"},
 {id:"rate-distinction",conceptId:"rate",objective:"설정 호흡수 f와 자발호흡을 포함하는 총 호흡수 fTOT를 구분한다.",
  stem:"SIMV에서 설정 f가 15/min, 표시 fTOT가 22/min일 때 올바른 해석은?",
  options:[option("a","f는 설정된 강제호흡수, fTOT는 총 호흡수로 서로 다른 개념이다.","맞아. 총 호흡수에는 자발호흡이 포함될 수 있어."),
   option("b","기계가 오류를 일으켰으므로 두 수치는 항상 같아야 한다.","SIMV에서는 강제호흡 설정과 총 호흡수는 다를 수 있어.","설정 호흡수와 총 호흡수 동일시"),
   option("c","fTOT만으로 환기 적절성이나 환자 호흡노력을 모두 확인할 수 있다.","호흡수 단독으로 환기 질이나 호흡 노력을 확정할 수 없어.","호흡수 단독으로 환기 적절성 판정")],
  answer:"a",rationale:"SIMV에서 설정된 f와 측정된 총 호흡수는 개념이 달라, 호흡 노력과 용적·환기 상태를 함께 평가해.",sourceIds:["aarc","pb980"],evidenceKind:"educational-inference"},
 {id:"rate-static",conceptId:"rate",objective:"앱의 설정값·파형과 고정 모니터 예시를 구별한다.",
  stem:"이 교육 앱에서 f 설정을 바꾸면 어떤 변화가 가능한가?",
  options:[option("a","실제 환자의 fTOT와 SpO₂를 새로 계산한다.","현재 앱은 환자 총 호흡수나 산소화 반응을 계산하지 않아.","실제 환자 계산 모델이 있다고 가정"),
   option("b","교육용 파형 간격은 바뀔 수 있지만 상단 fTOT 예시는 고정되어 있다.","맞아. 앱의 파형과 고정 모니터 표시는 독립이야."),
   option("c","상단 VTE와 Ppeak가 새로운 임상 측정값으로 동기화된다.","상단 모니터 7종은 모두 고정 예시야.","교육용 파형을 실측 모니터링으로 오해")],
  answer:"b",rationale:"앱 내부의 설정·파형 변경은 고정 모니터 수치 및 CASE 가상 환자자료와 독립이야.",sourceIds:["app"],evidenceKind:"simulator-contract"},
 {id:"ppeak-pi",conceptId:"ppeak",objective:"최고기도압 Ppeak와 압력제어 흡기압 설정 Pᵢ를 구분한다.",
  stem:"Ppeak와 Pᵢ에 관한 설명으로 가장 적절한 것은?",
  options:[option("a","둘은 모두 동일한 설정값이며 언제나 같은 숫자여야 한다.","Pᵢ는 설정값이고 Ppeak는 관찰되는 기도압 수치야.","측정 Ppeak와 설정 Pᵢ 동일시"),
   option("b","Ppeak만 높으면 원인이 분비물이라고 확정할 수 있다.","기도·회로·환자 호흡 상태 등 다양한 맥락을 살펴야 해.","단일 압력값으로 원인 확정"),
   option("c","Pᵢ는 설정 흡기압이며 Ppeak는 관찰된 최고 기도압이므로 구별한다.","맞아. Ppeak의 의미는 환기 모드·환자 노력·기도와 회로 상태 등과 함께 해석해.")],
  answer:"c",rationale:"PC에서 Pᵢ는 설정 흡기압(이 앱 설명에서는 PEEP 위의 압력), Ppeak는 측정 최고 기도압 용어야.",sourceIds:["aarc","pb980"],evidenceKind:"educational-inference"},
 {id:"patient-first",conceptId:"patient",objective:"기계 수치보다 환자의 직접 상태 사정과 지도자에게의 보고를 우선한다.",
  stem:"기계환기 환자에게 갑작스러운 호흡곤란이 의심된다. 실습학생의 우선적인 학습 행동은?",
  options:[option("a","모니터 숫자가 정상이면 환자의 호흡양상은 확인하지 않는다.","직접 환자 상태를 보는 것은 필수야. 단일 숫자로 안심할 수 없어.","모니터 수치만 신뢰"),
   option("b","환자 호흡 노력·흉곽 움직임·산소화 추세 등을 즉시 관찰하고 지도자에게 신속히 알린다.","맞아. 안전한 학생 역할은 신속한 사정과 보고이며 기관 지침·지도자의 지시를 따라야 해."),
   option("c","지도자 확인 없이 독자적으로 환기 설정을 크게 바꾼다.","실습학생의 무단 설정 변경을 학습 정답으로 삼지 않아.","실습학생의 독자적 장비 조작")],
  answer:"b",rationale:"AARC 환자–인공호흡기 사정 지침은 직접 사정과 장비·기도 정보의 통합 평가를 강조해. 학생의 긴급 대응은 기관 지침과 지도 범위 내에서 이뤄져야 해.",sourceIds:["aarc"],evidenceKind:"educational-inference"}
]);
export const CORE_QUIZ_OBJECTIVES=Object.freeze(CORE_LESSONS.map(item=>({id:item.id,title:item.title})));
export function auditCoreQuiz(bank=CORE_QUESTIONS){
 const errors=[];const ids=new Set(),lessonIds=new Set(CORE_LESSONS.map(x=>x.id));
 if(!Array.isArray(bank)||bank.length<8||bank.length>12)errors.push("question count outside 8–12");
 if(CORE_QUIZ_REVIEW.status!=="pending"||CORE_QUIZ_REVIEW.approved!==false)errors.push("unreviewed status missing");
 for(const q of bank||[]){
  if(!q||typeof q.id!=="string"||ids.has(q.id))errors.push("question ID missing/duplicated");
  else ids.add(q.id);
  if(!lessonIds.has(q?.conceptId))errors.push("unknown lesson: "+q?.id);
  if(typeof q?.objective!=="string"||q.objective.length<12||typeof q?.stem!=="string"||q.stem.length<15)errors.push("question text/objective: "+q?.id);
  if(!Array.isArray(q?.options)||q.options.length!==3||new Set(q.options.map(o=>o.id)).size!==3||
     q.options.filter(o=>o.id===q.answer).length!==1||q.options.some(o=>!o.label||!o.feedback||o.feedback.length<12||(o.id!==q.answer&&!o.misconception)))errors.push("options/feedback: "+q?.id);
  if(!q?.rationale||q.rationale.length<20||!["guideline-principle","educational-inference","simulator-contract"].includes(q.evidenceKind))errors.push("evidence meaning: "+q?.id);
  if(!Array.isArray(q?.sourceIds)||!q.sourceIds.length||q.sourceIds.some(id=>!CORE_QUIZ_SOURCES[id]||!CORE_QUIZ_SOURCES[id].url.startsWith("https://")))errors.push("source reference: "+q?.id);
 }
 for(const id of lessonIds)if(!(bank||[]).some(q=>q.conceptId===id))errors.push("unassessed lesson: "+id);
 return {errors,count:bank?.length||0,review:CORE_QUIZ_REVIEW};
}
function checked(state){
 if(!state||!Number.isInteger(state.index)||state.index<0||state.index>=CORE_QUESTIONS.length||
    !Array.isArray(state.answers)||state.answers.length>CORE_QUESTIONS.length||
    state.answers.length<state.index||state.answers.length>state.index+1||typeof state.done!=="boolean")throw new RangeError("Invalid core-quiz state");
 return state;
}
export function startCoreQuiz(){return {index:0,answers:[],done:false};}
export function chooseCoreAnswer(state,choiceId){
 checked(state);
 if(state.done||state.answers.length!==state.index)throw new RangeError("Question already answered");
 const question=CORE_QUESTIONS[state.index];
 if(!question.options.some(x=>x.id===choiceId))throw new RangeError("Unknown core-quiz choice");
 return {...state,answers:[...state.answers,{questionId:question.id,choiceId,correct:choiceId===question.answer}]};
}
export function advanceCoreQuiz(state){
 checked(state);
 if(state.done||state.answers.length!==state.index+1)throw new RangeError("Current question unanswered");
 if(state.index===CORE_QUESTIONS.length-1)return {...state,done:true};
 return {...state,index:state.index+1};
}
export function scoreCoreQuiz(state){
 checked(state);
 return {correct:state.answers.filter(x=>x.correct).length,answered:state.answers.length,total:CORE_QUESTIONS.length,
   reviewConcepts:[...new Set(state.answers.filter(x=>!x.correct).map(a=>CORE_QUESTIONS.find(q=>q.id===a.questionId)?.conceptId).filter(Boolean))]};
}
