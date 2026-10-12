// Educational UI demonstration; not verified PB980 operating ranges.
export const VERSION = "0.4.2";
export const DEVICE = "Puritan Bennett 980 (reference-inspired)";
// Adult invasive SIMV/PC/PS manufacturer's Table 11-9 reference data.
// These DO NOT replace the separate educational control ranges or steps.
// Mode-dependent and conditional soft/hard bounds are not implemented.
export const DEVICE_REFERENCE = Object.freeze({
  fio2:{min:21,max:100,resolution:"1%",detail:"21–100%; 설정 해상도 1%"},
  peep:{min:0,max:45,resolution:"0.5 cmH₂O (<20), 1 cmH₂O (≥20)",detail:"0–45 cmH₂O; 20 미만 0.5, 20 이상 1"},
  rate:{min:1,max:100,resolution:"0.1/min (<10), 1/min (≥10)",detail:"성인 1–100/min; 10 미만 0.1, 10 이상 1"},
  pi:{min:5,max:90,resolution:"1 cmH₂O",detail:"5–90 cmH₂O; 1 cmH₂O"},
  ti:{min:0.2,max:8,resolution:"0.01 s",detail:"PC 강제호흡 0.2–8 s; 0.01 s"},
  ps:{min:0,max:70,resolution:"1 cmH₂O",detail:"0–70 cmH₂O; 1 cmH₂O"},
  trigger:{min:0.2,max:20,resolution:"0.1 L/min",detail:"성인 유량 트리거 0.2–20 L/min; 0.1 L/min"}
});
export const PARAMETERS = Object.freeze([
  {id:"fio2", label:"O₂", unit:"%", initial:40, min:21, max:100, precision:0, steps:[-10,-1,1,10], help:"FiO₂: 흡입 산소 농도. 산소화와 관련되며 SpO₂/ABGA를 함께 평가해야 해."},
  {id:"peep", label:"PEEP", unit:"cmH₂O", initial:5, min:0, max:20, precision:1, steps:[-10,-1,-0.1,0.1,1,10], help:"호기말 양압. 호기 말 기도압이 0으로 떨어지지 않도록 하는 설정이야. 실제 산소화·혈역학 반응은 환자에 따라 달라."},
  {id:"rate", label:"f", unit:"/min", initial:15, min:1, max:40, precision:0, steps:[-10,-1,1,10], help:"설정된 강제호흡 빈도. SIMV에서는 실제 총 호흡수(fTOT)와 다를 수 있어."},
  {id:"pi", label:"Pᵢ", unit:"cmH₂O", initial:10, min:1, max:30, precision:1, steps:[-10,-1,-0.1,0.1,1,10], help:"PC 강제호흡의 흡기압 설정(PEEP 위에 적용되는 압력). 실제 최고기도압은 상황에 따라 달라질 수 있어."},
  {id:"ti", label:"Tᵢ", unit:"sec", initial:1, min:0.2, max:3, precision:1, steps:[-0.1,0.1], help:"강제호흡 흡기 시간. 호흡 주기, I:E와 연관되며 호기시간 확보도 중요해."},
  {id:"ps", label:"PS", unit:"cmH₂O", initial:10, min:0, max:30, precision:1, steps:[-10,-1,-0.1,0.1,1,10], help:"자발호흡 시 제공하는 압력 보조. 환자의 노력과 호흡 역학에 따라 결과가 달라져."},
  {id:"trigger", label:"V-TRIG", unit:"L/min", initial:3, min:0.5, max:10, precision:1, steps:[-1,-0.1,0.1,1], help:"유량 트리거 감도 설정. 자발호흡을 인식하는 문턱값이며 누출·자동 트리거·호흡노력과 연관돼."}
]);
export const MONITOR_REFERENCE = Object.freeze([
  ["PPEAK","15","cmH₂O"],["PMEAN","8.8","cmH₂O"],["PEEP","5.8","cmH₂O"],
  ["I:E","1:1.8",""],["fTOT","22","/min"],["VTE","352","mL"],["V̇E TOT","7.43","L/min"]
]);
export function initialSettings() {
  return Object.fromEntries(PARAMETERS.map(parameter => [parameter.id, parameter.initial]));
}
export function adjustSetting(settings, id, delta) {
  const parameter = PARAMETERS.find(item => item.id === id);
  if (!parameter || !parameter.steps.includes(delta) || !Number.isFinite(settings[id])) return settings;
  const next = Math.min(parameter.max, Math.max(parameter.min, settings[id] + delta));
  const rounded = Number(next.toFixed(parameter.precision));
  return {...settings, [id]: rounded};
}
export function formatSetting(id, value) {
  const parameter = PARAMETERS.find(item => item.id === id);
  return parameter ? Number(value).toFixed(parameter.precision) : "—";
}
