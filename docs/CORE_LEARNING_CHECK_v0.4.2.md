# v0.4.2 — 핵심 개념 형성평가·CASE 연계 / 문항 근거 추적

작성: 2026-10-12 · 학생 실습 전 교육용 초안 · **임상전문가 미감수 / 승인 없음**

## 1. 목적과 허용 범위
PB980 참고형 기기 UI의 여섯 핵심 개념(PEEP, FiO₂, VTE, f/fTOT, Ppeak/Pᵢ, 환자 우선 사정)을 이해했는지 **10문항 형성학습**으로 확인하고, 오개념을 복습한 뒤 원래 CASE 01/02로 적용하도록 한다. 실제 환자 조작·치료 결정·임상 역량 인증·합격/불합격 평가는 수행하지 않는다. 기존 CASE 2개, 6개 문항, 설정 7종, 상단 고정 모니터 7종, 파형 3종, Help/CIRCUIT/ALARM에 내용 변경이 없다.

## 2. 정보 구조와 이용 흐름
- 기본 탭 **핵심 개념** 내 기존 6개 카드를 읽고 아래 **핵심 개념 학습 확인** 버튼으로 진입한다. 신규 탭을 추가하지 않는다.
- 각 문항: 목표에 연결된 짧은 3지선다 → 답 선택 전 정답/피드백 **비노출** → 선택하면 정답 판단 이유와 **세 선택지 모두의 해설**, 오개념, 근거 링크 → 같은 개념 카드 복습 또는 다음 문제.
- 완료: 맞힌 개수/전체 개수, 틀린 문항의 오개념별 복습 버튼, CASE 01/02 탭으로 이동, 다시 풀기, 공개된 교수자/개발자 검토 미리보기(정답 공개).
- 교수자 미리보기는 완료 후에만 표시되지만 학생 누구나 볼 수 있는 학습 기능이다. **로그인, 권한, 평가 자격이나 공식 승인 기능이 아니다.** 기존 CASE 교수자 미리보기 정책을 변경하지 않는다.
- 문항 10개의 정답은 데이터에 있지만 UI에서는 응답 전 공개하지 않는다. 이것은 정식 시험 보안/접근 통제라는 뜻이 아니다.

## 3. 문항-학습목표-오개념-근거 매트릭스
| ID | 개념 | 학습목표 | 대표 오개념 | 출처/성격 |
|---|---|---|---|---|
| peep-meaning | PEEP | 호기말 양압의 정의와 산소화 가능성 | 높이면 무조건 개선 | AARC+Merck / 교육적 판단 |
| peep-circulation | PEEP | 산소화와 혈역학의 동시 관찰 | SpO₂만 확인 | AARC+Merck / 교육적 판단 |
| fio2-setting | FiO₂ | 설정 산소분율과 SpO₂·PaO₂ 구별 | FiO₂가 환자의 포화도·분압 | AARC+Merck / 일반 원칙 |
| fio2-measure | FiO₂ | SpO₂와 PaO₂ 측정 의미 구별 | 숫자를 서로 바꿔 사용 | AARC+Merck / 교육적 판단 |
| vte-meaning | VTE | 호기 일회호흡량의 측정 개념 | VTE=설정 목표량 | AARC+PB980 / 일반 원칙 |
| vte-pc | VTE | 압력 설정으로 실제 VTE를 확정할 수 없음 | Pᵢ만 알면 실제 VTE 결정 | AARC+PB980 / 교육적 판단 |
| rate-distinction | f/fTOT | 설정 강제호흡수와 총 호흡수 구별 | f=fTOT | AARC+PB980 / 교육적 판단 |
| rate-static | f/fTOT | 앱 내부 설정/파형과 고정 모니터 분리 | 앱 f 변경이 환자 fTOT 변경 | 앱 구현 규약 README / 구현 사실 |
| ppeak-pi | Ppeak | 관찰 최고기도압과 PC 흡기압 설정 구별 | Ppeak와 Pᵢ를 동일시 | AARC+PB980 / 교육적 판단 |
| patient-first | 환자 사정 | 직접 사정과 즉시 지도자 보고 | 정상 숫자면 사정 생략 | AARC / 교육적 판단 |

