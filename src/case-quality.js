import {auditClinicalData} from "./case-clinical-data.js";
import {auditCaseAction} from "./case-actions.js";
/**
 * Static content integrity gate, not medical validation or clinical approval.
 * Deliberately pure: may validate fixtures without mutating the shipped bank.
 */
const EVIDENCE_KINDS=new Set(["simulator-contract","guideline-principle","educational-inference"]);
const isText=(value,min=1)=>typeof value==="string"&&value.trim().length>=min;
const isArray=(v)=>Array.isArray(v);
const https=(s)=>typeof s==="string"&&/^https:\/\/[^\s]+$/.test(s);
export function auditCaseBank(cases,sources){
  const errors=[],warnings=[],items=[];
  const error=(path,reason)=>errors.push({path,reason});
  if(!isArray(cases)||!cases.length) return {errors:[{path:"cases",reason:"사례 목록 누락"}],warnings,items,caseCount:0,itemCount:0};
  if(!sources||typeof sources!=="object")return {errors:[{path:"sources",reason:"근거 자료 목록 누락"}],warnings,items,caseCount:cases.length,itemCount:0};
  const caseIds=new Set();
  for(const [caseIndex,scenario] of cases.entries()){
    const path="cases["+caseIndex+"]";
    if(!scenario||typeof scenario!=="object"){error(path,"사례 정보 없음");continue;}
    if(!isText(scenario.id)||caseIds.has(scenario.id))error(path+".id","사례 ID 누락/중복");
    else caseIds.add(scenario.id);
    if(!isText(scenario.title,10))error(path+".title","사례 제목 누락");
    if(!isText(scenario.premise,40)||!isText(scenario.prebrief,30))error(path+".prebrief","상황/사전 안내 부족");
    if(!isArray(scenario.vignette)||scenario.vignette.length<2)error(path+".vignette","가상 상황 자료 부족");
    if(!isArray(scenario.objectives)||scenario.objectives.length<2)error(path+".objectives","학습목표 누락");
    if(!isText(scenario.contentVersion)||!/^\d+\.\d+\.\d+$/.test(scenario.contentVersion))error(path+".contentVersion","콘텐츠 버전 표기 누락");
    if(!scenario.review||scenario.review.status!=="pending"||scenario.review.approved!==false)error(path+".review","임상 감수 미완료 상태를 명시해야 함");
    const objectiveIds=new Set();
    for(const [i,obj] of (scenario.objectives||[]).entries()){
      if(!obj||!isText(obj.id)||objectiveIds.has(obj.id)||!isText(obj.text,10))error(path+".objectives["+i+"]","목표 ID/내용 누락 또는 중복");
      else objectiveIds.add(obj.id);
    }
    if(!isArray(scenario.sources)||!scenario.sources.length)error(path+".sources","사례 근거 누락");
    for(const id of scenario.sources||[]){
      if(!sources[id]||!https(sources[id].url)||!isText(sources[id].label))error(path+".sources","근거 참조 오류: "+id);
    }
    if(!isArray(scenario.debrief)||scenario.debrief.length<3||scenario.debrief.some(p=>!isText(p,15)))error(path+".debrief","구조화 복습 질문 최소 3개 필요");
    if(!isArray(scenario.steps)||scenario.steps.length<2){error(path+".steps","문항 누락");continue;}
    const stepIds=new Set();
    for(const [stepIndex,step] of scenario.steps.entries()){
      const ref=path+".steps["+stepIndex+"]";
      if(!step||typeof step!=="object"){error(ref,"문항 없음");continue;}
      if(!isText(step.id)||stepIds.has(step.id))error(ref+".id","문항 ID 누락/중복");
      else stepIds.add(step.id);
      if(!isText(step.question,15)||!isText(step.explanation,40))error(ref,"질문/정답해설 불충분");
      if(!isArray(step.options)||step.options.length<3||step.options.some(opt=>!isText(opt?.id)||!isText(opt?.label,10)||!isText(opt?.feedback,15)))error(ref+".options","선지 또는 개별 피드백 누락");
      const choiceIds=(step.options||[]).map(x=>x?.id);
      if(new Set(choiceIds).size!==choiceIds.length)error(ref+".options","선지 ID 중복");
      if(choiceIds.filter(x=>x===step.answer).length!==1)error(ref+".answer","정답 연결 오류");
      if(!isArray(step.objectiveIds)||!step.objectiveIds.length||step.objectiveIds.some(x=>!objectiveIds.has(x)))error(ref+".objectiveIds","학습목표 추적 누락");
      if(!isArray(step.sourceIds)||!step.sourceIds.length||step.sourceIds.some(x=>!sources[x]||!https(sources[x].url)||!scenario.sources.includes(x)))error(ref+".sourceIds","근거 링크 누락/유효하지 않은 참조");
      if(!EVIDENCE_KINDS.has(step.evidenceKind)||!isText(step.evidenceNote,20))error(ref+".evidence","근거 성격 또는 해설 추적 메모 누락");
      for(const issue of auditCaseAction(step,scenario,sources))error(ref+"."+issue.path,issue.reason);
      items.push({caseId:scenario.id,stepId:step.id,objectiveIds:step.objectiveIds||[],sourceIds:step.sourceIds||[],evidenceKind:step.evidenceKind});
    }
    for(const issue of auditClinicalData(scenario,sources))error(path+"."+issue.path,issue.reason);
    if(scenario.review?.status==="pending")warnings.push({path:path+".review",reason:"임상 전문가 감수 전 초안: 배포 승인 아님"});
  }
  return {errors,warnings,items,caseCount:cases.length,itemCount:items.length};
}
export function evidenceKindLabel(kind){
  return ({
    "simulator-contract":"앱 구현 규약 + 환자 사정 원칙",
    "guideline-principle":"임상 실무지침의 일반 원칙",
    "educational-inference":"지침에 기초한 교육적 판단"
  })[kind]||"근거 분류 미정";
}
