# v0.6.0 교수자용 LAB 수업 지도·선택지 해설 (DRAFT)

> 대상: 교육자·콘텐츠 검토자. **임상 전문가 감수 전**, 공식 처방·기기 사용 지침 아님. 파일 공개 저장소에서 열람 가능하며 학생용 배포 ZIP에는 넣지 않는다. 앱의 별도 교수자 인증 기능이 아님.
>
> Source of truth: `src/lab-lessons.js` (`LAB_CONTENT_VERSION=0.5.4-d5-a.1`), `src/lab-engine.js`, `src/waveform-model.js`, `src/waveform-compare.js`. 본 문서는 모델 구현 사실과 임상 근거를 구분한다.

## 수업 운영 (제안, 효과 미검증)

권장 순서: 기기 화면의 **설정 / 고정 모니터 / 생성 파형 / CASE 가상 기록** 구별 → CORE 개념 6개 → CORE 10문항 자가 확인 → LAB 중 1개 선택(예상 → 피드백 → 관찰 → 해석 → 복습) → CASE 4개 중 하나 → 전체 복습. LAB과 CASE는 선택 학습이며 학습 진입을 잠그지 않는다. 예상 답 제출 전 관찰 결과·해설은 학생 UI에 노출되지 않는다. 학생이 설정을 바꿀 권한이나 환자의 실제 반응을 예측할 수 있다는 결론을 유도하지 않는다.

## LAB별 선택지 해설 · 오류 사고 점검

### LAB-01 — PEEP 5→8 cmH₂O (ID: `peep`)

목표 `LAB-01-PRESSURE`, `LAB-01-LIMITATION`. **생성 Pressure의 호기말 기준선**과 **실제 폐포·산소화/혈역학의 측정 필요성**을 구분한다.

| 문항/정답 | 선택지 a | 선택지 b | 선택지 c |
|---|---|---|---|
| `LAB-01-P` / **a** | 호기말 압력 기준선 이동: 이 앱의 생성 식에서 PEEP는 기준선 입력 | 세 파형이 모두 동일하게 이동한다는 일반화 오류: Flow/Volume은 다른 단위·계산 규칙 | SpO₂·혈압 자동 상승 주장: 앱 출력에도 없고 임상적 예측도 불가 |
| `LAB-01-I` / **b** | 선이 같으면 폐포 모집/산소화 변화가 없다는 결론은 불가 | 제한된 입력과 생성 규칙이 같은 곡선을 낼 수 있음 | 고정 VTE·SpO₂가 연동된다는 주장 오류 |

디브리핑: "Pressure 기준선이 이동해도 어떤 실제 환자 자료를 추가로 확인해야 할까?" 학생의 정답 근거를 **생성 규칙에 대한 관찰**과 **환자 평가**로 나눠 적는다. 출처: `generator`(구현), `design`(학습 설계), `aarc`(일반 임상 맥락).

### LAB-02 — 설정 f 15→18/min (ID: `rate`)

목표 `LAB-02-TIMING`, `LAB-02-LIMITATION`. **설정 강제호흡 간격**과 **환자 실제 fTOT**를 구별한다.

| 문항/정답 | 선택지 a | 선택지 b | 선택지 c |
|---|---|---|---|
| `LAB-02-P` / **b** | 설정 f가 파형 간격에 전혀 영향이 없다는 해석 오류 | 같은 16초 구간에서 강제호흡 생성 간격이 짧아짐 | 실제 fTOT=설정 f라고 단정할 수 없음 |
| `LAB-02-I` / **c** | 인위적 자발호흡 이벤트를 실제 노력/총호흡수 예측으로 오인 | 고정 참고 fTOT가 설정 f와 자동 일치한다고 오인 | 모델의 강제호흡 간격은 관찰되나 실제 fTOT는 알 수 없음 |

