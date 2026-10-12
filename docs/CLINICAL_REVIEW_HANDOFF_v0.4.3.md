# Ventilator Simulator v0.4.3 — 교수자 임상 콘텐츠 검토 인계서

작성일: 2026-10-12  
상태: **임상 전문가 미감수 · 승인 없음 · 교사용 검토 초안**  
기준: v0.4.2 FINAL (main `d4f2bf85864718fa9e039410850efea1ed9f9e57`)

## 1. 검토 범위와 제한

- 6개 개념 카드, 10개 핵심 문항, 원래의 CASE 01/02와 6개 CASE 문항이 교육용으로 존재한다.
- v0.4.3은 **기존 10문항의 정답 ID를 변경하지 않음**. 학생에게 단순히 의료적으로 타당해 보이는 표현을 임상적으로 승인했다고 주장하지 않음.
- 대상: 간호대학생 중환자실 실습 **전** 화면·모니터링 수치·환자 사정 기초 학습. 전문 자격시험, 현장 처치 매뉴얼, PB980 조작 검증이 아님.
- 교수자는 정답의 정확성뿐 아니라 *임상적 누락/모호성*, *실습생 업무 범위*, *환자안전*, *설정과 측정의 혼동*을 확인해야 함.
- 환자 실명, 실습기관 환자 자료, 식별정보를 수집·기록하지 않음. 외부 리뷰는 문항 ID와 코드 버전 중심으로 기록.
- AARC/제조사 문헌은 개별 문항의 정답을 직접 검증하는 시험이 아니다. **근거 성격과 추론 수준**을 구분한다.

## 2. 원문 근거의 실제 역할

| 근거 | 원문에서 확인할 수 있는 내용 | 앱 적용 시 주의 |
|---|---|---|
| AARC 2024 Patient–Ventilator Assessment | Pplat/VT·PBW/PEEP·auto-PEEP 평가, FiO₂ 사정, 충분한 자원에서 직접 침상 사정 제안, 인공기도·가습 관리 | 학생의 독자적 처치·모든 문제의 답·기관별 보고 알고리즘을 직접 승인하지 않음 |
| Medtronic PB980 Operator's Manual | 장비 표기·환기 모드·설정/측정값 정의와 구성 범위 참고 | 실제 병원 펌웨어/옵션/기관 프로토콜과 완전 동일하다고 가정하지 않음 |
| Merck Manual Professional | 산소화·환기 기초 개념 및 PEEP 등 일반 생리학 설명 | 환자별 혈역학/SpO₂/PaO₂ 수치를 예측하는 방정식의 근거가 아님 |
| **이 앱 구현 규약** | f 조작에 따른 교육용 파형 변화, 상단 모니터 7개 고정 샘플, 가상 CASE 상태 분리 | **임상 논문도 외부 링크도 아님.** 정적 실행본에는 비공개 GitHub README를 원문 근거인 것처럼 노출하지 않음 |

## 3. 10문항별 검토 매트릭스

문항의 실제 전체 선택지와 정답은 `src/core-quiz.js`에 있으며, 아래는 인계용 핵심 점검 사항이다. **아직 검토 결과는 모두 비어 있다.**

| 문항 ID | 개념/정답 | 정답의 근거 성격 | 교수자에게 확인할 항목 | 검토 |
|---|---|---|---|---|
| peep-meaning | PEEP / A | AARC+Merck → 교육적 적용 | PEEP 효과를 모든 환자에서 보장한다고 읽히지 않는가 | 미실시 |
| peep-circulation | PEEP / B | AARC+Merck → 교육적 적용 | 산소화와 혈역학 함께 관찰, 학생 보고 범위 적절성 | 미실시 |
| fio2-setting | FiO₂ / C | 설정값 일반 원칙 | FiO₂와 SpO₂/PaO₂를 혼동시키지 않는가 | 미실시 |
| fio2-measure | FiO₂ / A | 일반 생리학 설명 | 맥박산소포화도 추정과 동맥혈 산소분압의 차이를 정확히 표현하는가 | 미실시 |
| vte-meaning | VTE / B | PB980 표시 + AARC VT 평가 | 호기 측정값과 설정 목표용적 구별 | 미실시 |
| vte-pc | VTE·PC / C | 설정-반응 관계의 교육적 해석 | 설정 압력만으로 실제 VTE를 단정하지 않는가 | 미실시 |
| rate-distinction | f/fTOT / A | 장비 용어와 교육적 예시 | 15/min·22/min이 **가상 예시**임을 충분히 알리는가 | 미실시 |
| rate-static | 앱 f/fTOT / B | **앱 구현 사실** | 고정 모니터/교육용 파형 분리 구현과 일치하는가 | 미실시 |
| ppeak-pi | Ppeak/Pᵢ / C | PB980 설정·측정 구분 | 병원 PB980 설치 버전과 실제 압력 표기 차이 | 미실시 |
| patient-first | 환자 사정 / B | AARC 일반 원칙에서 학생 역할로 추론 | 악화 시 도움 요청·보고·지도 범위가 임상 지침에 맞는가 | 미실시 |

