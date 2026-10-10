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
export function acceptSettingEdit(settings,edit){
  if(!edit||!Number.isFinite(edit.pending)||settings[edit.id]!==edit.original)return settings;
  const param=PARAMETERS.find(p=>p.id===edit.id);
  if(!param||edit.pending<param.min||edit.pending>param.max)return settings;
  // Return the original object when the user accepted an unchanged value.
  return edit.pending===edit.original?settings:{...settings,[edit.id]:edit.pending};
}
