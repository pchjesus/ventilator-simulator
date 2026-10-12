# v0.4.1 — 학생 핵심 학습 우선 개편과 PB980 버전별 매뉴얼 검토
Date: 2026-10-12 · Private prototype · 콘텐츠 임상전문가 미감수

## 1. 대상과 핵심 교육 범위
간호대학생의 MICU 등 중환자실 실습 **전** 기초 오리엔테이션 지원이 목표야. 실제 PB980 조작법/의료지침·독립적 처치 교육·역량 인증이 아니야.

**첫 화면 6개 필수 카드:**
1. PEEP — 호기말 양압, 산소화와 혈역학적 변화에 대한 관찰.
2. FiO₂ — 공급 산소 설정과 SpO₂/PaO₂ 측정값의 차이.
3. VTE — **호기 일회호흡량**이란 측정 용어, 폐보호 환기 시 예측체중/조건과 함께 평가.
4. f/fTOT — SIMV에서 설정된 강제호흡수와 실제 총 호흡수 차이.
5. Ppeak — 측정 기도압 표기, 설정 흡기압 Pi와 구분.
6. 환자 우선 사정 — 환자 상태 직접 관찰, 산소화·호흡노력·회로 확인과 신속 보고.

기본 설정 영역은 FiO₂, PEEP, f를 청록색 테두리로 강조해. 나머지 Pi, Ti, PS, V-TRIG은 데이터·버튼·키보드·Accept/Cancel 기능을 **모두 유지**하되 추가 설정이라고 표시해.

고급 모드/구성 설명·정밀 입력/트리거 해상도·회로 조립·PB980 알람 목록은 앱에서 삭제하지 않고 **추가 학습**으로 배치했어. 학생이 기본을 먼저 보고 필요할 때 더 깊게 배울 수 있게 만든 정보 계층이야.

## 2. 근거 수준과 금지할 혼동
- [AARC Clinical Practice Guideline: Patient–Ventilator Assessment (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/): 호흡량·예측체중, PEEP/auto-PEEP, FiO₂, direct bedside assessment, 인공기도·가습 등 중요성. **본 학생용 6개 순서 자체는 저자의 우선순위를 나타내지 않으며 교육 설계상의 판단**이야.
- [Merck Manual Professional · Overview of Mechanical Ventilation](https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/overview-of-mechanical-ventilation): PEEP·흡입 산소 농도 등의 개념과 환자별 위험.
- [Medtronic · PB980 Operator's Manual](https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf): 실제 장비 UI 용어의 참고. **현재 병동에 설치된 버전임은 확인하지 못했음**.
- 실제 임상에서 같은 표시라도 설정값·측정값·환자 상황에 따라 의미가 달라. 이 앱은 고정 모니터 샘플·교육용 그래프만 제공하고 환자의 SpO₂/ABGA/VTE·폐 순응도를 계산하지 않아.

## 3. v0.4.1에 같이 처리한 '다음 패치' — 기기 소프트웨어 버전 차이 조사
근거: [Medtronic 공식 Covidien 제품 매뉴얼 목록](https://www.medtronic.com/covidien/it-it/support/product-manuals.html)에는 PB980 설명서의 소프트웨어 최소 버전별 항목이 있어.
- 7.6.1.0 이상
- 8.0.9.0 이상
- 8.1.0.46 이상
- 8.2.0.54 이상

별도로 [Medtronic PB980 공식 제품 페이지](https://www.medtronic.com/en-us/healthcare-professionals/products/respiratory/mechanical-ventilation/ventilators/puritan-bennett-980-series-ventilator.html)는 **소프트웨어 8.4.4.3 이상에서 HIGH PEEP ALARM 기능의 활성화·비활성화 관련 안내서**를 제공한다고 표기해.

**판정:** 실제 MICU의 PB980 소프트웨어·장착 옵션·기관 지침은 아직 확인되지 않았어. 따라서 이 앱의 경보 교육은 제조사 문헌의 '일반 알람 용어'를 설명하는 수준으로 유지해. 메뉴 위치·우선순위·알람 문구·버튼 동작·발생 지연 시간 등이 모든 버전에서 같다고 가정하지 말고, 기기 일치성을 검증하지 않은 상태에서 실물 조작 교육으로 사용하지 않아.

실제 병원 버전 대조를 완료하려면 승인된 교육자/장비 관리자와 함께 **장비 GUI에 표시된 소프트웨어 버전·성인/NIV/옵션 구성·해당 지역 설명서**를 확인하고 소프트웨어 차이가 필요한 항목을 표기해야 해. 환자 식별정보·기기 일련번호는 이 저장소에 입력하지 않아.

## 4. 화면·상태 회귀 위험과 완화
- **탭 초기 상태 변경:** 기본 화면 = 핵심 개념. 레거시 초기 회로 화면 가정은 브라우저 테스트에서 의도적으로 변경. 회로 및 ALARM은 기존 DOM/코드 유지.
- **추가 학습 접기:** 고급 탭이 활성화된 상태로 메뉴만 닫히면 접근 불가. `toggle` 이벤트로 핵심 화면에 복귀. 바로가기 버튼이 고급 화면을 열면 자동으로 펼쳐져야 해.
- **설정값 강조:** 파라미터 배열 순서·실제 증감/확정 로직 무수정, data-learning-tier 속성과 CSS로만 우선순위 구분.
- **학생/고급 HELP:** 고급 개념은 native details 안에 보관. 기존 설정 ? 버튼으로 이동하면 해당 details를 자동 확장.
- **ALARM 교육:** 실제 이벤트 없음; 매뉴얼 세부사항을 접기/펼치기로 분리하고 설치 버전 '확인되지 않음' 배너 제공.
- **모바일:** 1440px, 360px, 320px 화면에서 핵심 카드/추가 학습/기존 설정 editor가 화면 폭을 벗어나지 않아야 해.

## 5. 승인 상태와 다음 단계
이 버전은 **학생 교육용 프로토타입**이며 전문가가 의료 내용과 문항을 승인하지 않았어. 다음은 병원 기기 실제 버전·매뉴얼 대조와 임상 교육자 확인, 학생 이해도/사용성 파일럿, 후속 모드·폐역학 모델 검증이 필요해.

**관련 소스:** `src/student-learning.js` (교과용 핵심 카드·7개 설정 분류 계약), `src/device-learning.js` (버전별 제품 문서의 존재와 병원 버전 미확인 상태), `src/app.js` (기존 시뮬레이션과 독립 UI).
