/**
 * Static, fictional clinical documents. Never drive ventilator settings,
 * independent adult reference monitor, generated waveforms, alarms, or physiology.
 */
export const CASE_CLINICAL_DATA=Object.freeze({
 "mas-neonate":{
  modelPolicy:"reference-only",
  note:"가상 신생아의 정적 검사 예시야. 환아가 악화할 때 검사를 기다리라는 뜻이 아니고 원래 장비 모니터와 연결되지 않아.",
  panels:[
   {id:"mas-xray",kind:"imaging",title:"흉부 X-ray · 판독 소견",availableFromStep:0,
    collectedAt:"NICU 입실 초기 촬영(가상)",sampleType:"영상 판독",oxygenContext:"해당 없음",
    preview:"양측 폐의 불균일한 침윤성 음영과 일부 과팽창",
    findings:["양측 폐의 불균일한 침윤성 음영","일부 과팽창 소견"],
    interpretation:"MAS에서 가능하지만 영상 소견만으로 모든 호흡곤란 원인을 단정하지 않아. 환자 상태와 함께 해석해.",
    sourceIds:["merck_mas"]},
   {id:"mas-abga",kind:"blood-gas",title:"ABGA · 동맥혈가스분석",availableFromStep:1,
    collectedAt:"현재 악화 징후 확인보다 15분 전에 채혈된 가상 결과",sampleType:"arterial",oxygenContext:"당시 FiO₂ 0.50(가정), 현재 공급조건은 별도 확인",
    preview:"pH 7.29 · PaCO₂ 52 mmHg · PaO₂ 58 mmHg",
    values:[{id:"ph",label:"pH",value:7.29,unit:""},{id:"pco2",label:"PaCO₂",value:52,unit:"mmHg"},{id:"po2",label:"PaO₂",value:58,unit:"mmHg"},{id:"hco3",label:"HCO₃⁻",value:24,unit:"mEq/L"}],
    interpretation:"pH 감소와 PaCO₂ 상승은 호흡성 산증 양상을 시사해. 채혈 당시 FiO₂·실제 환아 상태·현재 경과를 함께 봐야 해.",
    sourceIds:["aarc","merck_mas"]}
  ]},
 "rsv-infant":{
  modelPolicy:"reference-only",
  note:"가상 PICU 환아의 예시야. 산소포화도 악화 시 먼저 사정·보고하고, 이후 기록에서 검사 결과를 확인하는 교육 흐름이야.",
  panels:[
   {id:"rsv-observation",kind:"observation",title:"현재 호흡·기도 관찰",availableFromStep:0,
    collectedAt:"현재의 가상 관찰",sampleType:"비검사 임상 관찰",oxygenContext:"실측 인공호흡기 조건 미제시",
    preview:"SpO₂ 하락 추세 · 분비물 증가 · 흉곽 움직임 변화",
    findings:["분비물 증가","흉곽 움직임 변화","SpO₂ 측정 신호 신뢰성 및 기도·회로 추가 확인 필요"],
    interpretation:"분비물만으로 악화 원인을 확정하지 않고 환아와 측정 신호·인공기도·회로를 함께 평가해.",
    sourceIds:["aarc","suction"]},
   {id:"rsv-cbg",kind:"blood-gas",title:"CBG · 모세혈 혈액가스분석",availableFromStep:1,
    collectedAt:"악화 인지 이전에 채혈한 가상 결과",sampleType:"capillary",oxygenContext:"당시 FiO₂ 미제시 · 관류 상태와 측정조건 확인 필요",
    preview:"pH 7.28 · PCO₂ 56 mmHg · HCO₃⁻ 25 mEq/L",
    values:[{id:"ph",label:"pH",value:7.28,unit:""},{id:"pco2",label:"PCO₂",value:56,unit:"mmHg"},{id:"hco3",label:"HCO₃⁻",value:25,unit:"mEq/L"}],
    interpretation:"pH 감소와 PCO₂ 상승은 환기 이상을 시사해. CBG PO₂는 동맥혈 PaO₂와 동일한 산소화 지표로 쓸 수 없어. 관류·채혈 상태도 확인해.",
    sourceIds:["aarc_cbg","nice"]}
  ]}
});
const TYPES=new Set(["blood-gas","imaging","observation"]);
export function auditClinicalData(scenario,sources){
 const errors=[],d=scenario.clinicalData;
 if(d===undefined)return errors;
 const fail=(path,reason)=>errors.push({path,reason});
 if(!d||d.modelPolicy!=="reference-only"||typeof d.note!=="string"||d.note.length<20)return [{path:"clinicalData",reason:"독립 가상 검사자료 정책 누락"}];
 if(!Array.isArray(d.panels)||!d.panels.length)return [{path:"clinicalData.panels",reason:"검사자료 없음"}];
 const ids=new Set();
 for(const [i,item] of d.panels.entries()){
  const ref="clinicalData.panels["+i+"]";
  if(!item||!TYPES.has(item.kind)||!item.id||ids.has(item.id)){fail(ref,"자료 종류·ID 누락 또는 중복");continue;}
  ids.add(item.id);
  if(!item.title||!item.preview||!item.collectedAt||!item.sampleType||!item.oxygenContext||!item.interpretation)fail(ref,"검체·시점·조건·해설 누락");
  if(!Number.isInteger(item.availableFromStep)||item.availableFromStep<0||item.availableFromStep>=scenario.steps.length)fail(ref+".availableFromStep","공개 단계 오류");
  if(!Array.isArray(item.sourceIds)||!item.sourceIds.length||item.sourceIds.some(id=>!sources[id]||!scenario.sources.includes(id)))fail(ref+".sourceIds","근거 참조 오류");
  if(item.kind!=="blood-gas"){
   if(!Array.isArray(item.findings)||!item.findings.length)fail(ref+".findings","관찰 내용 누락");
   continue;
  }
  if(!["arterial","capillary"].includes(item.sampleType)||!Array.isArray(item.values)) {fail(ref,"혈액 검체 또는 값 오류");continue;}
  const v=Object.fromEntries(item.values.map(x=>[x.id,x]));
  if(!v.ph||!v.pco2||!v.hco3||item.values.some(x=>!Number.isFinite(x.value)||typeof x.unit!=="string"))fail(ref+".values","pH/PCO₂/HCO₃⁻ 값·단위 오류");
  if(item.sampleType==="capillary"&&item.values.some(x=>/po2/i.test(x.id)))fail(ref+".values","CBG PO₂를 산소화에 사용하면 안 됨");
  if(item.sampleType==="arterial"&&!v.po2)fail(ref+".values","ABGA PaO₂ 누락");
  if(v.ph&&v.pco2?.value>0&&v.hco3?.value>0){
   const calculated=6.1+Math.log10(v.hco3.value/(0.03*v.pco2.value));
   if(Math.abs(calculated-v.ph.value)>0.07)fail(ref+".values","가상 산염기 값들의 일관성 오류");
  }
 }
 return errors;
}
