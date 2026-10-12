# Ventilator Simulator — v0.3.9 Preview

간호학생을 위한 **PB980(Puritan Bennett 980) 참고형 웹 시뮬레이터** 초기 실행본.
실제 장비의 화면 구성 학습을 목표로 하지만, 임상 사용이나 기계 조작 훈련을 대체하지 않는다.

## 실행
- 파일 전체를 웹 서버에 올려서 `index.html`을 연다.
- 로컬: Python 3 설치 시 `python -m http.server 8077` 후 http://localhost:8077 방문
- 테스트: Node.js 18 이상에서 `npm test`, `npm run check`
- npm 의존성 없음. 브라우저 ES modules 사용. `file://` 직접 실행은 권장하지 않음.

## 현재 구현 (v0.3.9)
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