### 검토 결과 기록 양식 (교수자 기입 전, 빈 양식)

```text
content_version: 0.4.3
reference_commit: [실제 배포 SHA]
item_id:
reviewer_role: [간호학 교수 / 중환자실 교육 담당자 / 환기 전문가]
reviewed_on:
clinical_accuracy: [적절 / 수정 필요 / 보류]
distractor_ambiguity: [없음 / 있음]
student_scope: [적절 / 수정 필요]
evidence_fit: [적절 / 과장·간접 인용 / 누락]
correction_required:
reviewer_decision: [미실시 / 보류 / 수정 요청 / 승인]
signature_or_approval_record:
```

실제 교수자 감수가 이뤄지지 않았다면 `reviewer_decision`은 **미실시**로 유지한다. 개발자가 대신 서명/승인 값을 채우지 않는다. 감수 후 콘텐츠를 수정하면 문항 데이터 버전·승인 범위를 다시 확인한다.

## 4. 코드 기반 QA와 임상 감수의 구분

`auditCoreQuiz()`가 자동으로 확인하는 것은 다음과 같다:
- 8~12문항 범위와 6개 개념의 연결, 문항 ID 유일성
- 정답 선택지 1개, 오답 선택지 오개념·3개 해설, 학습목표 존재
- 외부 HTTPS 근거와 **내부 앱 구현 근거** 분리
- 앱만의 동작을 설명하는 문항의 출처가 내부 구현으로 표기되는지
- 모든 문항 ID에 교수자 확인 질문과 근거 적용 범위가 존재하는지
- 감수 `pending/approved=false` 명시

이러한 구조 검사가 통과해도 임상학적 정확성·문항의 교육측정학적 타당도·학생의 실제 역량을 증명하는 것이 아니다.

## 5. 향후 간호대학생 사용성 파일럿 계획 (미실시)

1. **사전 안내**: 프로그램은 모의 PB980 GUI 참고 학습과 개념 형성평가이며, 실제 의료 결정에 사용하지 못한다고 명시.
2. **수행 과제**: 6개 개념 이해 → 10문항 풀이 → 오개념 카드 복습 후 문제로 복귀 → CASE 01·02 중 1개 진입 → 디브리핑.
3. **관찰 지표**: 독자적으로 다음 단계 탐색 가능 여부, 잘못된 버튼 선택, 설정값/측정값 혼동 사례, 피드백 가독성, 320/360px 스크롤 불편, 재시도 기능 이해.
4. **검토 질문**: "VTE 352는 이 앱에서 실제 계산된 환자 자료인가?" 등 데이터 출처 이해 확인. 실제 환자 응급 처치 능력에 대한 판단은 하지 않음.
5. **자료 보호**: 개인정보·환자정보 수집 금지. 참여자의 동의와 기관 교육연구 절차를 우선 확인한 뒤, 허용된 범위 내 비식별 관찰만 수행.
6. **수정 기준**: 반복적 오해가 발견되면 문구/탐색을 작은 패치로 수정하고, 영향을 받는 CASE/Help/설정·파형 회귀 테스트 재실행.

이 문서는 **파일럿을 계획**하는 자료이지 실제 학습자를 모집하거나 관찰한 결과가 아니다.

## 6. APA 7th 참고문헌

Goodfellow, L. T., Miller, A. G., Varekojis, S. M., LaVita, C. J., Glogowski, J. T., & Hess, D. R. (2024). AARC clinical practice guideline: Patient-ventilator assessment. *Respiratory Care, 69*(8), 1042–1054. https://doi.org/10.4187/respcare.12007

Merck Manual Professional Edition. (n.d.). *Overview of mechanical ventilation*. https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/overview-of-mechanical-ventilation

Medtronic. (n.d.). *Puritan Bennett 980 series ventilator operator's manual*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf
