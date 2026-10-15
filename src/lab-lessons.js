/** v0.5.4: model-specific teaching draft. NOT medically reviewed or scored. */
export const LAB_CONTENT_VERSION="0.5.4-d5-a.1";
export const LAB_SOURCES=Object.freeze({
 generator:{title:"Ventilator Simulator v0.5.3 · src/waveform-model.js / waveform-compare.js",kind:"app-implementation",note:"생성 파형 동작의 구현 근거. 임상 효과의 근거가 아님."},
 design:{title:"Ventilator Simulator · 승인 D5-A UX 명세",kind:"approved-design",note:"실습 순서·모델 경계·선택형 6문항의 승인 계약."},
 aarc:{title:"Goodfellow et al. (2024). AARC clinical practice guideline: Patient-ventilator assessment. Respiratory Care, 69(8), 1042–1054.",kind:"clinical-context",url:"https://doi.org/10.4187/respcare.12007",note:"환자-인공호흡기 평가의 일반적 배경. 본 시뮬레이터 계산식 검증 자료는 아님."}
});
const review=()=>({approved:false,status:"pending-clinical-review"});
const options=(entries)=>entries.map(([id,text,feedback])=>({id,text,feedback}));
export const LAB_LESSONS=Object.freeze([
 {id:"peep",title:"LAB-01 · PEEP",objectiveIds:["LAB-01-PRESSURE","LAB-01-LIMITATION"],setting:"PEEP 5 → 8 cmH₂O",objective:"생성 압력 파형의 호기말 기준선과 환자 생리 반응의 차이를 설명해.",summary:"이 앱은 PEEP 변화에 따른 생성 압력의 기준선을 비교해. 실제 산소화나 혈역학 변화는 예측하지 않아.",
  questions:[
   {id:"LAB-01-P",objectiveIds:["LAB-01-PRESSURE"],phase:"predict",prompt:"다른 설정이 같은 상태에서 PEEP를 5에서 8로 바꾸면 이 앱의 Pressure 파형은 어떻게 보일까?",
    options:options([["a","호기말 압력 기준선이 위로 이동한다.","이 앱의 압력 생성 모델은 PEEP를 기준선으로 사용해."],["b","세 가지 파형 모두 같은 높이만큼 올라간다.","유량과 용적은 압력과 다른 단위·생성 규칙을 사용해. 전부 같은 양으로 이동하지 않아."],["c","SpO₂와 혈압이 자동으로 상승하는 모습이 나타난다.","SpO₂ 및 혈역학은 이 LAB이 계산하거나 표시하는 값이 아니야."]]),answer:"a",
    explanation:"PEEP 입력값 증가는 이 앱의 생성 Pressure 파형 기준선을 높여. 이것은 압력 생성 규칙에 관한 관찰이야.",
    sourceIds:["generator","design"],evidenceKind:"app-implementation",review:review()},
   {id:"LAB-01-I",objectiveIds:["LAB-01-LIMITATION"],phase:"interpret",prompt:"PEEP 변화 후 일부 유량·용적 선이 비슷하거나 같게 보인다면 가장 적절한 해석은?",
    options:options([["a","실제 폐포 모집과 산소화가 변하지 않았음이 입증된다.","생성 파형 일치는 환자 반응을 검증하지 않아."],["b","이 모델의 제한된 입력과 계산 규칙에서 같은 모양이 생성될 수 있다.","맞아. 생성 모델의 반응과 실제 임상 반응을 구별해야 해."],["c","모니터의 VTE와 SpO₂가 따라서 고정된다.","독립 고정 모니터와 실제 산소화 자료는 이 LAB 파형에 연동되지 않아."]]),answer:"b",
    explanation:"파형의 유사성은 교육용 생성 모델의 결과일 뿐이야. 환자 상태는 실제 관찰과 평가가 필요해.",
    sourceIds:["generator","aarc"],evidenceKind:"model-limitation",review:review()}
  ]},
 {id:"rate",title:"LAB-02 · 설정 f",objectiveIds:["LAB-02-TIMING","LAB-02-LIMITATION"],setting:"설정 f 15 → 18 /min",objective:"설정 강제호흡수와 생성 호흡 간격, 실제 총호흡수의 차이를 구별해.",summary:"설정 f를 올렸을 때 강제호흡 생성 간격을 비교해. 자발 호흡은 별도의 교육용 가정이야.",
  questions:[
   {id:"LAB-02-P",objectiveIds:["LAB-02-TIMING"],phase:"predict",prompt:"설정 f를 분당 15에서 18로 바꾸면 이 앱의 강제호흡 파형 간격은 어떻게 될까?",
    options:options([["a","설정 f와 무관하게 항상 정확히 동일하다.","강제호흡 주기는 이 앱의 설정 f를 사용해 생성돼."],["b","강제호흡 사이 간격이 더 짧아진다.","맞아. 같은 16초 안에서 설정 강제호흡 주기가 짧아져."],["c","실제 환자의 fTOT가 반드시 18/min이 된다.","설정 강제호흡수는 실제 총호흡수와 같다고 단정할 수 없어."]]),answer:"b",
    explanation:"생성 모델에서는 설정 f가 커지면 강제호흡 주기가 짧아져. 인위적으로 배치된 자발호흡은 별개의 가정이야.",
    sourceIds:["generator","design"],evidenceKind:"app-implementation",review:review()},
   {id:"LAB-02-I",objectiveIds:["LAB-02-LIMITATION"],phase:"interpret",prompt:"간격이 짧아진 생성 파형을 관찰한 뒤 옳은 설명은?",
    options:options([["a","실제 환자의 호흡 노력과 총호흡수를 정확히 예측한 결과다.","자발호흡 이벤트는 예시를 위한 가정이고, fTOT를 예측하지 않아."],["b","설정 f가 18이면 실제 모니터의 fTOT도 항상 18이다.","고정 예시 모니터는 LAB과 독립되어 있고, 실제 총호흡수와 강제 설정 빈도는 다를 수 있어."],["c","모델의 강제호흡 간격 변화는 볼 수 있지만 실제 환자 fTOT는 알 수 없다.","맞아. 이 LAB으로 확인되는 것은 생성 파형의 간격이야."]]),answer:"c",
    explanation:"설정 f 변화의 학습용 가시화이며 실제 총호흡수와 환자-기기 상호작용을 재현하지 않아.",
    sourceIds:["generator","aarc"],evidenceKind:"model-limitation",review:review()}
  ]},
 {id:"fio2",title:"LAB-03 · FiO₂",objectiveIds:["LAB-03-MODEL","LAB-03-LIMITATION"],setting:"FiO₂ 40% → 60%",objective:"FiO₂가 생성 파형 모델의 입력에 포함되지 않는다는 점과 실제 산소화 평가의 차이를 설명해.",summary:"FiO₂는 산소 농도 설정이지만, 이 앱의 Pressure·Flow·Volume 생성 함수는 이 값을 사용하지 않아.",
  questions:[
   {id:"LAB-03-P",objectiveIds:["LAB-03-MODEL"],phase:"predict",prompt:"FiO₂만 40%에서 60%로 바꾸면 이 앱의 생성 Pressure·Flow·Volume 곡선은 어떻게 될까?",
    options:options([["a","세 생성 파형이 기준과 동일하게 겹친다.","맞아. 이 버전의 파형 생성 함수는 FiO₂를 계산 입력으로 사용하지 않아."],["b","세 생성 파형의 진폭이 모두 50% 상승한다.","산소 농도 증가가 기계적 파형 진폭 증가로 직접 변환되는 규칙은 없어."],["c","SpO₂가 반드시 상승하며 새 파형으로 표시된다.","SpO₂ 및 실제 산소화 반응은 이 비교 모델의 출력이 아니야."]]),answer:"a",
    explanation:"동일한 곡선은 FiO₂를 읽지 않는 생성 코드의 결과야. 실제 환자의 산소화 반응 부재를 뜻하지 않아.",
    sourceIds:["generator","design"],evidenceKind:"app-implementation",review:review()},
   {id:"LAB-03-I",objectiveIds:["LAB-03-LIMITATION"],phase:"interpret",prompt:"FiO₂ LAB에서 두 선이 완전히 겹친 것을 본 뒤 가장 적절한 결론은?",
    options:options([["a","실제 환자에게 FiO₂ 변화의 임상 효과가 없다는 증거다.","모델에서 출력이 같다는 것과 실제 환자 산소화 반응은 다른 문제야."],["b","앱은 FiO₂에 따른 산소화 반응을 계산하지 않으므로 실제 효과는 이 그래프로 판단할 수 없다.","맞아. 생성 파형과 산소화·임상 관찰을 구분해야 해."],["c","PB980 장비도 FiO₂를 바꿔도 어떤 결과도 변하지 않는다.","실제 기기의 동작과 환자 결과는 이 앱의 생성 코드로 검증되지 않아."]]),answer:"b",
    explanation:"이 LAB은 FiO₂ 변화가 파형 생성 모델에 반영되지 않는다는 한계를 보여줘. 실제 산소화는 환자 자료로 평가해야 해.",
    sourceIds:["generator","aarc"],evidenceKind:"model-limitation",review:review()}
  ]}
]);
export function labLesson(labId){return LAB_LESSONS.find(lesson=>lesson.id===labId)||null;}
export function labQuestion(labId,phase){return labLesson(labId)?.questions.find(question=>question.phase===phase)||null;}
export function auditLabLessons(lessons=LAB_LESSONS,sources=LAB_SOURCES){
 const errors=[],globalIds=new Set(),validEvidence=new Set(["app-implementation","model-limitation"]);
 if(!Array.isArray(lessons)||lessons.length!==3)errors.push("Expected exactly 3 LAB lessons");
 for(const lab of lessons||[]){
  if(!lab||!["peep","rate","fio2"].includes(lab.id)||globalIds.has(lab.id))errors.push("Invalid or duplicate LAB id");
  globalIds.add(lab?.id);
  if(!lab?.title||!lab.objective||!lab.summary||!Array.isArray(lab.objectiveIds)||!lab.objectiveIds.length)errors.push("LAB metadata missing: "+lab?.id);
  if(!Array.isArray(lab?.questions)||lab.questions.length!==2)errors.push("Expected 2 questions: "+lab?.id);
  for(const phase of ["predict","interpret"]){
   const matches=lab?.questions?.filter(q=>q.phase===phase)||[];
   if(matches.length!==1)errors.push("Expected one "+phase+" question in "+lab?.id);
  }
  for(const q of lab?.questions||[]){
   if(!q.id||globalIds.has(q.id))errors.push("Duplicate or missing question id: "+q.id);
   globalIds.add(q.id);
   if(!q.prompt||!q.explanation||!q.objectiveIds?.length||q.objectiveIds.some(id=>!lab.objectiveIds.includes(id)))errors.push("Invalid text/objective: "+q.id);
   if(q.review?.approved!==false||q.review?.status!=="pending-clinical-review")errors.push("Clinical approval incorrectly marked: "+q.id);
   if(!validEvidence.has(q.evidenceKind))errors.push("Invalid evidence kind: "+q.id);
   if(!Array.isArray(q.options)||q.options.length!==3)errors.push("Expected 3 options: "+q.id);
   const optionIds=q.options?.map(o=>o.id)||[],optionText=q.options?.map(o=>o.text)||[];
   if(new Set(optionIds).size!==3||new Set(optionText).size!==3||q.options?.some(o=>!o.id||!o.text||!o.feedback))errors.push("Invalid/duplicate options or feedback: "+q.id);
   if(!optionIds.includes(q.answer))errors.push("Missing answer: "+q.id);
   if(!Array.isArray(q.sourceIds)||!q.sourceIds.length||q.sourceIds.some(id=>!sources[id]))errors.push("Missing/unknown source: "+q.id);
   if(!q.sourceIds?.includes("generator"))errors.push("Missing generator model trace: "+q.id);
  }
 }
 return {valid:errors.length===0,errors,count:(lessons||[]).reduce((sum,l)=>sum+(l.questions?.length||0),0)};
}
