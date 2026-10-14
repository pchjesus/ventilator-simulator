/**
 * Deterministic, educational comparison only. Independent of the device display,
 * animation clock, committed/pending state, monitor samples and fictional CASEs.
 */
import {generateWaveform} from "./waveform-model.js";
import {initialSettings} from "./sim-model.js";
export const COMPARE_START=0,COMPARE_DURATION=16,COMPARE_COUNT=320;
export const COMPARE_TYPES=Object.freeze({
 pressure:Object.freeze({label:"Pressure / Time",unit:"cmH₂O"}),
 flow:Object.freeze({label:"Flow / Time",unit:"L/min"}),
 volume:Object.freeze({label:"Volume / Time",unit:"mL"})
});
export function compareWaveforms(baselineSettings=initialSettings(),trialSettings=initialSettings()){
 const baselineConfig={...baselineSettings},trialConfig={...trialSettings};
 const baseline=generateWaveform(baselineConfig,COMPARE_START,COMPARE_DURATION,COMPARE_COUNT);
 const trial=generateWaveform(trialConfig,COMPARE_START,COMPARE_DURATION,COMPARE_COUNT);
 if(baseline.length!==COMPARE_COUNT||trial.length!==COMPARE_COUNT)throw new Error("Comparison sample count mismatch");
 const axes={};
 for(const name of Object.keys(COMPARE_TYPES)){
  const values=[...baseline,...trial].map(point=>point[name]);
  if(values.some(value=>!Number.isFinite(value)))throw new Error("Non-finite comparison: "+name);
  if(name==="flow"){
   const extent=Math.max(1,...values.map(Math.abs));
   axes[name]={min:-extent,max:extent,zero:0};
  }else axes[name]={min:0,max:Math.max(1,...values),zero:0};
 }
 for(let i=0;i<COMPARE_COUNT;i++){
  if(!Number.isFinite(baseline[i].time)||baseline[i].time!==trial[i].time)throw new Error("Comparison time-axis mismatch");
 }
 return {start:COMPARE_START,duration:COMPARE_DURATION,count:COMPARE_COUNT,
  baselineSettings:baselineConfig,trialSettings:trialConfig,baseline,trial,axes};
}
