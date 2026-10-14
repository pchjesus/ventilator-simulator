/**
 * Fictional formative examples for undergraduate nursing pre-clinical orientation.
 * These are NOT patient records, live ventilator readings, validated cases, or bedside orders.
 * Expert clinical review and educator piloting are pending.
 */
import {CASE_CLINICAL_DATA} from "./case-clinical-data.js";
import {CASE_ACTION_EXERCISES} from "./case-actions.js";
export const CASE_SOURCES=Object.freeze({
  aarc:{label:"AARC Clinical Practice Guideline: Patient-Ventilator Assessment (2024)",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/"},
  inacsl:{label:"INACSL Healthcare Simulation Standards of Best Practice (2025 개정 사항 포함)",url:"https://www.inacsl.org/healthcare-simulation-standards"},
  merck_mas:{label:"Merck Manual Professional · Meconium Aspiration Syndrome (2025)",url:"https://www.merckmanuals.com/professional/pediatrics/respiratory-problems-in-neonates/meconium-aspiration-syndrome"},
 aha2025:{label:"AHA/AAP 2025 · Neonatal Resuscitation, airway clearing",url:"https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation"},
 nice:{label:"NICE NG9 · Bronchiolitis in children",url:"https://www.nice.org.uk/guidance/ng9/chapter/Recommendations"},
 aarc_cbg:{label:"AARC 2022 · Capillary Blood Gas Sampling in Neonates and Children",url:"https://pubmed.ncbi.nlm.nih.gov/36002161/"},
 suction:{label:"AARC 2022 · Artificial Airway Suctioning",url:"https://pubmed.ncbi.nlm.nih.gov/35078900/"}
});
export const PRECLINICAL_CASES=Object.freeze([
  {
    id:"orientation", level:"입문 · 사전실습",minutes:7,
    contentVersion:"0.3.9", review:{status:"pending",approved:false,note:"중환자실 임상 교육자 및 간호 교수자 검토·기관 지침 대조가 필요함"},
    title:"CASE 01 · 기계환기 환자 첫 인수인계",
    status:"전문가 미감수 · 형성평가 초안",
    premise:"성인 중환자실 실습 첫날, 지도간호사가 기계환기 환자의 장비와 사정 항목을 함께 확인해보자고 해. 아래 숫자는 학습을 위해 만들어진 가상 사례 자료야.",
    vignette:[
      "상황 예시: 의식 상태와 호흡노력은 현재 직접 사정해야 하며, 실제 환자 자료는 제공되지 않음",
      "교육용 설정 예시: SIMV(PC)+PS, FiO₂ 40%, PEEP 5 cmH₂O",
      "화면 상단 Ppeak·VTE·fTOT 값: 앱에 고정된 그림용 수치이며 환자와 연결되지 않음"
    ],
    objectives:[
      {id:"o1",text:"설정값과 측정값의 차이를 구분한다"},
      {id:"o2",text:"기계 수치만이 아닌 환자·기도·회로 사정 항목을 제시한다"},
      {id:"o3",text:"학생의 역할 범위 안에서 확인과 보고를 구분한다"}
    ],
    prebrief:"기기 화면은 참고자료야. 실제 장비 설정 변경은 실습 지도자와 기관 지침에 따라야 하며, 이 사례에서 정답을 골라도 환자·파형 상태가 변하지 않아.",
    debrief:[
      "현재 기계에서 설정값과 환자에게서 확인해야 할 측정값을 어떻게 구분할까?",
      "환자를 직접 사정한다면 기도·호흡양상·산소화에 대해 무엇이 더 필요할까?",
      "지도간호사에게 객관적 관찰과 불확실성을 어떤 순서로 보고할까?"
    ],
    steps:[
      {
        id:"source",objectiveIds:["o1","o2"],sourceIds:["aarc"],evidenceKind:"simulator-contract",evidenceNote:"이 앱의 상단 7개 읽기값이 고정된 예시라는 것은 프로그램 구현 명세이며, AARC 2024 서론의 환자·인공호흡기 직접 사정 원칙과 구분해 해석해야 함",question:"이 웹앱 상단 VTE와 fTOT의 숫자를 어떻게 해석해야 할까?",
        options:[
          {id:"a",label:"현재 가상 환자의 실시간 환기 결과다.",feedback:"이 앱의 상단 값은 고정 예시라서 실시간 환자 데이터를 뜻하지 않아."},
          {id:"b",label:"화면 해석 연습용 고정 예시값이고, 실제 측정 결과를 확인하려면 실제 장비와 환자 사정이 필요하다.",feedback:"맞아. 설정값, 시뮬레이터 그림용 수치, 실제 환자의 측정값을 구분하는 것이 시작이야."},
          {id:"c",label:"설정한 FiO₂ 40%에서 자동 계산된 값이다.",feedback:"FiO₂와 고정 VTE/fTOT는 앱에서 연동되지 않아."}
        ],
        answer:"b",explanation:"AARC는 호흡량·기도압·PEEP 등 환자-인공호흡기 사정을 실제 측정 정보와 환자 상태를 연결해 평가하도록 권고해. 본 앱의 수치·파형은 이에 해당하지 않는 학습 예시야."
      },
      {
        id:"fio2",objectiveIds:["o1"],sourceIds:["aarc"],evidenceKind:"guideline-principle",evidenceNote:"AARC 2024 권고 6의 FiO₂ 사정 원칙을 참고하되, 실제 환자 SpO₂ 또는 PaO₂ 추정으로 단정하지 않는 것은 교육적 해석을 포함함",question:"FiO₂ 40%를 확인했어. 이것만으로 판단할 수 없는 것은?",
        options:[
          {id:"a",label:"설정된 흡입 혼합가스의 산소 비율",feedback:"FiO₂ 설정은 장비가 공급하도록 설정한 산소 농도를 뜻해."},
          {id:"b",label:"환자의 실제 산소화 상태(SpO₂·PaO₂)와 조직 산소 공급이 충분한지 여부",feedback:"맞아. 실제 산소화 상태는 환자 사정과 신뢰할 수 있는 모니터·ABGA 등의 자료를 함께 봐야 해."},
          {id:"c",label:"설정 카드의 산소 농도 단위가 %라는 사실",feedback:"% 표시는 설정값 단위를 읽는 정보야."}
        ],
        answer:"b",explanation:"설정된 FiO₂ 자체는 환자의 실제 SpO₂, PaO₂ 또는 산소 공급 충분성을 증명하지 않아."
      },
      {
        id:"assessment",objectiveIds:["o2","o3"],sourceIds:["aarc"],evidenceKind:"guideline-principle",evidenceNote:"AARC 2024 서론 및 권고 9·13·15의 가습과 인공기도 상태 평가 내용을 참고하고, 학생의 실제 조작 범위는 별도 기관 지침 확인이 필요함",question:"지도간호사와 실습 전 기본 확인을 시작할 때 가장 타당한 접근은?",
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
    contentVersion:"0.3.9", review:{status:"pending",approved:false,note:"임상 악화 징후와 학생 업무범위의 교수자 검토·기관 응급 대응 지침 대조가 필요함"},
    title:"CASE 02 · 산소포화도 감소를 발견했을 때",
    status:"전문가 미감수 · 형성평가 초안",
    premise:"실습 중 성인 기계환기 환자의 산소포화도 수치가 이전보다 떨어지고 호흡노력이 증가하는 가상 상황이 제시됐어. 아래 상황 자료는 실제 기기와 연결되지 않는 별도 교육용 카드야.",
    vignette:[
      "가상 사례 SpO₂ 변화: 97% → 88% (맥박산소측정기 신호 확인 필요)",
      "가상 사례 호흡수: 18회/분 → 30회/분, 흉곽 움직임과 호흡노력 변화 관찰",
      "가상 사례 장비 알람: 화면에 실제 알람을 발생시키지 않음. 현재 환기 설정 및 회로 상태는 아직 평가되지 않음"
    ],
    objectives:[
      {id:"o1",text:"수치 변화와 환자 임상 징후를 함께 판단한다"},
      {id:"o2",text:"실습학생으로서 즉각 보고·도움 요청이 필요한 상황을 구분한다"},
      {id:"o3",text:"설정 변경보다 환자 사정·팀 의사소통이 우선인 이유를 설명한다"}
    ],
    prebrief:"이 사례는 위험 신호 인지와 의사소통 연습이 목적이야. 치료 알고리즘, 응급처치 지침, 실제 알람 대응 훈련을 대신하지 않아. 환자 상태 급변 시 기관의 응급 대응 체계와 지도자의 지시가 우선이야.",
    debrief:[
      "SpO₂ 수치 변화 외에 환자에서 직접 관찰한 객관적인 징후는 무엇인가?",
      "값의 신뢰성 확인과 환자 안전을 위해 무엇을 즉시 보고하고 확인해야 할까?",
      "지도자에게 변화 추세·호흡노력·확인된 사항을 간결하게 어떻게 전달할까?"
    ],
    steps:[
      {
        id:"first",objectiveIds:["o1","o2"],sourceIds:["aarc"],evidenceKind:"educational-inference",evidenceNote:"AARC 2024의 환자 중심 직접 사정 원칙을 바탕으로, 가상 악화 징후 시 현장 지도자에게 즉시 알리는 행동을 교육적으로 구성함",question:"SpO₂ 감소와 호흡노력 증가를 동시에 발견했어. 실습학생의 우선 행동은?",
        options:[
          {id:"a",label:"환자 상태와 측정 신호를 즉시 확인하며 지도간호사/의료진에게 도움을 요청한다.",feedback:"맞아. 환자를 우선 관찰하고 악화 징후를 즉시 공유해야 해. 기관의 응급 대응 체계가 우선이야."},
          {id:"b",label:"수치가 정상으로 돌아오는지 혼자 기다린다.",feedback:"악화 징후가 보이면 지연하지 말고 지도자와 의료진에게 즉시 알려야 해."},
          {id:"c",label:"실습학생이 임의로 인공호흡기 모드를 바꾼다.",feedback:"무감독 설정 변경은 부적절해. 즉각적인 환자 사정과 도움 요청이 우선이야."}
        ],
        answer:"a",explanation:"단일 수치로 원인을 단정하지 않되, 환자 호흡곤란·산소화 저하를 의심할 징후는 신속한 직접 사정과 팀 대응이 필요해."
      },
      {
        id:"verify",objectiveIds:["o1","o3"],sourceIds:["aarc"],evidenceKind:"guideline-principle",evidenceNote:"AARC 2024 서론의 환자·인공기도·인공호흡기 설정/모니터·가습 등을 포괄하는 환자-인공호흡기 사정 정의에 근거함",question:"지도자의 감독 아래 추가 자료를 확인한다면 가장 적절한 묶음은?",
        options:[
          {id:"a",label:"SpO₂ 하나만 반복 확인하고 호흡노력은 생략한다.",feedback:"측정값만으로는 현재 환자 상태를 충분히 알 수 없어."},
          {id:"b",label:"환자 호흡·의식·흉곽 움직임, SpO₂ 신호, 실제 기기 경보와 인공기도·회로 상태를 종합한다.",feedback:"맞아. 환자 중심의 평가와 장비/회로 정보의 일치 여부를 함께 파악해야 해."},
          {id:"c",label:"예시 파형과 고정 모니터 숫자로 원인을 확정한다.",feedback:"앱의 고정 수치와 모의 파형은 실제 상황을 설명하지 못해."}
        ],
        answer:"b",explanation:"AARC 지침은 환자와 인공호흡기·기도를 직접 연결한 사정을 강조해. 실제 상태 악화 시 가능한 확인 범위는 기관 규정 및 지도자의 지시에 따라."
      },
      {
        id:"handoff",objectiveIds:["o2","o3"],sourceIds:["aarc"],evidenceKind:"educational-inference",evidenceNote:"AARC 2024의 포괄적 사정 원칙에 기초한 관찰 사실 보고 교육 사례이며 SBAR 세부 형식은 본 문헌에서 직접 검증한 내용이 아님",question:"즉시 보고할 때 가장 적절한 내용은?",
        options:[
          {id:"a",label:"'수치가 이상해요'만 말하고 이전 수치나 환자 변화를 생략한다.",feedback:"이전 대비 변화와 관찰한 환자 상태를 함께 제시하면 상황 전달이 명확해져."},
          {id:"b",label:"원인을 특정 질환으로 단정해 진단명만 보고한다.",feedback:"아직 자료가 부족해. 진단 단정 대신 관찰 사실과 긴급한 변화를 보고해야 해."},
          {id:"c",label:"SpO₂ 97%→88%, 호흡노력·호흡수 변화와 현재 확인한 상황을 간결히 전달하고 즉시 평가를 요청한다.",feedback:"맞아. 관찰한 변화, 현재 환자 소견, 이미 확인한 정보, 도움 요청을 명료하게 전달해."}
        ],
        answer:"c",explanation:"보고 시 객관적 변화와 사정 내용을 구분해 알리고, 실제 응급 대응은 병원 프로토콜과 의료진의 지시를 따라야 해."
      }
    ],sources:["aarc","inacsl"]
  },
  {
    "id": "mas-neonate",
    "clinicalData":CASE_CLINICAL_DATA["mas-neonate"],
    "population": "newborn",
    "level": "신생아 · NICU",
    "minutes": 8,
    "contentVersion": "0.5.2",
    "review": {
      "status": "pending",
      "approved": false,
      "note": "NICU 의료진·간호교수의 임상 감수 전 교육용 초안"
    },
    "title": "CASE 03 · 태변흡인증후군(MAS) 신생아",
    "status": "전문가 미감수 · 형성평가 초안",
    "premise": "39주 신생아가 태변 착색 양수 출생 후 호흡곤란으로 NICU에서 기관삽관·기계환기 중이야. 지도간호사와 함께 SpO₂ 감소 및 흉곽 움직임 변화를 관찰하고 있어.",
    "vignette": [
      "가상 신생아: 재태연령 39주 · 출생체중 3.1 kg · 생후 3시간 · 태변 착색 양수",
      "가상 상황: SpO₂ 96%→89%로 감소, 흉곽 움직임 변화 · NICU 침습적 환기 중",
      "원본 PB980 참고 화면의 성인 고정 수치·파형과 이 신생아의 가상 수치는 서로 관련 없음"
    ],
    "objectives": [
      {
        "id": "o1",
        "text": "MAS에서 기도 폐쇄·폐 염증·폐표면활성제 손상의 의미를 설명한다"
      },
      {
        "id": "o2",
        "text": "신생아 상태·산소화 추세·기도 및 회로를 사정하고 즉시 보고한다"
      },
      {
        "id": "o3",
        "text": "출생 직후 일률적 흡인 비권고와 삽관 후 필요 기반 기도흡인을 구별한다"
      }
    ],
    "prebrief": "실제 신생아 치료나 기관삽관 술기가 아니라 관찰·판단·보고 연습이야. 출생 직후 소생술과 현재 NICU 삽관 후 기도관리는 서로 다른 상황이며 학생 단독 기기 설정 변경·흡인은 하지 않아.",
    "debrief": [
      "태변 흡인으로 기도 폐쇄나 화학적 폐 손상이 나타나면 어떤 문제가 발생할 수 있을까?",
      "현재 SpO₂ 감소와 함께 환아의 직접 상태·기도·회로에서 확인할 것은 무엇일까?",
      "출생 직후의 일률적 흡인과 삽관 환아의 적응증 기반 흡인은 왜 구별해야 할까?"
    ],
    "sources": [
      "aarc",
      "merck_mas",
      "aha2025",
      "suction"
    ],
    "steps": [
      {
        "id": "mechanism",
        "objectiveIds": [
          "o1"
        ],
        "sourceIds": [
          "merck_mas"
        ],
        "evidenceKind": "guideline-principle",
        "question": "MAS가 신생아의 호흡 기능에 영향을 주는 주요 기전은 무엇일까?",
        "options": [
          {
            "id": "a",
            "label": "태변으로 인한 기도 폐쇄·화학적 폐 손상·표면활성제 기능 장애",
            "feedback": "맞아. 다양한 폐 손상 기전으로 환기와 산소화에 문제가 발생할 수 있어."
          },
          {
            "id": "b",
            "label": "태변 착색이 있으면 폐 기능이 반드시 정상이라는 뜻",
            "feedback": "태변 착색만으로 환자의 폐 기능과 상태를 단정할 수 없어."
          },
          {
            "id": "c",
            "label": "FiO₂ 설정만으로 모든 폐 손상을 확정할 수 있다는 뜻",
            "feedback": "산소 농도 설정 하나만으로 실제 폐 손상이나 환자 반응을 확정할 수 없어."
          }
        ],
        "answer": "a",
        "explanation": "MAS에서는 기도 폐쇄, 화학적 폐손상 및 표면활성제 기능 장애가 나타날 수 있어. 폐고혈압 등도 고려할 수 있지만 앱은 이를 계산하지 않아.",
        "evidenceNote": "Merck Manual에 제시된 MAS 병태생리 원칙을 간호학생 입문용으로 간추린 설명"
      },
      {
        "id": "observe",
        "actionExercise": CASE_ACTION_EXERCISES["mas-neonate"],
        "objectiveIds": [
          "o2"
        ],
        "sourceIds": [
          "aarc",
          "merck_mas"
        ],
        "evidenceKind": "educational-inference",
        "question": "SpO₂가 떨어지고 흉곽 움직임이 변화하는 신생아를 발견했다면?",
        "options": [
          {
            "id": "a",
            "label": "학생이 단독으로 PEEP를 변경해 치료 반응을 확인한다.",
            "feedback": "무감독 환기 설정 변경은 실습학생의 적절한 우선 행동이 아니야."
          },
          {
            "id": "b",
            "label": "환아 상태·측정 신호·인공기도·회로를 확인하고 지도자에게 신속히 알린다.",
            "feedback": "맞아. 환아 사정과 측정 신뢰성 확인, 의료진 도움 요청이 우선이야."
          },
          {
            "id": "c",
            "label": "앱의 고정 VTE 352 mL를 신생아 실측값으로 간주한다.",
            "feedback": "성인 참고용 고정 숫자는 이 가상 신생아의 VTE가 아니야."
          }
        ],
        "answer": "b",
        "explanation": "가상 환아의 산소화 악화 징후는 직접 사정하고 지도자에게 신속히 보고해야 해. 원래 장비의 독립 고정 모니터나 생성 파형을 신생아의 실측 정보로 사용하지 않아.",
        "evidenceNote": "AARC 환자-인공호흡기 사정 원칙을 NICU 학생 역할에 맞춘 교육적 추론"
      },
      {
        "id": "suction",
        "objectiveIds": [
          "o3"
        ],
        "sourceIds": [
          "aha2025",
          "suction"
        ],
        "evidenceKind": "guideline-principle",
        "question": "태변 착색 출생과 이후 삽관 신생아의 흡인 원칙을 가장 잘 구별한 것은?",
        "options": [
          {
            "id": "a",
            "label": "태변 착색 출생이면 기도 폐쇄 여부와 무관하게 항상 정시 흡인한다.",
            "feedback": "출생 직후 일률적 흡인은 권고되지 않으며 삽관 후에도 필요 기반이 원칙이야."
          },
          {
            "id": "b",
            "label": "일률적 흡인을 피해야 하므로 실제 기도 폐쇄도 확인하지 않는다.",
            "feedback": "일률적 흡인 비권고가 실제 기도 폐쇄나 분비물 관찰 금지를 의미하지 않아."
          },
          {
            "id": "c",
            "label": "출생 직후 일률적 흡인은 피하고, 삽관 후에는 임상 징후에 따라 필요성을 평가한다.",
            "feedback": "맞아. 출생 직후 소생술과 이후 인공기도 유지의 지침을 구별해."
          }
        ],
        "answer": "c",
        "explanation": "AHA/AAP 2025는 태변 여부에 따른 출생 직후 일률적 흡인을 권고하지 않아. AARC 2022는 신생아·소아 인공기도 흡인을 필요에 따라 시행하도록 제시해. 학생의 독자적 흡인을 뜻하지 않아.",
        "evidenceNote": "2025 출생 직후 흡인 원칙과 2022 삽관 신생아 필요 기반 흡인 권고의 상황을 명시적으로 구별"
      }
    ]
  },
  {
    "id": "rsv-infant",
    "clinicalData":CASE_CLINICAL_DATA["rsv-infant"],
    "population": "infant",
    "level": "영아 · PICU",
    "minutes": 8,
    "contentVersion": "0.5.2",
    "review": {
      "status": "pending",
      "approved": false,
      "note": "PICU 전문가 및 간호교수의 소아 임상 감수·기관지침 대조 전 초안"
    },
    "title": "CASE 04 · 중증 RSV 세기관지염 영아",
    "status": "전문가 미감수 · 형성평가 초안",
    "premise": "생후 4개월 영아가 중증 RSV 세기관지염으로 PICU에서 기관삽관·기계환기를 받고 있어. 환아의 SpO₂ 추세가 떨어지고 흉곽 움직임과 분비물에 변화가 있어.",
    "vignette": [
      "가상 영아: 생후 4개월 · RSV 세기관지염으로 PICU 치료 중인 일부 중증 상황",
      "가상 징후: SpO₂ 하락 추세와 흉곽 움직임 변화, 분비물 증가 · 원인 미확정",
      "성인형 PB980 참고 화면과 고정 모니터·파형은 이 영아의 환기 자료가 아님"
    ],
    "objectives": [
      {
        "id": "o1",
        "text": "중증 세기관지염 환아의 호흡 상태 악화를 인지하고 신속히 보고한다"
      },
      {
        "id": "o2",
        "text": "삽관 영아의 분비물·인공기도 개방성 및 필요 기반 흡인 개념을 구분한다"
      },
      {
        "id": "o3",
        "text": "가상 소아 사례와 독립 고정 성인형 모니터 표시 예시를 구별한다"
      }
    ],
    "prebrief": "일반적인 세기관지염에서 침습적 환기는 흔한 과정이 아니며 이 사례는 일부 중증 상황을 가정해. 이 앱은 환자 치료 지침이 아니고 실제 기기 설정 조정·흡인을 학생 단독으로 수행하지 않아.",
    "debrief": [
      "환아의 산소화 변화 이외에 임상적 호흡곤란과 호흡부전 가능성을 나타내는 소견은?",
      "분비물 증가 시 환아 상태·인공기도·회로를 어떤 순서로 확인할 필요가 있을까?",
      "의료진에게 보고할 때 직접 관찰과 아직 확인되지 않은 원인을 어떻게 구분할까?"
    ],
    "sources": [
      "nice",
      "suction",
      "aarc",
      "aarc_cbg"
    ],
    "steps": [
      {
        "id": "deterioration",
        "objectiveIds": [
          "o1"
        ],
        "sourceIds": [
          "nice"
        ],
        "evidenceKind": "guideline-principle",
        "question": "이 영아의 SpO₂가 하락하고 흉곽 움직임이 달라지면 학생의 우선 행동은?",
        "options": [
          {
            "id": "a",
            "label": "환아 상태·측정 신호를 확인하며 지도자 및 의료진에게 즉시 알린다.",
            "feedback": "맞아. 환자의 실제 상태와 악화 징후를 확인하고 즉시 도움을 요청해야 해."
          },
          {
            "id": "b",
            "label": "정기 관찰 시간까지 기다리며 추가 사정을 하지 않는다.",
            "feedback": "악화 징후를 보고하는 것을 지연해서는 안 돼."
          },
          {
            "id": "c",
            "label": "학생 스스로 환기 모드나 압력 설정을 변경한다.",
            "feedback": "실습학생의 무감독 기기 설정 조작은 적절하지 않아."
          }
        ],
        "answer": "a",
        "explanation": "NICE 세기관지염 지침은 호흡부전이 의심되거나 중증 호흡곤란이 있을 때 신속한 평가가 중요하다는 원칙을 제시해. 앱의 SpO₂는 독립 가상 사례값이지 실제 기기 계산값이 아니야.",
        "evidenceNote": "NICE NG9 심각한 호흡곤란·호흡부전 위험 신호를 가상 PICU 학습에 적용한 판단"
      },
      {
        "id": "airway",
        "actionExercise": CASE_ACTION_EXERCISES["rsv-infant"],
        "objectiveIds": [
          "o2"
        ],
        "sourceIds": [
          "suction",
          "aarc"
        ],
        "evidenceKind": "guideline-principle",
        "question": "기관삽관 영아에서 분비물 증가를 보았다면 가장 적절한 사정은?",
        "options": [
          {
            "id": "a",
            "label": "증상과 상관없이 매시간 기관흡인을 반드시 시행한다.",
            "feedback": "AARC는 정기 흡인보다 임상적 필요에 따른 흡인을 권고해."
          },
          {
            "id": "b",
            "label": "호흡음·분비물·인공기도 위치·개방성과 실제 회로 상태를 종합한다.",
            "feedback": "맞아. 환아와 기도·회로를 함께 사정하고 지도자와 흡인 필요성을 판단해."
          },
          {
            "id": "c",
            "label": "RSV 진단만으로 분비물과 모든 악화의 원인을 확정한다.",
            "feedback": "진단명이 있어도 환아 상태와 인공기도·회로 문제를 함께 확인해야 해."
          }
        ],
        "answer": "b",
        "explanation": "AARC 2022는 삽관 소아·신생아에게 필요한 경우에만 흡인하는 것을 권고해. 학생은 직접 확인한 상태를 바탕으로 지도자에게 보고하고 독단적으로 기도흡인을 수행하지 않아.",
        "evidenceNote": "AARC 2022 필요 기반 흡인과 2024 포괄적 환자-인공호흡기 사정의 일반 원칙"
      },
      {
        "id": "source",
        "objectiveIds": [
          "o3"
        ],
        "sourceIds": [
          "aarc"
        ],
        "evidenceKind": "simulator-contract",
        "question": "이 사례 중 원본 장비에 표시된 VTE 352 mL의 의미는?",
        "options": [
          {
            "id": "a",
            "label": "해당 영아의 실제 호기 일회호흡량이므로 정상임을 뜻한다.",
            "feedback": "앱의 고정 예시 숫자는 가상 소아 환자의 실측값이 아니야."
          },
          {
            "id": "b",
            "label": "이 영아에게 권고되는 목표 환기량이므로 그대로 입력한다.",
            "feedback": "성인형 화면 예시로 환아의 목표 설정이나 처방을 할 수 없어."
          },
          {
            "id": "c",
            "label": "원본 장비 화면 읽기용 독립 고정값이며 영아 사례와 무관하다.",
            "feedback": "맞아. 가상 환아의 별도 자료와 원본의 고정 모니터를 구별해."
          }
        ],
        "answer": "c",
        "explanation": "VTE 352 mL는 시뮬레이터에 고정된 화면 읽기 숫자이며 영아의 실제 환기량도 권장 수치도 아니야. 현재 케이스의 측정·치료 반응으로 해석하거나 기록해서는 안 돼.",
        "evidenceNote": "이 앱의 MONITOR_REFERENCE가 성인형 기기 참고 독립 고정값이라는 구현 규약"
      }
    ]
  }

]);
export function findCase(caseId){return PRECLINICAL_CASES.find(x=>x.id===caseId)||null;}
