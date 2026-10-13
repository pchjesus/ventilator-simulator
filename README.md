# Ventilator Simulator — v0.5.0 FINAL (교육용 베타)

> **다음 개발 준비:** [v0.6.0 확정 UX/구현 명세](docs/V0.6.0_APPROVED_UX_IMPLEMENTATION_SPEC.md) · [v0.5.1→v0.6.0 단계별 구현/회귀 테스트 실행계획](docs/V0.5.1_TO_V0.6.0_IMPLEMENTATION_PLAYBOOK.md) · [새 채팅에서 v0.5.1 구현 시작하기](docs/NEW_CHAT_START_v0.5.1.md). 사용자 D1~D5=A 승인. 이 문서는 차기 개발 계획이며 현재 실행본은 **v0.5.0 FINAL**이다.


## v0.5.0 FINAL — 교육용 베타 (2026-10-13)

**현재 실행 버전:** v0.5.0 FINAL. 기존 v0.4.6 기능을 유지하면서 초보 간호학생 중심으로 화면·설명·CASE·복습을 통합했다.

**권장 학생 학습 흐름:** 화면 용어·자료 출처 구분 → 6개 핵심 개념 카드와 심화 약어 → 10문항 핵심 개념 형성평가 → CASE 01·02 중 사례 선택 → 이유·학습목표별 복습·디브리핑.

**모바일:** 기본 학습에서는 학습 패널이 먼저 나오고 PB980 참고형 장비는 “장비 화면 펼치기”로 볼 수 있다. “장비 탐색” 선택 시 본래 장비 화면 전체를 표시한다. 화면 배치 3종은 넓은 화면에서 제공하며 좁은 화면에서는 한 열로 표시된다. 설정·퀴즈·CASE 세션 상태는 표시 전환 때문에 초기화되지 않는다.

**기존 기능 보존:** 7개 설정값, 길게 누르기·직접 입력·항목별 기본값·전체 초기화·Pending/Accept/Cancel, 장비/빠른 학습 조작, 3개 파형과 분석/재생/정지/격자, 고정 모니터 7개, 핵심 개념 6개·10문항, CASE 01·02 각 3문항·세션 재개, ALARM/CIRCUIT/Help/교수자 미리보기.

**자료 해석을 엄격하게 구별:** ① 학습자가 조정하는 설정값 ② 하나의 동시 환자 자료가 아닌 독립 고정 모니터 표시 예시 ③ 일부 설정과 연동된 단순화된 생성 파형 ④ 설정/파형과 별개인 CASE의 가상 환자 정보. 실제 SpO₂·PaO₂·VTE 예측, 실시간 알람, 생리학적 환자 모델은 **구현하지 않음**.

**교수자/검증 자료:** [교수자 수업 운영 초안](docs/FACULTY_CLASS_GUIDE_v0.5.0_DRAFT.md) · [확정된 UX·구현 추적](docs/V0.5.0_APPROVED_STUDENT_UX_IMPLEMENTATION.md) · [사용성 파일럿 계획(미시행)](docs/V0.5.0_USABILITY_PILOT_PROTOCOL.md) · [TEST_REPORT](TEST_REPORT.md). 정답 포함 교수자 자료는 **웹 실행 ZIP에 포함되지 않으며**, 별도 문서가 진정한 접근권한 인증을 제공하지 않는다.

**검증 한계:** GitHub CI에서 자동 구문/단위/Chromium/정적 ZIP을 점검하지만, 실제 학생 파일럿·교수자 교육효과 평가·임상 전문 감수·현장 PB980 장비 검증 및 실제 휴대전화 시험은 아직 실시되지 않았다. 치료 결정이나 실물 장비의 정식 작동법을 대체하지 않는다.

---

간호학생을 위한 **PB980(Puritan Bennett 980) 참고형 웹 시뮬레이터** 초기 실행본.
실제 장비의 화면 구성 학습을 목표로 하지만, 임상 사용이나 기계 조작 훈련을 대체하지 않는다.

## 실행
- 파일 전체를 웹 서버에 올려서 `index.html`을 연다.
- 로컬: Python 3 설치 시 `python -m http.server 8077` 후 http://localhost:8077 방문
- 테스트: Node.js 18 이상에서 `npm test`, `npm run check`
- npm 의존성 없음. 브라우저 ES modules 사용. `file://` 직접 실행은 권장하지 않음.

