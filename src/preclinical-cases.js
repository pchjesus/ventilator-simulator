/**
 * Fictional formative examples for undergraduate nursing pre-clinical orientation.
 * These are NOT patient records, live ventilator readings, validated cases, or bedside orders.
 * Expert clinical review and educator piloting are pending.
 */
export const CASE_SOURCES=Object.freeze({
  aarc:{label:"AARC Clinical Practice Guideline: Patient-Ventilator Assessment (2024)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/"},
  inacsl:{label:"INACSL Healthcare Simulation Standards: Simulation Design (2021)",url:"https://doi.org/10.1016/j.ecns.2021.08.009"}
});
export const PRECLINICAL_CASES=Object.freeze([
  {
    id:"orientation", level:"입문 · 사전실습",minutes:7,
    title:"CASE 01 · 기계환기 환자 첫 인수인계",
    status:"전문가 미감수 · 형성평가 초안",
    premise:"성인 중환자실 실습 첫날, 지도간호사가 기계환기 환자의 장비와 사정 항목을 함께 확인해보자고 해. 아래 숫자는 학습을 위해 만들어진 가상 사례 자료야.",
    vignette:[
      "상황 예시: 의식 상태와 호흡노력은 현재 직접 사정해야 하며, 실제 환자 자료는 제공되지 않음",
      "교육용 설정 예시: SIMV(PC)+PS, FiO₂ 40%, PEEP 5 cmH₂O",
      "화면 상단 Ppeak·VTE·fTOT 값: 앱에 고정된 그림용 수치이며 환자와 연결되지 않음"
    ],
    objectives:[
      "설정값과 측정값의 차이를 구분한다",
      "기계 수치만이 아닌 환자·기도·회로 사정 항목을 제시한다",
      "학생의 역할 범위 안에서 확인과 보고를 구분한다"
    ],
    prebrief:"기기 화면은 참고자료야. 실제 장비 설정 변경은 실습 지도자와 기관 지침에 따라야 하며, 이 사례에서 정답을 골라도 환자·파형 상태가 변하지 않아.",
    steps:[
      {
        id:"source",question:"이 웹앱 상단 VTE와 fTOT의 숫자를 어떻게 해석해야 할까?",
        options:[
          {id:"a",label:"현재 가상 환자의 실시간 환기 결과다.",feedback:"이 앱의 상단 값은 고정 예시라서 실시간 환자 데이터를 뜻하지 않아."},
          {id:"b",label:"화면 해석 연습용 고정 예시값이고, 실제 측정 결과를 확인하려면 실제 장비와 환자 사정이 필요하다.",feedback:"맞아. 설정값, 시뮬레이터 그림용 수치, 실제 환자의 측정값을 구분하는 것이 시작이야."},
          {id:"c",label:"설정한 FiO₂ 40%에서 자동 계산된 값이다.",feedback:"FiO₂와 고정 VTE/fTOT는 앱에서 연동되지 않아."}
        ],
        answer:"b",explanation:"AARC는 호흡량·기도압·PEEP 등 환자-인공호흡기 사정을 실제 측정 정보와 환자 상태를 연결해 평가하도록 권고해. 본 앱의 수치·파형은 이에 해당하지 않는 학습 예시야."
      },
      {
        id:"fio2",question:"FiO₂ 40%를 확인했어. 이것만으로 판단할 수 없는 것은?",
        options:[
          {id:"a",label:"설정된 흡입 혼합가스의 산소 비율",feedback:"FiO₂ 설정은 장비가 공급하도록 설정한 산소 농도를 뜻해."},
          {id:"b",label:"환자의 실제 산소화 상태(SpO₂·PaO₂)와 조직 산소 공급이 충분한지 여부",feedback:"맞아. 실제 산소화 상태는 환자 사정과 신뢰할 수 있는 모니터·ABGA 등의 자료를 함께 봐야 해."},
          {id:"c",label:"설정 카드의 산소 농도 단위가 %라는 사실",feedback:"% 표시는 설정값 단위를 읽는 정보야."}
        ],
        answer:"b",explanation:"설정된 FiO₂ 자체는 환자의 실제 SpO₂, PaO₂ 또는 산소 공급 충분성을 증명하지 않아."
      },
      {
        id:"assessment",question:"지도간호사와 실습 전 기본 확인을 시작할 때 가장 타당한 접근은?",
        options:[
          {id:"a",label:"모니터의 숫자만으로 환자 상태가 양호하다고 기록한다.",feedback:"수치 단독 판단은 환자 상태와 측정 신뢰성을 빠뜨릴 수 있어."},
          {id:"b",label:"학생이 임의로 PEEP와 압력 설정을 조정해 반응을 확인한다.",feedback:"실제 기기 설정 조정은 학생의 독립적 실습 행동으로 가정하면 안 돼."},
          {id:"c",label:"환자 호흡 양상, 산소화 추세, 인공기도·회로 상태를 지도자와 함께 확인한다.",feedback:"맞아. 실제 환자 사정을 중심으로 기기·기도·회로를 함께 확인해."}
        ],
        answer:"c",explanation:"AARC의 환자-인공호흡기 사정 지침은 기도 고정, 적절한 가습, PEEP, 환기량 등의 평가를 포함해. 구체적 검사·조작은 현장 지도자와 기관 지침을 우선해."
      }
    ],sources:["aarc","inacsl"]
  },
  {
    id:"desaturation",level:"입문 · 변화 인지",minutes:8,
    title:"CASE 02 · 산소포화도 감소를 발견했을 때",
    status:"전문가 미감수 · 형성평가 초안",
    premise:"실습 중 성인 기계환기 환자의 산소포화도 수치가 이전보다 떨어지고 호흡노력이 증가하는 가상 상황이 제시됐어. 아래 상황 자료는 실제 기기와 연결되지 않는 별도 교육용 카드야.",
    vignette:[
      "가상 사례 SpO₂ 변화: 97% → 88% (맥박산소측정기 신호 확인 필요)",
      "가상 사례 호흡수: 18회/분 → 30회/분, 흉곽 움직임과 호흡노력 변화 관찰",
      "가상 사례 장비 알람: 화면에 실제 알람을 발생시키지 않음. 현재 환기 설정 및 회로 상태는 아직 평가되지 않음"
    ],
    objectives:[
      "수치 변화와 환자 임상 징후를 함께 판단한다",
      "실습학생으로서 즉각 보고·도움 요청이 필요한 상황을 구분한다",
      "설정 변경보다 환자 사정·팀 의사소통이 우선인 이유를 설명한다"
    ],
    prebrief:"이 사례는 위험 신호 인지와 의사소통 연습이 목적이야. 치료 알고리즘, 응급처치 지침, 실제 알람 대응 훈련을 대신하지 않아. 환자 상태 급변 시 기관의 응급 대응 체계와 지도자의 지시가 우선이야.",
    steps:[
      {
        id:"first",question:"SpO₂ 감소와 호흡노력 증가를 동시에 발견했어. 실습학생의 우선 행동은?",
        options:[
          {id:"a",label:"환자 상태와 측정 신호를 즉시 확인하며 지도간호사/의료진에게 도움을 요청한다.",feedback:"맞아. 환자를 우선 관찰하고 악화 징후를 즉시 공유해야 해. 기관의 응급 대응 체계가 우선이야."},
          {id:"b",label:"수치가 정상으로 돌아오는지 혼자 기다린다.",feedback:"악화 징후가 보이면 지연하지 말고 지도자와 의료진에게 즉시 알려야 해."},
          {id:"c",label:"실습학생이 임의로 인공호흡기 모드를 바꾼다.",feedback:"무감독 설정 변경은 부적절해. 즉각적인 환자 사정과 도움 요청이 우선이야."}
        ],
        answer:"a",explanation:"단일 수치로 원인을 단정하지 않되, 환자 호흡곤란·산소화 저하를 의심할 징후는 신속한 직접 사정과 팀 대응이 필요해."
      },
      {
        id:"verify",question:"지도자의 감독 아래 추가 자료를 확인한다면 가장 적절한 묶음은?",
        options:[
          {id:"a",label:"SpO₂ 하나만 반복 확인하고 호흡노력은 생략한다.",feedback:"측정값만으로는 현재 환자 상태를 충분히 알 수 없어."},
          {id:"b",label:"환자 호흡·의식·흉곽 움직임, SpO₂ 신호, 실제 기기 경보와 인공기도·회로 상태를 종합한다.",feedback:"맞아. 환자 중심의 평가와 장비/회로 정보의 일치 여부를 함께 파악해야 해."},
          {id:"c",label:"예시 파형과 고정 모니터 숫자로 원인을 확정한다.",feedback:"앱의 고정 수치와 모의 파형은 실제 상황을 설명하지 못해."}
        ],
        answer:"b",explanation:"AARC 지침은 환자와 인공호흡기·기도를 직접 연결한 사정을 강조해. 실제 상태 악화 시 가능한 확인 범위는 기관 규정 및 지도자의 지시에 따라."
      },
      {
        id:"handoff",question:"즉시 보고할 때 가장 적절한 내용은?",
        options:[
          {id:"a",label:"'수치가 이상해요'만 말하고 이전 수치나 환자 변화를 생략한다.",feedback:"이전 대비 변화와 관찰한 환자 상태를 함께 제시하면 상황 전달이 명확해져."},
          {id:"b",label:"원인을 특정 질환으로 단정해 진단명만 보고한다.",feedback:"아직 자료가 부족해. 진단 단정 대신 관찰 사실과 긴급한 변화를 보고해야 해."},
          {id:"c",label:"SpO₂ 97%→88%, 호흡노력·호흡수 변화와 현재 확인한 상황을 간결히 전달하고 즉시 평가를 요청한다.",feedback:"맞아. 관찰한 변화, 현재 환자 소견, 이미 확인한 정보, 도움 요청을 명료하게 전달해."}
        ],
        answer:"c",explanation:"보고 시 객관적 변화와 사정 내용을 구분해 알리고, 실제 응급 대응은 병원 프로토콜과 의료진의 지시를 따라야 해."
      }
    ],sources:["aarc","inacsl"]
  }
]);
export function findCase(caseId){return PRECLINICAL_CASES.find(x=>x.id===caseId)||null;}