개별 문항의 원문, 선택지 해설, 오개념 유형과 정답은 \`src/core-quiz.js\`가 **유일한 데이터 원천**이다. 매트릭스는 교육자 검토 편의를 위한 스냅샷이며 코드를 대체하지 않는다.

## 4. 출처·근거 수준·해석의 한계
1. **제조사 기능**: Medtronic PB980 Operator's Manual은 표시·장비 용어 확인용이다. 병원 설치 펌웨어/옵션 미확인, 실제 화면 작동·알람 로직 동일성 미검증.
2. **확립된 일반 사정 원칙**: AARC(2024)는 VT/PBW, PEEP/auto-PEEP, FiO₂, 침상 직접 사정, 기도 상태를 포함한 평가를 권고/제안한다. 이 문항의 특정 문구와 보기 정답을 직접 시험검증하거나 간호학생 업무 범위를 인증한 것은 아니다.
3. **교육적 판단/단순화**: 위험요인·사정·보고 우선순위는 초급 학생을 위한 해석이다. 과도한 PEEP의 영향, 산소화 추론, 실제 응급 상황에서는 환자/기관 지침에 따라 달라진다.
4. **앱 구현 사실**: 상단 모니터는 고정 예시, 파형은 교육용 생성 데이터, CASE는 별도 가상 환자이다. 앱의 f를 바꿔도 실제 SpO₂/PaO₂/VTE/fTOT/Ppeak가 계산되지 않는다.
5. 모든 문항은 review.status=pending, approved=false. 별도의 임상 내용 검토·교육학적 타당도 검증·학생 파일럿이 있어야 한다.

### APA 7th references
Goodfellow, L. T., Miller, A. G., Varekojis, S. M., LaVita, C. J., Glogowski, J. T., & Hess, D. R. (2024). AARC clinical practice guideline: Patient-ventilator assessment. *Respiratory Care, 69*(8), 1042–1054. https://doi.org/10.4187/respcare.12007

Merck Manual Professional Edition. (n.d.). *Overview of mechanical ventilation*. https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/overview-of-mechanical-ventilation

Medtronic. (n.d.). *Puritan Bennett 980 series ventilator operator's manual*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

## 5. 상태 및 회귀 위험 방지
\`src/core-quiz.js\`는 상태 전이/점수/데이터 감사를 담당하는 순수 모듈이며 \`src/app.js\`의 \`coreQuizState\`는 페이지 메모리에서만 존재한다. \`state\`(설정), \`editState\`(미확정 설정), \`waveformTime\`, \`caseState\`, \`reflectionNotes\`, \`alarmAnswers\`과 어떤 공유 쓰기도 하지 않는다. 문항 피드백이 모니터·파형에 반영되지 않는다.

| 상황 | 기대 동작 |
|---|---|
| 페이지 최초 진입 | 핵심 카드 6개, 시작 전 문항 정답·교수자 정답 미리보기 비노출 |
| 선택 후 | 3개 선지 해설·근거 표시, 기존 문제 선택 변경 불가 |
| 탭 이동/복귀 | 문제 번호/선택/피드백 유지 |
| 설정값 초기화/Accept/Cancel | 학습 진행 유지, 기존 기기 조작 그대로 |
| 오개념 카드 복습 | 같은 기존 개념 카드 펼침·키보드 초점 이동 |
| 완료/CASE 이동 | CASE 2개 원래 내용·진행 상태 유지 |
| 다시 풀기 | 핵심 학습 확인만 초기화 |
| 페이지 새로고침 | 핵심 학습 기록 삭제(의도된 비영속성) |
| 320px/360px | 문제/해설/복습 버튼 너비·터치 크기 유지 |
| 내용 구조 오류 | 학습 확인 숨기고 오류 안내(fail closed) |

## 6. 검증 수준
- 자동 단위: 문항·목표·인용/오개념 무결성, 중복/누락/조기 진행 방지, 전체 완료, 독립 상태.
- Chromium 브라우저: 1440/360/320px에서 시작→선택→피드백→탭·리셋 유지→10문항 완료→오개념 복습→CASE 전환; 기존 기존 브라우저 회귀 흐름 유지.
- 구조 검사는 의학적 검증이나 실제 임상 역량 시험의 타당도·신뢰도가 아니다.
- 전문가 서명, 실제 현장 장비 버전 검증, 의료기기 시뮬레이션의 임상 정확도는 미완료.

## 7. 후속 권고
1. 10문항의 객관식 선택지 및 '학생 독자 조작' 범위에 대한 교수자·MICU 교육담당자 독립 감수.
2. 학생의 문제 이해/혼란 빈도를 관찰하는 비식별 사용성 파일럿 후 문항 표현 조정.
3. 테스트 지표가 누적되기 전에는 총점/합격 인증, 환자반응 시뮬레이션 연동, CASE 정답 자동 수정 금지.