## 초기 구현 이력 (v0.4.6 기준)
- PB980 스타일의 화면 구획: 상단 monitoring, 중앙 pressure/flow/volume 파형, 하단 SIMV(PC)+PS 설정 영역
- 화면 안에서 FiO₂, PEEP, f, Pi, Ti, PS, V-TRIG 값 증감 및 기본값 초기화
- 각 설정 옆 `?` 도움말, 오른쪽 CIRCUIT 개념 학습 탭(부품/조립 개요/완성 개념도)
- 화면이 작은 기기에서 우측 패널이 아래로 이동하는 반응형 레이아웃

## 구현하지 않은 것 (중요)
- monitoring 7종은 **사진을 참고한 고정 예시값**이고, waveform은 **독립된 교육용 시간 모델**로 움직인다. 파형은 환자 측정값이 아니며 실제 생리 반응을 예측하지 않는다.
- 설정 범위/증감 단위는 **UI 검증용 예시**이며 PB980 공식 장비 사양으로 검증된 값이 아니다.
- 완성 회로는 **개념도**이며 PB980의 실제 연결 절차나 부품 구성도 아니다.
- 임상 정확도, 실제 장비의 경보 동작, 모바일 실기기·시각적 일치 검증은 미완료.

## 설계·버전 문서
- [PROJECT_SPEC.md](PROJECT_SPEC.md)
- [AGENTS.md](AGENTS.md)
- [docs/ROADMAP.md](docs/ROADMAP.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [DEVLOG.md](DEVLOG.md)
- [TEST_REPORT.md](TEST_REPORT.md)

## GitHub Pages (optional, currently deferred)
정적 파일이므로 별도 API/DB 없이 GitHub Pages로 배포할 수 있다.
현재 저장소가 **private**이므로 공개 전환 또는 유료 플랜/비공개 Pages 지원 여부 확인은 사용자 결정 사항이다.
저장소를 임의로 public으로 전환하지 않는다. Pages를 활성화하더라도 배포 URL과 접속 권한을 별도 확인해야 한다.

## Optional future public website preparation
GitHub Actions now checks Chromium desktop/mobile behavior and uploads screenshots. After all checks pass, a separate `pb980-web-only` artifact contains only the browser-runnable site files. No lecture image or project working notes are shipped in that bundle.
See [Deployment guide](docs/DEPLOYMENT.md) for the public-repo setup and acceptance steps. The current private repository is **not** itself a verified publicly deployed URL.

## Private GitHub review — current workflow
No public website is being published. Browse the **Code** tab and use **Actions → Ventilator simulator checks** to run tests manually and download desktop/mobile screenshot artifacts.
Read [Private GitHub review](docs/PRIVATE_GITHUB_WORKFLOW.md) for step-by-step instructions and local execution.
See [PB980 reference audit](docs/PB980_REFERENCE_AUDIT.md) for what is and is not manufacturer-verified.
v0.2.2 improves keyboard-focus continuity when adjusting settings and adds a 320px narrow-screen regression check.

## v0.3.0 — 움직이는 교육용 파형
- Pressure/Flow/Volume vs Time 파형을 자동으로 이동시키며 일시정지·재생할 수 있다.
- 강제 흡기/예시 자발 흡기/호기 구간의 색상을 구분한다.
- PEEP, Pi, PS, f, Ti를 바꾸면 파형을 다시 계산한다. FiO2와 V-TRIG는 숫자만 바뀌고 파형에는 연결되지 않는다.
- 파형의 용적·유량은 서로 도함수 관계를 갖도록 구성했지만 가상 순응도와 자발호흡 이벤트는 **설명용으로 임의 설정**한 것이다.
- PB980의 실제 파형 동작·임상 적용을 재현한다는 의미는 아니다.
- [파형 모델 가정](docs/WAVEFORM_MODEL_v0.3.md) 문서를 참고해.

## v0.3.1 — 파형 무결성·접근성 보완
- 호기말 Volume과 Flow가 함께 0으로 수렴하도록 교육용 파형 계산을 수정하고 유량-용적 미분 관계를 단위 테스트로 확인한다.
- 기기 접근성 설정의 **동작 줄이기 (prefers-reduced-motion)** 가 켜져 있으면 파형을 멈춘 채 시작한다. 학생이 Resume으로 재생을 직접 선택할 수 있다.
- Pause 중 화면 재그리기를 줄여 불필요한 연산을 피하며, 설정값을 바꾸면 해당 파형은 여전히 갱신된다.
- 외부 호출에서 비정상 호흡수/흡기시간 등 입력을 전달해도 과도한 반복이나 유효하지 않은 파형 생성을 피하도록 기본 검증을 추가한다.
- 위 변경은 **교육용 모델의 수학적 일관성 개선**일 뿐 환자 생리모델을 임상적으로 검증했다는 의미는 아니다.


## v0.3.2 — PB980 GUI 외형 정밀화
- 공식 매뉴얼의 GUI 영역 구분과 PB980 실물 사진을 참고하여 상단 청색 Vital Patient Data banner, 중앙 검은 waveform area, 좌측 MENU, 하단 청색 settings area, 우하단 고정 메뉴 아이콘을 재배치했어.
- 짙은 청색 베젤, 중앙 회전 조작부와 물리 키를 외형 참고용으로 추가했어(기계 조작 기능은 없음).
- Home/Circuit 및 Help 교육용 단축키 2개를 기존 학습 패널과 연동했어.
- 기존 증감, 도움말, 초기화, 파형, reduced-motion, 반응형 배치를 유지했어.
- [PB980 UI 비교·남은 차이](docs/PB980_UI_COMPARISON_v0.3.2.md) 참조. 실물과 완전 동일한 외형이나 임상 동작이라고 주장하지 않아.

## v0.3.3 — PB980 GUI geography and manufacturer reference
- The example Vital Patient Data band leads the display; clearly static breath-type label, left-side waveform legends/scales, and a below-waveform educational prompt resemble the documented GUI layout more closely.
- Current-settings mode grouping and explicit 'Study / EDU' and 'Edu Help' labels distinguish web learning shortcuts from clinical PB980 operation.
- Each settings `?` tab shows official adult PC/PS reference range and resolution (Operator's Manual Table 11-9) **separately from the unchanged educational step button range/precision**.
- All existing model behavior, circuit learning, reset, keyboard, reduced-motion and responsive controls are preserved.
- OEM firmware-identical pixel layout, real conditional parameter limits and real patient measurement models are **not validated**. See [v0.3.3 comparison](docs/PB980_UI_COMPARISON_v0.3.3.md).

## v0.3.4 — Public PB980 reference cross-check
- Based on an openly accessible manufacturer touchscreen quick reference (©2015), move the *fixed example* breath-type C marker to the left side of the patient-data strip, as shown in normal-ventilation public photos. This marker is NOT linked to breath events.
- Add the missing ninth physical control legend, Alarm Silence, as a purely non-interactive illustrative bezel key. None of the bezel keys have clinical actions.
- The public Korean SIMV/PC/PS/V-TRIG photograph is useful for future **lower settings area** geometry, but its firmware version is unconfirmed; no pixel-exact claim is made, no externally copyrighted screenshot is copied into this repository.
- Keep all original teaching setting steps, waveform, Help, CIRCUIT, pause, reset, mobile responsiveness unchanged. Future PB980-like `select → turn → accept` editor should be an optional explicitly authorized UX feature; no button logic was altered in this patch.

## v0.3.5 — Two educational parameter-control workflows
- Default **PB980 참고형**: select a setting field, adjust a **pending** educational value using +/− (or arrow keys), then **Accept** to commit or **Cancel / Esc** to discard. Press Enter when Accept is focused. Focus returns to the selected field.
- Optional **빠른 학습 ±**: restores all original small quick-study increments, immediate waveform updates and keyboard-repeat behavior. Switching modes preserves committed settings. No pending edit can leak into quick study.
- The new native dialog contains a distinct committed vs pending readout, device-inspired dial illustration, and a whole-settings reset action; on narrow screens it appears as a bottom sheet. It is **not** a PB980 firmware or manufacturer-control emulator.
- While a pending value is being edited the waveform continues on *committed* settings; after Accept the teaching graph is recomputed once. The static top patient-monitoring examples remain disconnected.
- Manufacturer-reported limits/resolutions in ? help remain **separate** from the existing safe classroom UI bounds. A real PB980 has conditional limits, Accept All, alarms, and other interlocks that this app does not simulate.
- See [dual controls and validation](docs/DUAL_CONTROL_IMPLEMENTATION_v0.3.5.md).

## v0.3.6 — 간호·의학 설명 및 학습용 팝업
- 상단 **▤ 설명서**: 7단계 사용법, 화면 구성, PB980 참고형 Accept/Cancel, 빠른 학습 ±, 파형·회로·한계를 한 화면에서 읽을 수 있는 팝업.
- 상단 **◷ 패치 내역**: 버전별 UI/UX / 기능 추가 / 간호·의학 교육 / 안정성·테스트 / 문서·근거 카테고리별 변경 내역과 필터.
- 두 팝업은 **X, 외부 클릭·터치, Esc**로 닫히고 키보드 포커스가 원래 상단 버튼으로 돌아간다. 360/320px에서 스크롤 가능한 모바일 시트로 표시한다.
- 오른쪽 **? 설명**: 7개 기기 설정과 SIMV, 파형, 모니터링, 간호 사정, ABGA 관계, 회로 등 **13개 학습 주제**에서 기초→임상적 고려→간호 관찰→시뮬레이터 한계→공개 근거 링크로 이어지는 구조.
- 근거: Medtronic PB980 Operator's Manual (기종별 설명), AARC 2024 환자-인공호흡기 사정 지침, Merck Manual Professional (일반 의학 설명). 기기의 임상 동작을 검증한 것은 아니며 실제 처방·ABGA·환자 반응을 계산하지 않는다.
- 동작 상태·모델/파형 엔진·기존 v0.3.5 이중 설정 방식에는 변경 없음. 팝업 설명 데이터는 `src/education-content.js`, 변경 내역은 `src/release-notes.js`에서 관리한다.
- 세부 문서: [근거 검토](docs/CLINICAL_EDUCATION_v0.3.6.md) · [팝업 UI 사양](docs/OVERLAYS_v0.3.6.md).

## v0.3.7 — 정보 우선 UI와 파형 분석
- PB980의 **상단 patient data → 모드 및 파형 → prompt → 현재 설정** 구조를 유지하면서, 외형 장식은 중립 색상으로 절제하고 숫자/레이블/버튼 대비와 크기를 개선했다.
- 동작 추가: **▦ 격자**는 파형 배경 격자의 표시만 전환한다. 설정, 데이터 및 시간 진행에는 영향을 주지 않는다.
- **⌖ 파형 분석**을 누르면 현재 교육용 파형이 정지되며 **3개의 SVG 커서**가 하나의 선택 시점을 가리킨다. 파형을 터치·클릭하거나 시간 슬라이더(키보드 방향키 포함)를 움직이면 해당 **생성 예시 압력/유량/용적/단계**가 표시된다.
- 분석 모드 종료 시 진입 전 재생/정지 상태로 돌아간다. 분석 중 **Resume**은 분석 모드를 종료하고 재생한다.
- **중요한 한계:** 파형 커서의 수치는 시뮬레이터가 그린 시간곡선의 샘플 값이다. PB980 실측자료도, 고정 환자 모니터 예시값도, ABGA/SpO₂ 계산값도 아니다.
- 근거: [Medtronic PB980 operator manual](https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf) 파형 일시정지·커서·격자 및 [제조사 교육 비디오](https://www.medtronic.com/en-us/healthcare-professionals/products/respiratory/mechanical-ventilation/ventilators/puritan-bennett-980-series-ventilator/in-service-videos.html). 본 앱은 제조사의 조작 동작을 그대로 재현하는 것이 아닌 간략 교육 모드다.
- 새 순수 계산 보조: `src/waveform-inspector.js`; `src/waveform-model.js` 및 `src/setting-editor.js`는 수정하지 않았다.

## v0.3.8 — 실습 전 CASE 학습 첫 탑재
- 오른쪽 **CASE 학습** 탭: 성인 중환자실 간호대학생 사전 실습 오리엔테이션을 위한 **가상 시나리오 2종** (기계환기 환자 인수인계 / SpO₂ 하락 인지).
- 각 사례에는 **학습목표, prebrief, 가상 상황자료, 3단계 판단 질문, 선택별 피드백·근거, 결과·복습, 재시도**가 포함된다. 총 6개 문항이며 형성평가로만 활용한다.
- CASE 자료는 시뮬레이터의 장비 **설정값·파형·고정 모니터 화면과 전혀 연동되지 않는다**. 가상 사례의 SpO₂ 변화는 별도 학습 카드이지 앱에 설치된 실제 알람/환자 모델이 아니다.
- 선택지의 정답은 기초적인 *인식·사정·보고 우선순위*에 초점을 둔다. 학생이 임의로 인공호흡기 설정을 변경하도록 학습시키지 않는다.
- 콘텐츠는 **전문가 미감수 초안**이다. 학습 점수는 임상 역량 인증이나 병원 정책·장비 운용 지침을 대신하지 않는다.
- 새 소스: `src/preclinical-cases.js` (가상 사례·출처) + `src/case-engine.js` (순수 형성평가 상태). 기존 파형·폐역학/모니터·설정 모델은 변경하지 않았다.
- 근거: [AARC 2024 Patient-Ventilator Assessment](https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/), [INACSL Simulation Design](https://doi.org/10.1016/j.ecns.2021.08.009).
- **실습 전 교육 수준까지의 단계별 개발·임상 검토 기준:** [CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md](docs/CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md).

## v0.3.9 — 교육 콘텐츠 추적·교수자 검토 미리보기
- CASE 탭의 2개 가상 사례·6문항을 **contentVersion 0.3.9**로 관리. 모든 문항은 학습목표 ID, HTTPS 근거 링크, 근거 성격/해설 메모를 연결한다.
- `src/case-quality.js`는 누락·중복·출처 참조 오류·임상 미감수 상태 표시 여부를 검사한다. 실패하면 잘못된 CASE를 학생에게 제공하지 않는다. **구조 검사 성공은 임상적 정확성/승인 보증이 아니다.**
- 목록의 **교수자 검토 미리보기 · 정답 공개**는 정답과 연결 문항·근거를 표시한다. 별도 인증/권한 관리가 없는 *미리보기*이므로 모든 학습자가 열 수 있다. 교수자 전용 보안 기능이나 정식 승인 기록은 없다.
- CASE 문항 선택 후 근거 펼치기, 완료 후 내 답안과 권장 답안의 비교, 디브리핑 자기 메모 3개 추가. 메모는 브라우저 페이지 메모리에서만 유지, 새로고침/재시작 시 삭제. 저장/전송하지 않는다.
- **INACSL 2025 개정**에 따라 현재 표준 링크로 교육 설계 검토 경로를 갱신. 이전 2021 자료는 역사적 출처로만 유지한다.
- [v0.3.9 콘텐츠 품질/임상 검토 체크리스트](docs/CLINICAL_CONTENT_QA_v0.3.9.md)
- 전문가 감수·학생 대상 효과검증은 여전히 미완료이며 정답률이 임상 역량 인증을 뜻하지 않는다.

## v0.4.0 — PB980 알람·설정/측정 용어 학습
- 오른쪽 **ALARM 학습**(4번째 탭): 제조사 매뉴얼 6장/표 6-5의 4개 알람 명칭(CIRCUIT DISCONNECT, HIGH CIRCUIT PRESSURE, LOW EXHALED MINUTE VOLUME, APNEA)을 가상 카드로 학습. 의미·간호학생 사정/보고 포인트·3지선다 판단·선택 해설·다시 풀기 제공.
- **설정·모니터 용어**: 변경 가능한 교육용 설정 7종, 상단 고정 모니터 예시 7종, 고정 모드 1종을 선택 필터로 구분. 설정/측정 혼동 방지가 목표.
- **실제 알람 발생·알람 소리·감지/우선순위/지연·회로 분리·환자 반응은 구현하지 않았음.** 기존 파형·고정 모니터·CASE·설정 초기화 및 Accept/Cancel과 연동하지 않는다.
- [PB980 알람 교육 원문 근거·한계 문서](docs/PB980_ALARM_EDUCATION_v0.4.0.md): 제조사 매뉴얼 Table 6-5와 AARC 2024 사정 지침 분리. 실제 실습 지침/의료행위를 대체하지 않음.
- 4개 카드의 의료 문장은 임상전문가 감수 전 단계이며, 알람의 원인/우선순위를 추정하는 임상 시뮬레이터로 사용해서는 안 된다.

## v0.4.1 — 학생 핵심 중심 개편
- 기본 학습 화면: PEEP, FiO₂, VTE, f/fTOT, Ppeak, 환자 우선 사정 6개 카드. 각 카드에 개념·간호 관찰·주의·앱 한계·참고문헌을 제공한다.
- 필수 3개 설정 FiO₂/PEEP/f를 강조하지만 기존 7개 조작 항목·파형 모델·Accept/Cancel을 보존한다.
- 기본 탭은 핵심 개념/CASE/? 설명이며 CIRCUIT와 ALARM은 펼칠 수 있는 '추가 학습'으로 이동했다. 심화 Help/알람 매뉴얼 설명도 접기·펼치기 제공.
- 보조 학습 패널을 접어 선택된 알람·회로 탭에 접근하기 어려워지는 상황에서는 핵심으로 복귀한다. 기존 바로가기는 여전히 회로/도움말을 연다.
- PB980 버전별 공식 설명서·High PEEP Alarm 버전 특이 안내를 조사했지만 병원 실제 소프트웨어 버전은 확인하지 못했다. 알람 실제 동작은 재현하지 않는다.
- 자세한 조사: docs/STUDENT_FIRST_AND_PB980_VERSION_REVIEW_v0.4.1.md. 모든 임상 콘텐츠 전문가 검토 전.


## v0.4.2 — 핵심 개념 학습 확인과 CASE 적용
- 기존 여섯 핵심 개념 카드 아래 10문항 형성학습을 추가했다. 새로운 탭은 없다.
- 응답 전 정답/해설 비노출 → 선택 시 세 선택지 모두 해설·오개념·근거 표시 → 틀린 개념 카드 복습 → CASE 01/02 이동.
- 10문항 완료 후 공개된 교수자·개발자 검토 미리보기에서 정답·학습목표·오개념을 확인할 수 있다. 로그인이나 교수자 인증은 없다.
- 문제풀이 기록은 페이지 RAM 전용이다. 탭·기기 초기화에는 유지되며 새로고침 시 사라진다. 개인정보 저장·전송 없음.
- 출처 검증과 임상 전문가 감수를 마치지 않은 실습 전 교육용 형성평가로, 임상 역량 인증이나 기기 조작 지침이 아니다.
- 상세: [v0.4.2 학습 확인 QA](docs/CORE_LEARNING_CHECK_v0.4.2.md). 실행: 정적 웹서버에서 index.html.


## v0.4.3 — 교육 콘텐츠 품질 검토 준비
- 원래 10문항/6개 핵심 카드/CASE 2개를 유지한 채 **10개 문항별 근거 해석 범위와 교수자 확인 질문**을 덧붙였다. 답은 변경하지 않았다.
- 앱 자체의 화면·파형 분리 규약을 설명하는 문항은 더 이상 접근할 수 없는 Private GitHub README를 임상 문헌처럼 링크하지 않고 **앱 내부 구현 사실**로 표시한다.
- 학습자는 오개념 카드 복습 후 "학습 확인으로 돌아가기" 버튼으로 문제풀이에 복귀할 수 있다(페이지 메모리 유지).
- 완료 후 교수자·개발자 공개 미리보기에서 검토 질문·근거의 한계를 확인한다. 정답 노출 전에 볼 수 있는 특별 인증 기능이 아니며 교수자 서명/승인 기능도 아니다.
- 문항을 실제 임상 전문가가 감수했다는 뜻은 아니다. [교수자 감수 인계·문항 매트릭스·비식별 사용성 파일럿 계획](docs/CLINICAL_REVIEW_HANDOFF_v0.4.3.md).


## v0.4.4–v0.4.6 UX 업데이트
다섯 가지 개선 방향 확정: (+/− 길게 누르기와 직접 숫자 입력 / 설정별 기본값 / 학습 집중·나란히·장비 집중 프리셋 / 기본 학습·장비 탐색 보기 / 목표 중심 CASE 이어 하기). 버전별 작업 범위와 기능 회귀 검증 기준은 [UI/UX 최종 설계서](docs/UI_UX_REDESIGN_PLAN_v0.4.4-v0.4.6.md)에 기록했다. v0.4.6에서는 구현된 조작 및 화면 기능을 제공한다. 실제 기기·임상 정확성 검증이 완료됐다는 뜻은 아니다. 전문가 임상감수는 별도의 미완료 과제다.
