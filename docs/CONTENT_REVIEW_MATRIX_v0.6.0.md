# v0.6.0 콘텐츠 무결성·근거 검토 매트릭스 (기술 감사용)

**기준 SHA:** `704e6401eb35aad9aabdbb726d8d8d5f1455f8c5` · **기준 기능 버전:** v0.5.4 · **상태:** 기술 감사 진행, 임상 전문가 승인 아님.

## 원본 콘텐츠 잠금 목록

아래 문항 ID, 정답, 모델·숫자·고정 모니터는 수정하지 않고 `tests/content-integrity-v060.test.mjs`에서 v0.5.4 계약에 고정한다.

| 구역 | 소스 | ID (원래 순서) | 수량 | 검토 |
|---|---|---|---:|---|
| CORE 개념 | `src/student-learning.js` | `peep`, `fio2`, `vte`, `rate`, `ppeak`, `patient` | 6 | 근거 링크 구조 검사, 전문가 미검토 |
| CORE 퀴즈 | `src/core-quiz.js` | `peep-meaning:a`, `peep-circulation:b`, `fio2-setting:c`, `fio2-measure:a`, `vte-meaning:b`, `vte-pc:c`, `rate-distinction:a`, `rate-static:b`, `ppeak-pi:c`, `patient-first:b` | 10 채점 | `review.approved=false` |
| LAB 실습 | `src/lab-lessons.js` | `peep`, `rate`, `fio2` | 3 | `pending-clinical-review` |
| LAB 문항 | 동일 | `LAB-01-P:a`, `LAB-01-I:b`, `LAB-02-P:b`, `LAB-02-I:c`, `LAB-03-P:a`, `LAB-03-I:b` | 6 비채점 | `review.approved=false` |
| CASE 01 | `src/preclinical-cases.js` | `orientation` → `source:b`, `fio2:b`, `assessment:c` | 3 채점 | `review.approved=false` |
| CASE 02 | 동일 | `desaturation` → `first:a`, `verify:b`, `handoff:c` | 3 채점 | `review.approved=false` |
| CASE 03 | 동일 | `mas-neonate` → `mechanism:a`, `observe:b`, `suction:c` | 3 채점 | `review.approved=false` |
| CASE 04 | 동일 | `rsv-infant` → `deterioration:a`, `airway:b`, `source:c` | 3 채점 | `review.approved=false` |
| 선택 간호 행동 | `src/case-actions.js` | `mas-report:b`, `rsv-airway-report:b` | 2 비채점 | CASE 감수에 포함, 별도 인증/점수 없음 |
| 교육 설정 | `src/sim-model.js` | `fio2`, `peep`, `rate`, `pi`, `ti`, `ps`, `trigger` | 7 | 교육 설정값, PB980 실제 조건부 범위와 다름 |
| 고정 모니터 | `src/sim-model.js` | `PPEAK`, `PMEAN`, `PEEP`, `I:E`, `fTOT`, `VTE`, `V̇E TOT` | 7 | 독립·고정 예시 |
| 생성 파형 | `src/waveform-model.js` | Pressure, Flow, Volume | 3 | 단순 생성 곡선, 임상 측정·예측 아님 |

**총 채점 22문항 = CORE 10 + CASE 12.** LAB 6 및 선택 간호 행동 2는 비채점.

## 문항별 출처·근거의 성격

| 콘텐츠 | source IDs | 범주 |
|---|---|---|
| CORE `peep-meaning` / `peep-circulation` / `fio2-setting` / `fio2-measure` | `aarc`, `merck` | 일반 임상 원칙 및 교육적 추론 |
| CORE `vte-meaning` / `vte-pc` / `rate-distinction` / `ppeak-pi` | `aarc`, `pb980` | 기기 용어/임상 일반 원칙, 앱 모델 검증 아님 |
| CORE `rate-static` | `app` | 앱 내부 동작만 근거 (외부 임상 문헌 아님) |
| CORE `patient-first` | `aarc` | 사정·보고 교육적 추론 |
| LAB `LAB-01-P`, `LAB-02-P`, `LAB-03-P` | `generator`, `design` | 생성 코드 + 승인 D5 UX |
| LAB `LAB-01-I`, `LAB-02-I`, `LAB-03-I` | `generator`, `aarc` | 생성 코드 한계 + 일반 임상 배경 |
| CASE 01/02 6문항 | `aarc` | 앱 구현 규약 / 임상 일반 원칙 / 교육적 추론을 각 `evidenceKind`로 분리 |
| CASE 03 `mechanism`, `observe`, `suction` | `merck_mas`; `aarc`,`merck_mas`; `aha2025`,`suction` | 교육적 사례/임상 참고, 가상 환자 수치 검증 아님 |
| CASE 04 `deterioration`, `airway`, `source` | `nice`; `suction`,`aarc`; `aarc` | 임상 일반 원칙·앱 정보 출처 구별 |
| CASE 03/04 선택 행동 | `aarc`,`merck_mas`; `aarc`,`suction`,`aarc_cbg` | 학생의 관찰·보고용 비채점 교육적 판단 |

근거의 *존재/HTTPS/ID/분류* 검사는 기술적으로 가능하지만, 링크 내용이 주장과 맞는지 또는 실제 의료행위에 적용 가능한지는 전문가가 별도로 감수해야 한다. 모든 `pending`/미감수 표시를 유지한다. 출처 검토에는 `src/core-quiz.js CORE_REVIEW_GUIDE`, `src/preclinical-cases.js evidenceNote`, `src/lab-lessons.js LAB_SOURCES`의 세부 원문을 우선한다.

## 명시적 빈칸/미검토

- 문항별 독립 임상 전문가 서명 및 평가: **미검토**.
- 특정 PB980 실물/펌웨어 일치 여부: **미검토**.
- 실제 교육자·학생 사용성, 스크린리더·실물 모바일 결과: **미실시**.
- 모니터 7개는 고정 수치이며 생성 파형·CASE와 연동되는 생리적 근거가 **없음**.
- `CASE 03/04`의 X-ray/ABGA/CBG는 별도 가상 기록; 임상 측정이라 표기 금지.
- `src/education-content.js`의 추가 도움말 및 ALARM: 원문 보존, 근거/실물 기기 상세 임상 감수 **미검토**.
- 학생 활동지 출력 형식 및 별도 학습실 이동 UX: **v0.6.0 B+ 초안의 두 미승인 결정**, 사용자 선택 필요.

## 기술 감사 방법

`npm run check` 및 `npm test`에서 `tests/content-integrity-v060.test.mjs`를 실행하여 기존 감사 함수와 고정 계약 스냅샷을 대조한다. 정답/문항 ID를 새 버전에 맞게 임의 변경하여 테스트를 통과시키면 안 된다. 모델 변경 없이 읽기 전용 화면과 교수자 자료만 추가하는 것이 본 범위다.

## 참고문헌 (APA 7th)

Goodfellow, L. T., Miller, A. G., Varekojis, S. M., LaVita, C. J., Glogowski, J. T., & Hess, D. R. (2024). AARC clinical practice guideline: Patient-ventilator assessment. *Respiratory Care, 69*(8), 1042–1054. https://doi.org/10.4187/respcare.12007