디브리핑: "강제호흡 발생 시점이 조밀해졌다는 사실만으로 환자의 호흡 노력·환기 충분성을 판단할 수 있을까?" 출처 `generator`, `design`, `aarc`.

### LAB-03 — FiO₂ 40→60% (ID: `fio2`)

목표 `LAB-03-MODEL`, `LAB-03-LIMITATION`. **파형 모델이 FiO₂를 사용하지 않는 구현 사실**과 **실제 환자 산소화 반응**을 분리한다.

| 문항/정답 | 선택지 a | 선택지 b | 선택지 c |
|---|---|---|---|
| `LAB-03-P` / **a** | Pressure/Flow/Volume 세 생성 곡선 동일: 이 모델이 FiO₂를 입력으로 사용하지 않음 | FiO₂와 기계적 파형 진폭을 단순 비례시킨 오류 | SpO₂ 자동 예측·표시라는 기능 오인 |
| `LAB-03-I` / **b** | 일치하는 두 선이 실제 환자에서 효과 없음을 증명하지 않음 | 앱은 산소화 반응을 계산하지 않아 그래프로 실제 효과를 판단 불가 | 실제 PB980의 결과를 이 앱의 모형에서 일반화하면 안 됨 |

디브리핑: "두 곡선이 완전히 겹칠 때, *모델이 표시하지 않은 것*과 *환자에게 나타나지 않은 것*은 어떻게 다른가?" 출처 `generator`, `design`, `aarc`.

## CASE 연계 운영

- CASE 01 `orientation`: 설정·측정·고정 예시의 차이를 적용.
- CASE 02 `desaturation`: 산소화 악화 징후와 환자 사정·보고를 연결.
- CASE 03 `mas-neonate`: 정적 X-ray/ABGA 기록을 PB980 성인 참조 화면과 혼동하지 않도록 지도. 선택 행동 `mas-report`는 **비채점**.
- CASE 04 `rsv-infant`: 정적 관찰/CBG의 한계와 기도 사정·팀 보고. 선택 행동 `rsv-airway-report`는 **비채점**.

CASE별 3문항씩 총 12문항과 CORE 10문항만 채점. LAB의 6문항은 점수에 합산하지 않는다. 활동지에도 정답과 평가점수를 포함하지 않는다.

## 출처 추적·감수 체크리스트

| 근거 ID | 구분 | 사용 범위/한계 |
|---|---|---|
| `generator` | 앱 내부 구현 | 생성 파형의 동작만 설명, 환자/펌웨어 검증 아님 |
| `design` | 사용자 승인된 기존 D5 UX | 과제 흐름의 근거, 임상 효과 근거 아님 |
| `aarc` | 임상 일반 맥락 | 환자–인공호흡기 사정 원칙; 앱 수식 검증 아님 |

검토자 확인 필요: ① 각 문항의 해석이 모델 출력과 일치하는가 ② 현장 교육·환자 사정 원칙에 부합하는가 ③ 간호학생의 자율적인 기기 조작을 정당화하지 않는가 ④ CASE의 성인/소아 데이터 경계가 설명되는가 ⑤ 접근성 및 수업 운영 가능성은 실제 참여자에게 평가했는가. **모두 미감수·미시행으로 유지**.

## 참고문헌 (APA 7th)

Goodfellow, L. T., Miller, A. G., Varekojis, S. M., LaVita, C. J., Glogowski, J. T., & Hess, D. R. (2024). AARC clinical practice guideline: Patient-ventilator assessment. *Respiratory Care, 69*(8), 1042–1054. https://doi.org/10.4187/respcare.12007

International Nursing Association for Clinical Simulation and Learning. (n.d.). *Healthcare simulation standards of best practice®*. https://www.inacsl.org/healthcare-simulation-standards

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

위 참고문헌은 일반 임상·교육·접근성 맥락이며 LAB 교육 문항의 임상적 정확도나 학습 효과를 증명하지 않는다.
