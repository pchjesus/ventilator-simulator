/**
 * Deterministic, illustrative SIMV(PC)+PS breathing-waveform preview.
 * Not a validated PB980 delivery algorithm or a patient physiology model.
 * No gas exchange, trigger timing, resistance, patient effort, or alarm modeling.
 *
 * Pressure: PEEP baseline + a simple ramp/plateau on inspiration.
 * Volume: normalized half-cosine inspiration + exponential expiration.
 * Flow: derivative of volume (mL/s to L/min). Phase timing is illustrative.
 */
export const WAVEFORM_MODEL = "illustrative-v1.1";
const COMPLIANCE_DEMO_ML_PER_CMH2O = 35;
const EXP_TAU_SHAPE = 3.2;
// This guard prevents pathological event allocations if a caller bypasses the UI bounds.
function validateRate(settings){
  if (!settings || !Number.isFinite(settings.rate) || settings.rate < 0.5 || settings.rate > 60) {
    throw new RangeError("Invalid illustrative breathing rate");
  }
}

export function breathEvents(settings, from, to) {
  validateRate(settings);
  if (!Number.isFinite(from)||!Number.isFinite(to)||to<from||to-from>7200) {
    throw new RangeError("Invalid waveform event window");
  }
  const period=60/settings.rate;
  const events=[];
  const first=Math.floor(from/period)-2;
  const last=Math.ceil(to/period)+1;
  for(let k=first;k<=last;k++){
    const at=k*period;
    events.push({at,type:"mandatory"});
    // Artificial teaching-example spontaneous efforts; not patient-triggered.
    if(period>=3 && k%2===0 && settings.ps>0) {
      events.push({at:at+period*0.58,type:"spontaneous"});
    }
  }
  return events.sort((a,b)=>a.at-b.at);
}
function stateAt(settings,event,nextAt,t) {
  const peep=settings.peep;
  const support=event.type==="mandatory"?settings.pi:settings.ps;
  const maxInsp=event.type==="mandatory"?settings.ti:Math.min(0.9,settings.ti*0.75);
  const available=Math.max(0.15,nextAt-event.at);
  const ti=Math.min(maxInsp,available*0.75);
  const te=Math.max(0.01,nextAt-event.at-ti);
  const vt=Math.max(0,COMPLIANCE_DEMO_ML_PER_CMH2O*support);
  const phaseTime=t-event.at;
  if(phaseTime<ti) {
    const u=Math.max(0,Math.min(1,phaseTime/ti));
    const ramp=Math.min(1,u/0.12);
    const volume=vt*(1-Math.cos(Math.PI*u))/2;
    const flow=vt*Math.PI*Math.sin(Math.PI*u)/(2*ti)*0.06;
    return {pressure:peep+support*ramp,flow,volume,phase:event.type};
  }
  const v=Math.max(0,Math.min(1,(phaseTime-ti)/te));
  // Exponential attenuation with a squared end taper. Both volume and
  // its derivative (flow) reach zero at the next breath boundary.
  const tail=1-v;
  const ex=Math.exp(-EXP_TAU_SHAPE*v);
  const volume=vt*ex*tail*tail;
  const flow=-0.06*vt*ex*(EXP_TAU_SHAPE*tail*tail+2*tail)/te;
  return {pressure:peep,flow,volume:Math.max(0,volume),phase:"expiration"};
}
/**
 * Time-based deterministic samples. Parameter ranges enforced upstream.
 * Called at display cadence; labels above waveform remain fixed examples.
 */
export function generateWaveform(settings,start=0,duration=16,count=240){
  if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0||!Number.isInteger(count)||count<2||count>2000){
    throw new RangeError("Invalid waveform sampling arguments");
  }
  validateRate(settings);
  if (["peep","pi","ps","ti"].some(key => !Number.isFinite(settings[key]))
      || settings.peep<0 || settings.pi<0 || settings.ps<0 || settings.ti<=0 || settings.ti>10) {
    throw new RangeError("Invalid waveform study settings");
  }
  const events=breathEvents(settings,start-60, start+duration+60);
  let index=0;
  const samples=[];
  for(let i=0;i<count;i++){
    const time=start+duration*i/(count-1);
    while(index+1<events.length-1&&events[index+1].at<=time)index++;
    const event=events[index];
    const next=events[index+1]||{at:event.at+60/settings.rate};
    const s=stateAt(settings,event,next.at,time);
    samples.push({time,...s});
  }
  return samples;
}
export function previewScales(settings,samples){
  const peakFlow=Math.max(30,...samples.map(s=>Math.abs(s.flow)));
  return {pressureMax:Math.max(25,settings.peep+Math.max(settings.pi,settings.ps)+5),
    flowMax:Math.ceil(peakFlow/10)*10,
    volumeMax:Math.max(350,Math.ceil(35*Math.max(settings.pi,settings.ps)/100)*100)};
}
