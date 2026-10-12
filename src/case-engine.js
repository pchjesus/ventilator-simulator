import {findCase} from "./preclinical-cases.js";

/** Pure, in-memory formative assessment; never changes app ventilator settings. */
export function startCase(caseId){
  if(!findCase(caseId))throw new RangeError("Unknown training case");
  return {caseId,index:0,answers:[],done:false};
}
function checkedState(state){
  const data=findCase(state?.caseId);
  if(!data||!Number.isInteger(state.index)||state.index<0||state.index>=data.steps.length||
     !Array.isArray(state.answers)||state.answers.length>data.steps.length||typeof state.done!=="boolean")
    throw new RangeError("Invalid training state");
  return data;
}
export function chooseCaseAnswer(state,choiceId){
  const data=checkedState(state);
  if(state.done||state.answers.length!==state.index)throw new RangeError("Step already answered");
  const question=data.steps[state.index];
  if(!question.options.some(option=>option.id===choiceId))throw new RangeError("Unknown choice");
  return {...state,answers:[...state.answers,{stepId:question.id,choiceId,correct:question.answer===choiceId}]};
}
export function advanceCase(state){
  const data=checkedState(state);
  if(state.done||state.answers.length!==state.index+1)throw new RangeError("Answer current step first");
  if(state.index===data.steps.length-1)return {...state,done:true};
  return {...state,index:state.index+1};
}
export function caseScore(state){
  checkedState(state);
  return {correct:state.answers.filter(x=>x.correct).length,answered:state.answers.length,total:findCase(state.caseId).steps.length};
}
