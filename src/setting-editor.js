import {PARAMETERS,adjustSetting} from "./sim-model.js";

// A staged teaching edit is *not* the committed simulation state.
// The limits and steps below are those of the existing study model,
// not certified PB980 operating ranges or conditional interlocks.
export function beginSettingEdit(settings,id){
  const param=PARAMETERS.find(p=>p.id===id);
  if(!param||!Number.isFinite(settings[id]))return null;
  return {id,original:settings[id],pending:settings[id]};
}
export function preferredEditStep(id){
  const param=PARAMETERS.find(p=>p.id===id);
  if(!param)return null;
  // Keep each existing increment valid, not a manufacturer dial emulator.
  return ["peep","ti","trigger"].includes(id)?0.1:1;
}
export function stepSettingEdit(edit,delta){
  if(!edit)return null;
  const param=PARAMETERS.find(p=>p.id===edit.id);
  if(!param||!param.steps.includes(delta))return edit;
  const adjusted=adjustSetting({[edit.id]:edit.pending},edit.id,delta);
  return {...edit,pending:adjusted[edit.id]};
}

/** Strict typed-value parser for the educational model, NOT PB980 OEM limits.
 * No silent rounding, no exponent notation, no partial forms or NaN. */
export function parseSettingEntry(id,raw){
 const param=PARAMETERS.find(p=>p.id===id);
 if(!param)return {value:null,error:"알 수 없는 설정 항목"};
 const input=String(raw??"").trim();
 if(!/^(?:\d+)(?:\.\d+)?$/.test(input))return {value:null,error:"숫자를 입력해 줘 (예: 5 또는 5.0)"};
 const value=Number(input);
 if(!Number.isFinite(value)||value<param.min||value>param.max)
   return {value:null,error:"학습용 설정 범위: "+param.min+"–"+param.max+" "+param.unit};
 const factor=10**param.precision;
 if(!Number.isSafeInteger(Math.round(value*factor))||
    Math.abs(value*factor-Math.round(value*factor))>1e-7)
   return {value:null,error:"소수 자릿수를 확인해 줘 ("+param.precision+"자리까지)"};
 return {value:Number(value.toFixed(param.precision)),error:null};
}
export function defaultSettingEdit(edit){
 const param=PARAMETERS.find(p=>p.id===edit?.id);
 return edit&&param?{...edit,pending:param.initial}:edit;
}
export function acceptSettingEdit(settings,edit){
  if(!edit||!Number.isFinite(edit.pending)||settings[edit.id]!==edit.original)return settings;
  const param=PARAMETERS.find(p=>p.id===edit.id);
  if(!param||edit.pending<param.min||edit.pending>param.max||parseSettingEntry(edit.id,String(edit.pending)).error)return settings;
  // Return the original object when the user accepted an unchanged value.
  return edit.pending===edit.original?settings:{...settings,[edit.id]:edit.pending};
}
