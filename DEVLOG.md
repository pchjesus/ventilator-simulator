## v0.5.4 — D5-A guided CORE LAB (2026-10-15)

### Added
- Pure `src/lab-engine.js` gates prediction → explicit observation → interpretation → completion. Immutable answers and no re-submit or skip.
- Versioned `src/lab-lessons.js` with 3 missions × 2 unscored questions, all-choice feedback, source/evidence classification, pending clinical review and content audit.
- Existing `#core-labs` UI reuses its graph/axis, comparison summary, source/clinical-warning text and A1/B1 reading width. Graph/title/desc/result/overlap withheld until observation, no answer leakage from previous selected mission.
- Per-LAB RAM sessions preserve answers on mode/CASE/viewport changes and experiment switches; LAB-only restart clears selected lesson, closing/reopening preserves other lessons.
- New engine/content Node tests and Chromium state-gating, 1440/700/360/320 responsive screenshots; original LAB/focus/browser checks retained and adapted only to the gated reveal. CI static package imports new modules.

### Risk / verification
- Browser source code is inspectable: this is a **learner UI disclosure gate, not a secure exam service**. No authenticated or private answer key mechanism.
- The FiO₂ overlap only reflects the current waveform generator omitting FiO₂. No statement of real patient response or PB980 firmware behavior is implied. Clinical expert/real device, physical phone and accessibility user testing still pending.
- [PR #28](https://github.com/pchjesus/ventilator-simulator/pull/28); exact test counts, run URLs and merged SHA must be filled from actual CI, not inferred. [D5 contract](docs/V0.5.4_D5_IMPLEMENTATION.md).

# DEVLOG

## v0.5.3.1–0.5.3.3 — approved A1/B1 student readability (2026-10-15)
- Patch 1: 학습 패널 중심으로 색상, 글자 대비, 카드 테두리 및 핵심 개념·퀴즈·LAB 글자 크기 조정. 장비 디스플레이 규칙은 유지.
- Patch 2: 701px 이상 ② 학습에서 기존 44:56·59:41·72:28 레이아웃 프리셋과 별도인 학습 전용 넓은 화면. 장비를 CSS로만 숨기며 DOM/기기 값/퀴즈 상태를 재생성하지 않음. A1 본문 최대 900px, LAB 최대 1120px. 기존 퀴즈 sticky 내부 스크롤을 전용 화면에서는 자연 스크롤로 전환.
- Patch 3: 기존 도구 버튼 3개를 모바일 `details` 내로 이동(B1; 새로 복제하지 않음), 네 곳 빠른 이동, 한영 파형 이름과 완전 중첩 안내. 두 선 일치는 생성 모델의 표현이며 실제 환자 산소화 결과가 아님.
- 새 Chromium `tests/study-focus-browser-check.mjs`로 배치/도구/모달/가로 넘침/CORE/CASE/LAB 상태를 확인하도록 CI gate 확장. v0.5.4 D5 문항은 별도 단계.
- [실행 명세](docs/V0.5.3X_STUDY_FOCUS_IMPLEMENTATION.md). 브라우저/Node/패키지 최종 CI 결과는 PR 완료 후 확인하여 기록; 실제 사용성·임상 감수 미실시.

## v0.5.3 — D3-A pure comparison & D4-A CORE LAB (2026-10-14)

### Added
- `src/waveform-compare.js`: 기준/실험 각각 `initialSettings()` 분리 사본에 대해 기존 `generateWaveform(settings,0,16,320)` 재사용. Pressure·Flow·Volume 각 파형 유형마다 두 곡선의 전체 표본에서 동일한 축 계산. Flow는 양/음·0 중앙선, Pressure/Volume은 0 시작 축.
- CORE 내부 `#core-labs` 선택형 LAB: 시작/종료/재진입, PEEP(5→8), 설정 f(15→18), FiO₂(40→60%) 고정 연습, 한 화면 그래프 유형 선택(Pressure/Flow/Volume), 회색 점선 기준/강조 실선 실험 및 텍스트 범례. 데스크톱·모바일 공용 큰 그래프.
- Lab RAM 상태와 캐시 스냅샷은 장비 committed/Pending, 기존 3개 기기 SVG 애니메이션/분석, 고정 monitor 7개, CORE 10문항, 4 CASE/12문항 및 비채점 행동 2개와 분리. 화면 모드/탭/크기 변경은 LAB을 초기화하지 않고 LAB 종료만 전용 상태를 재설정.
- 배포 패키지 명시 복사 목록에 새 모듈을 포함하고 실제 `dist/src/waveform-compare.js`의 ESM 동적 import 검사 추가. 신규 Node 단위 테스트 7개 및 별도 Chromium LAB/모바일 회귀·스크린샷.

### Risks / Verified scope
- 첫 CI [#38554643099](https://github.com/pchjesus/ventilator-simulator/actions/runs/38554643099): 기존 릴리스 노트 테스트가 앞 버전을 하드코딩한 탓에 **Node 81/82 통과, 1개 실패**. 신규 엔진 테스트와 Chromium은 통과. 테스트의 버전 인덱스를 수정하여 재검증 진행. 당시 package는 Node 실패에 따라 미실행.
- 미션 중 FiO₂의 무변화는 생성 모델에 대한 설명일 뿐 환자의 실제 산소화/혈역학 반응 부재를 뜻하지 않음. 교사용 문항·LAB 6 신규 문항/상태 머신·교육용 활동지는 **v0.5.4 이후**로 연기한 승인 범위 유지.
- 실제 Chromium 320px 스크린샷 육안 확인에서 처음 LAB SVG는 고정 760 단위 viewBox와 최소 180px 높이 때문에 세로 여백이 커지고 곡선이 지나치게 작게 보이는 문제를 확인. 550px 이하에서 전용 380 단위 좌표를 쓰고 viewport resize 시 **그래프 투영만** 다시 그리도록 수정; 캐시 표본/실험/기기/퀴즈 상태는 불변. 320px에서 실제 곡선 높이 75px 이상을 검증하는 브라우저 회귀 테스트 추가.
- 실제 사용성 파일럿, 임상 전문가 검토, 물리적 모바일·실물 PB980 검증은 수행하지 않음.
- 개발 PR: [#26](https://github.com/pchjesus/ventilator-simulator/pull/26). 병합 후 main SHA 및 정확한 CI gate는 후속 릴리스 기록에서 확정.


## v0.5.1 — large print and focus (2026-10-14)
### Added / Changed
- 장비 참고형 원본 모니터/설정 타일을 바꾸지 않고 상단 공용 '표시값 큰 글씨로 읽기' 버튼과 native 대화상자 추가.
- 단일 read-only 대화상자 내 고정 모니터 7개(원 순서/값/단위), 확정 설정 7개(현재 committed state만), Pressure/Flow/Volume 3종(생성 파형·비실측)의 한국어 설명과 자료 출처. CASE 가상환자 정보와 구별.
- `readingCategory`는 표시용 UI 상태이며 `state`, `editState`, 생성 파형 재생/정지/분석, CORE/CASE 진행 상태를 수정하지 않음.
- `tests/browser-check.mjs`에 7개 자료의 원본 일치, Enter/Escape/포커스 반환, 원래 설정 팝업 재진입, 1440/1280/1100/960/700/360/320px, 200/400% 상당 CSS viewport reflow 검사 및 스크린샷 추가.
### Risks / Verification
- 기존 v0.4.7 I:E·V̇E 표시 잘림 회귀 위험 → 원본 `renderMonitor()` 변경 없음, 모든 7 너비 Chromium 기존 테스트 통과.
- Pending을 확정값으로 오인할 위험 → modal state를 읽지 않고 committed `state`만 참조.
- Native dialog focus/inert 충돌 위험 → 다른 모달 열린 경우 확대창 진입 차단, Escape/닫기 뒤 트리거 초점 복귀.
- 초기 PR CI [#38420856416](https://github.com/pchjesus/ventilator-simulator/actions/runs/38420856416) 3개 job PASS. 해당 Chromium PNG 아티팩트와 v0.5.0 최종 main 기준 이미지를 내려받아 데스크톱/모바일 비교: 신규 상단 진입 영역 외에 원형 장비/학습 화면의 뚜렷한 회귀 미발견.
- 정적 웹 ZIP Actions 제작 PASS; 자동 Chromium 실행을 실제 물리 기기, 브라우저 UI 자체 200/400% zoom, 화면읽기 도구, 학생 사용성 평가나 임상 전문가 승인으로 오인하지 않음.
- **v0.5.1 릴리스 마감:** [PR #19](https://github.com/pchjesus/ventilator-simulator/pull/19) squash 병합 완료. 코드 main SHA `893476ff19de1db576e87cd5d4e8966c1e3e4e05`; [해당 SHA의 CI #38423564087](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087) `test/browser/package` 모두 SUCCESS, Node 단위 테스트 68/68.
- [최종 main 정적 ZIP](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087/artifacts/11827517172) (HTML/CSS/13개 JS 모듈, docs 제외)과 [Chromium screenshots](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087/artifacts/11827916241) 제공. localhost 제한 때문에 ZIP 모듈을 data URL로 묶은 오프라인 Chromium 검증을 추가 수행: committed 설정 반영/취소된 Pending 값 불반영, 320–1440px 접근/리사이즈/포커스/모니터 불변 확인.
- 마무리 후속 패치는 문서 사실 동기화와 committed-vs-Pending 자동 회귀 케이스 추가만 포함. v0.5.2–v0.6.0 미구현 및 사용자/임상/실물 기기 검증 미실시는 유지.


## v0.4.7 → v0.5.0 FINAL — 연속 학생 학습 UX 개선 (2026-10-13)

### Added / Changed
- **v0.4.7:** 도움말 설정 초기화 문구 동기화, 길게 누르기/직접 입력 안내, I:E 및 V̇E TOT 고정 모니터 긴 수치 잘림 보정.
- **v0.4.8:** 좁은 화면의 학습 우선 배치, 장비 펼치기 및 학습 복귀, 6개 핵심 개념을 쉬운 정의부터 오개념/예/심화까지 층위화, 약어 풀이. 기존 DOM을 유지하고 UI 표시 상태만 전환.
- **v0.4.9:** CASE 이전 완료 응답 읽기 전용 확인, 현재 목표 강조·전체 목표 중복 최소화, 판단 이유 및 목표별 복습, 앱 기능 이해/간호 개념 분리 결과, 교수자용 정답/수업 문서.
- **v0.5.0:** 네 종류의 교육용 자료(설정·독립 고정 표시·예시 파형·별도 가상 CASE)를 학습 도입에서 명시. 사용자 승인 Q1–Q5 통합, 실제 파일럿 계획 및 회귀 테스트 확장.

### Fixed
- 과거 설명서에서 설정 팝업 “전체 초기화”라는 오해 소지가 있던 동작 설명을 “이 항목 기본값은 Pending만 수정”으로 교정.
- 7열 환자 모니터의 I:E와 V̇E 긴 숫자 잘림을 좁은 장비 레이아웃에서 보정.
- 기존 CASE 진행 안내와 실제 이전 응답 열람 경로의 불일치 개선.

### Release gate and evidence
- v0.4.7: [CI 38343016130](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343016130) 통과.
- v0.4.8: [CI 38343423745](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343423745) 통과.
- v0.4.9: [CI 38343729579](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343729579) 통과.
- v0.5.0: 통합 브랜치 및 최종 `main` CI 결과는 `TEST_REPORT.md`의 최종 기록으로 추적한다.

### Known Issues / Next
- 실제 사용자 사용성·교수자 수업적합성·임상/기기 전문가 감수 미완료. 자동 테스트 성공은 이 검증을 대신하지 않는다.
- 자료·파형·CASE는 연동된 환자 생리 데이터가 아니다. 향후 개발에서 검증되지 않은 값을 실제 환자 결과처럼 연결하지 않는다.
- [사용성 파일럿 계획](docs/V0.5.0_USABILITY_PILOT_PROTOCOL.md) 시행 및 관찰 결과 기반 후속 개선.

---

## v0.2.0 — First executable browser prototype (2026-10-09)
### Added
- `index.html` entry, `styles.css`, `src/sim-model.js`, `src/app.js`
- PB980-inspired teaching surface; settings increment/decrement and help text
- right-side CIRCUIT concept views (parts, assembly overview, complete schematic)
- Node built-in regression tests, npm scripts

### Changed
- README updated to reflect executable preview and non-clinical boundaries
- Roadmap re-ordered to prioritize browser release, UI inspection, real-device reference review

### Risks / Known issues
- reference measurements and waveforms are intentionally STATIC; do not interpret as patient response
- adjustment increments and ranges are not vendor-validated
- diagram is not a real assembly instruction
- PB980 exact UI geometry and function verification pending
- no physical-device browser acceptance test yet

### Next
- PB980 official GUI/controls/parameter reference check
- interactive SVG waveform driven by separately documented educational lung model
- visual regression checks / responsive browser validation
- GitHub Pages configuration after visibility/access decision

## v0.2.1 — Browser acceptance + safe deploy bundle (2026-10-09)
### Added
- Chromium desktop/mobile browser-automation tests and screenshot capture
- Static-only site artifact, gated on unit and browser checks
- `docs/DEPLOYMENT.md` with safe public deployment workflow
### Verified
- Browser run 37883088395: browser and unit jobs succeeded
- Desktop and mobile screenshot visually inspected; no horizontal overflow at 360px
### Pending
- Separate public GitHub repository creation/connection
- Pages publishing and public URL smoke tests
- Real smartphone testing, PB980 fidelity and clinical model validation

## v0.2.2 — Private GitHub inspection and usability (2026-10-09)
### Added
- GitHub Actions `workflow_dispatch` (manual run on main).
- Headless Chromium 320px responsive check and keyboard-repeat test.
- `docs/PRIVATE_GITHUB_WORKFLOW.md` and partial official PB980 reference audit.
### Fixed
- Parameter step buttons are no longer re-created on every click, preserving focus during keyboard repeat.
- Reset updates settings in place.
### Verified
- GitHub Actions run [37885689471](https://github.com/pchjesus/ventilator-simulator/actions/runs/37885689471): test, browser and package jobs succeeded.
### Limitations
- Real hardware/physical smartphone/manual clinical validation not performed.
- Monitoring and waveform remain explicitly static reference examples.
- Public GitHub Pages release deferred; original repository remains private.

## v0.3.0 — Dynamic educational waveform preview (2026-10-09)
### Added
- `src/waveform-model.js` pure deterministic illustration of mandatory/spontaneous cycles, pressure, flow and volume
- 3 scrolling phase-colored SVG traces and playback pause/resume; model explanation and reference caveats
- `tests/waveform.test.mjs` numerical consistency/unit checks; new browser interaction regression checks
- Separate documentation of assumptions, limits and manufacturer vs. educational UI (docs/WAVEFORM_MODEL_v0.3.md)
### Fixed during CI
- Test selector accidentally matched both +1 and +10; switched to exact accessible labels.
- Pause previously painted one last frame after pressing Pause; frozen frame now drawn synchronously.
### Deliberately not implemented
- Oxygenation, ABGA, alarm, triggering mechanics, validated pulmonary compliance, patient-specific physiology, clinical PB980 emulation
### Deployment
- Existing private repository retained; public website publishing deferred.

## v0.3.1 — Numerical integrity and reduced-motion accessibility (2026-10-09)
### Verified prepatch
- v0.3.0 baseline: 13 model/parameter unit tests and browser/test/package GitHub Actions success (run 37933214408).
### Changed
- End-of-expiration volume and flow converge to zero using an exponential-times-squared-tail volume profile and its analytic derivative.
- Reject invalid externally supplied study waveform rate and timing/pressure parameters before event generation.
- Honor reduced-motion preference for initial paused state; allow explicit Resume and avoid redraws while paused.
- Added end-of-expiration numerical derivative and safety tests; browser regression for playback preference and mandatory breath timing.
### Limitations
- No real PB980 parameter-range certification, physiological measurement validation, patient data or official deployment.
### CI
- Outcome recorded separately in TEST_REPORT for the current version.


## v0.3.2 — PB980 visual reference patch (2026-10-09)
### Compared
- PB980 official operator manual GUI geography and publicly available monitoring photographs.
- v0.3.1 screenshot: dark metric cards, separate wide charts, large settings cards, rectangular housing.
### Changed
- Deep blue bezel/rotary visual, saturated blue metrics, black waveforms, left vertical MENU, lower blue settings, constant-access icons.
- Preserved all seven setting controls, waveform engine and Circuit/Help learning panel; linked two shortcut buttons.
### Regression
- GitHub Actions run 37944924891: test/browser/package all success.
- 16 unit tests passed; 1440/360/320px browser checks passed.
- Screenshot desktop and narrow mobile visually reviewed; no page-wide horizontal overflow observed in CI.
### Limitations
- Not pixel-calibrated to one particular PB980 firmware screenshot.
- Bezel keys and Configure/Logs/O2 displays are deliberately not interactive and do not replicate clinical device functions.
- Educational study UI only, not validated medical equipment emulator.

## v0.3.3 — PB980 GUI geography and parameter evidence (2026-10-10)
### Changed
- Move patient-data banner before illustrative status header; place educational prompt under waveforms; left-align chart labels/scales.
- Clarify educational Study/Help navigation and mode notation.
- Add source-backed adult PB980 settings range and resolutions to ? reference explanations with clear distinction from study controls.
### Preserved
- Seven adjustable teaching parameters with existing steps/bounds, waveform engine, play/pause, Help/Circuit, keyboard focus, reset and responsive CSS.
### Risk decision
- Do not map OEM 1-unit precision onto existing +0.1 educational buttons without an explicit new UX mode and clinical interlock validation.
- OEM bezel keys remain noninteractive visuals. Breath 'C' is static and clearly labelled, not a live phase flag.
### Verification
- Actual browser/CI test evidence must be recorded in TEST_REPORT; do not infer PASS from writing tests alone.

### Verification and discovered regression (v0.3.3)
- CI [37962118564](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962118564): 19/19 units, browser and package passed.
- Manual artifact inspection revealed 320px setting-tile layout regression (four columns) missed by an overflow-only browser check.
- Restored two columns at the mobile breakpoint and added computed-grid regression assertions.
- Fixed-application CI [37962366798](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962366798): test/browser/package passed, 19 units. Inspected new desktop/mobile/320 screenshots; layout readable; still not physical hardware or OEM pixel-match validation.

## v0.3.4 — Public PB980 visual reference follow-up (2026-10-10)
### Source review
- Examined Medtronic 2022 touchscreen Quick Reference Guide (nine physical keys, patient banner), operator manual touch-turn-accept workflow, actual published ventilator images incl. Korean 2022 nursing blog.
- Kept strict categories manufacturer confirmed / public image observed / unverified firmware-specific appearance.
### Changed
- Move **fixed example** C marker to patient-data banner left, instead of separate status row.
- Add visually simulated 9th hardware key, 'Audio Pause' (non-functional).
- Add regression assertions and manufacturer/public-photo audit; no copyrighted remote images embedded.
### Preserved
- Existing 7 setting buttons and model limits, Waveform Engine, pause, keyboard, CIRCUIT/Help, reset, mobile responsive behavior, Private repository.
### Decision pending
- Recommend two-workflow UX, manufacturer-inspired staged adjustment plus optional Quick Study controls; do not implement until user chooses. See docs/BUTTON_UX_RECOMMENDATION_v0.3.4.md.
### Verification
- GitHub Actions [38052371541](https://github.com/pchjesus/ventilator-simulator/actions/runs/38052371541) SUCCESS: syntax, 19/19 unit checks, desktop/360/320 Chromium, static site package.
- Visually inspected actual desktop and 320px PNGs: C badge left of fixed patient values, 8 noninteractive button drawings plus encoder (9 physical control representations), settings remain legible. Physical equipment/phone and matched-firmware OEM pixel equivalence are unverified.

## v0.3.5 — PB980-inspired staged control + optional Quick Study (2026-10-10)
### Added
- Accessible native modal adjustment for the default device-inspired workflow: select → edit pending → Accept or Cancel (Esc), keyboard arrows, original-value/pending-value distinction and in-dialog full reset.
- Explicit toggle restoring original per-parameter ± buttons in Quick Study mode, without changing the committed state when switching.
- Pure testable staged-control module `src/setting-editor.js`, five additional unit tests and desktop/mobile browser regression for the two workflows.
### Preserved
- Original `sim-model.js` study parameter metadata and immediate step controls, `waveform-model.js`, dynamic pressure/flow/volume, pause/reduced motion, help/CIRCUIT, focus, settings reset and private static package.
### Risk analysis
- Pending values NEVER feed the waveform engine; only `acceptSettingEdit` updates committed state. Stale original-value guard prevents unintended commit after an external change.
- Modal editing and Quick Study are mutually exclusive. Quick Study is clearly labeled so non-OEM adjustments are not mistaken for actual PB980 controls.
- No manufacturer-dependent soft/hard limits, Accept All multi-setting batching, alarm simulation or new physiology are introduced.
### Verification
- Preliminary branch CI [38054608709](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054608709) succeeded: 24/24 unit tests, browser and package. Editor-open screenshots added in subsequent test change; latest-run verification and screenshot review recorded separately.

### Follow-up browser and visual proof
- [GitHub Actions 38054960790](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054960790): SUCCESS with 24/24 unit tests and extended browser screenshot coverage for both modes.
- Reviewed actual 1440px editor and 320px editor, device and quick screenshots; verified staging/accept buttons visible and no narrow clipping. The long Quick Study mobile screen intentionally retains all original per-tile step controls.
- No change to device limits/physiological computation, no new dependencies or public website.

### v0.3.5 merged-main results
- PR [#3](https://github.com/pchjesus/ventilator-simulator/pull/3) squash merged successfully; code integration commit `762fea2cb03c747f6a6e1c9e94676436b8b4b71e`.
- Post-merge main Actions [38055192585](https://github.com/pchjesus/ventilator-simulator/actions/runs/38055192585): test/browser/package SUCCESS. 24 original+new model tests and mobile/desktop browser workflow checks passed.
- Original repository remains Private; no GitHub Pages/public release.

## v0.3.6 — Clinical education, manual and categorized patch dialogs (2026-10-12)
### Baseline and scope
- Starting point: private main `41d1b80b97ec8de2f7d913836a83eb277f786bba` (v0.3.5).
- Preserve committed-vs-pending control semantics, immediate Quick Study, settings ranges, device appearance, CIRCUIT, waveform model, pause/reset/reduced motion.
### Added
- `src/education-content.js`: 13 structured topics (7 settings, mode, waveforms, monitor, nursing, ABGA and circuit), clinical observation, simulator caveats, three public sources.
- Top **설명서** and **패치 내역** native modal dialogs, X/backdrop/Esc, focus return, scrollable narrow-screen content.
- `src/release-notes.js`: structured versions 0.2.x–0.3.6 with 5 categorized types and filter UI.
- Schema and Chromium tests for source links, topic navigation, both dialogs, category filtering, mobile touch dismissal and all prior workflows.
### Risk review
- Existing right-side `#help-title` / `#help-body` / `#reference-info` preserved to avoid breaking current ? buttons and clinical device facts.
- Education notes use safe DOM `textContent` and external HTTPS links with `rel=noopener noreferrer`; no remote fetch at runtime or patient-specific predictions.
- Top dialogs are independent from the existing `#setting-editor` modal; native modal prevents click-through to underlying controls. Outside pointer gesture suppresses default behavior to avoid accidental focus/click-through.
### First CI feedback
- Initial PR #4 workflow 38187105272 reported **one content-schema test failure** (short PS summary) and **one browser focus-after-backdrop test failure**. Improved PS summary and suppressed pointer default for backdrop dismissal before repeat verification. Do not infer the latest CI result from this entry.
### Clinical verification boundary
- Published reference-supported concepts are not a validated device workflow or clinical patient model. All monitor values remain fixed, waveform relationships illustrative.

### v0.3.6 PR validation completion
- Final patched branch run [38187368353](https://github.com/pchjesus/ventilator-simulator/actions/runs/38187368353) fully green (29/29 Node checks plus Chromium and static package).
- Fixed initial PS summary schema failure and backdrop click/focus interaction, then polished narrow manual heading and removed duplicated clinical introductory description.
- All 15 screenshot variants generated; final 320px manual and patch history layouts visually reviewed. Actual bedside PB980 clinical validation remains explicitly out of scope.


### v0.3.6 final merge and main CI
- PR [#4](https://github.com/pchjesus/ventilator-simulator/pull/4) merged into private main; commit `c7cd912eff51665eda2a24e6ef801ccf7630aa7b`.
- Main-commit workflow [38187571168](https://github.com/pchjesus/ventilator-simulator/actions/runs/38187571168) completed SUCCESS for all 3 jobs; 29/29 unit checks green.
- No clinical-equivalence or physical PB980 validation claimed. No public web deployment.

## v0.3.7 — Information-first interface + paused waveform inspection (2026-10-12)
### Current code/risk review
- Base v0.3.6 private main `cdec71a3ab43a279b4f66b9d1009a6da737b48f6`. Existing large decorative blue housing squeezed readouts and made the settings tiles difficult to read at 320px.
- Chosen safe approach: CSS-only visual regrouping preserving existing HTML geography/legacy selectors, and a pure cursor sampler **consuming existing waveform samples only**. No new patient/clinical physiological model or change to settings precision.
- Medical device vs app: manufacturer's waveform pause, grid and cursor navigation are inspiration; no OEM precision, looping, physiological trigger or measured values.
### Implemented
- Neutral, compact housing, bigger monitor numbers and names, separated dark waveform stage and pale study-setting tiles, more legible controls, two-column narrow settings; unchanged 7 monitoring examples and 7 inputs.
- `src/waveform-inspector.js`: finite bounded 0–1 cursor fraction, coordinate-to-ratio mapping, deterministic sample selection/validation; no DOM.
- `src/app.js`: new `inspectorActive/pausedBeforeInspection` state isolated from committed settings, pause/restore, shared cursor on three graphs, slider/keyboard/pointer selection, responsive synthetic sample readout and grid visibility toggle.
- `index.html` adds analysis panel and wave toolbar controls; manual content and categorized v0.3.7 patch notes updated.
### Risks and mitigation
- Pause collision: analysis forces a frozen frame, restoring prior Pause/Resume on exit. Clicking Resume inside analysis explicitly resumes playback.
- Sampling accuracy: cursor renders the very same 320 samples used for SVG paths; labels make it clear that samples are not bedside measurements. Fixed patient banner cannot change as a result of analysis.
- Graph pointer only active in analysis, keyboard works via accessible range input; no hover-only dependency, no remote services, no storage changes.
- Mobile layout: keep 2-column controls with enlarged values; browser CI at 1440/360/320px checks no overflow and old editor/quick mode.
- Validation: pure math checks + Chromium regression gate + screenshots; real clinical device/smartphone verification remains out of scope.


### v0.3.7 validation & merge
- Merged PR [#5](https://github.com/pchjesus/ventilator-simulator/pull/5) as `9370cf6797886f7e7af3e9cb55f51e8927904675`.
- Final app merge CI [38192764211](https://github.com/pchjesus/ventilator-simulator/actions/runs/38192764211): **SUCCESS** on 34/34 unit checks, browser desktop/360/320 regression, and static web packaging.
- 18 actual Chromium screenshots generated; inspected neutral UI, desktop analysis and 320px responsive.
- Changed only UI, pure cursor reader, readout rendering/control integration, documentation. `src/waveform-model.js`, `src/setting-editor.js`, original top monitor sample model untouched.
- No manufacturer-certified clinical model or public deployment.

## v0.3.8 — Preclinical case pilot and education pathway (2026-10-12)
### Baseline and current-risk review
- Started from verified Private main v0.3.7 `c5371ea86df003add7d7907aee4899966713f84c`.
- Examined current panel routing, static MONITOR_REFERENCE banner, committed-versus-pending parameter state, education source-link presentation and waveform render independence.
- Central clinical-safety risk: a realistic-looking case value such as SpO₂ 88% could be mistaken for an actual simulator-derived patient response. **Mitigation:** cases live in visually separate right-hand panels marked fictional; no writes to model, waveform, settings, alerts or fixed top monitor.
### Scope delivered
- New CASE tab, two fictional introductory scenarios, objectives/prebrief/context, 3 graded prompts per case, individualized feedback, review/score and restart.
- Pure modules: `src/preclinical-cases.js` and `src/case-engine.js`, with case/source schema and protected transitions.
- Tab changes retain case answers. Reset of device settings does not wipe case state. Opening CASE cannot commit pending settings or control the waveform.
- Help manual and release notes updated. Static CI bundle includes both new ES modules.
### Risk, usability and future clinical evidence boundary
- Avoid an unsupported physiology/oxygenation model. Initial assessment only tests cognitive recognition, patient-centered direct assessment, trainee escalation and structured reporting.
- Knowledge choices are formative; correctness should not imply licensed competence. Educational contents are marked **expert review pending**.
- Future curriculum work follows `docs/CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md` with explicit sign-off and learner pilot gates before v1.0.
### Required verification
- Case-logic deterministic unit tests, source/answer validation, desktop 1440/mobile 360/320 browser run with CASE and old controls, no case settings/monitor mutation, integration package, updated TEST_REPORT.


### v0.3.8 case pilot PR review
- First CI found missing UI/UX entry for CASE tab in v0.3.8 release notes. Corrected categorization.
- Branch PR workflow [38198237425](https://github.com/pchjesus/ventilator-simulator/actions/runs/38198237425): 38/38 unit PASS + browser PASS + web artifact PASS.
- 22 browser PNGs generated; manually inspected CASE questions on desktop and 320px mobile. UI content and distinct fictional vignette presentation visible without horizontal overflow.
- v0.3.8 remains an unreviewed **prototype** pending clinical educator review, student pilot and instructor sign-off before any preclinical training release.


### v0.3.8 merged Private main
- Merged clinical CASE prototype PR [#6](https://github.com/pchjesus/ventilator-simulator/pull/6), squash SHA `0942cc1b4138695474b0a92141bfb7a454697b6e`.
- Main verification [38198481423](https://github.com/pchjesus/ventilator-simulator/actions/runs/38198481423) succeeded for **38/38** Node assertions, desktop/mobile Chromium regression and web-only packaging.
- Still not suitable as clinician-reviewed preclinical curriculum: await expert review, institution-specific alignment, and teaching pilot before v1.0.

## v0.3.9 — Evidence traceability, instructor review preview & debrief (2026-10-12)
### Before change
- Baseline v0.3.8 Private main `3be070dc57a032a61c71ce823655fae2e76da1e7`.
- CASE question feedback and case-level sources existed, but individual questions were not linked to measurable objective IDs and specific evidence notes; there was no automatic content audit or educator-preview workflow.
- Important UX/clinical risks: confusing a *green code test* with actual clinical sign-off, revealing answers to learners prematurely, losing notes during tab changes, mistaking vignette values for real monitoring.
### Implementation
- Added `src/case-quality.js`: pure static bank audit and clear distinction from SME medical review; fails CASE closed on invalid schema/links.
- Each of the six pilot items now points to objective IDs, source IDs, evidence kind and a short source-boundary/clinical-inference note; both cases remain **review pending, approved=false**.
- Added clearly labeled instructor **open-to-anyone** preview with all answers/source links/medical review gaps; no approval toggle and no simulated credential.
- Added optional per-answer evidence accordion, end-of-case answer comparisons, three structured reflection prompts per case. The reflection notes exist only in memory; user-controlled case restart clears them, tab switch does not.
- INACSL official standards page documents 2025 updates to Prebriefing and Debriefing. Do not treat 2021 historical article versions as necessarily current operating guidance.
### Regression/validation requirements
- Add missing-source/objective/duplicated-answer/source-kind and unsafe review-state unit tests.
- Desktop, 360, 320 Chromium regression including instructor answer preview, paper-source link `noopener noreferrer`, back/forth and reflection focus/value persistence, simulator data unchanged, existing 34+ unit tests.
- Critical limitation: no clinical external educator content approval or learner learning-outcome pilot. See `docs/CLINICAL_CONTENT_QA_v0.3.9.md`.


### v0.3.9 UI/QA reviewed after first CI correction
- 45 Node tests passing, Chromium desktop/360/320 scenario & legacy regressions passing, packaging passing on [PR workflow 38203543362](https://github.com/pchjesus/ventilator-simulator/actions/runs/38203543362).
- Found and corrected a Playwright strict-selector regression caused by nested `<summary>` elements; no app code changes to resolve.
- Captured 24 screenshots, reviewed desktop CASE instructor preview and 320px case preview. Publicly accessible answer reveal and explicit `review pending` status visible; actual student interface and machine simulation retained.


### v0.3.9 merged and main verified
- PR [#7](https://github.com/pchjesus/ventilator-simulator/pull/7) → Private main app commit `85bf91a82f48d5cc2956a501d4ce34510aaffd41`.
- Main CI [38203800899](https://github.com/pchjesus/ventilator-simulator/actions/runs/38203800899): **SUCCESS** on 45/45 unit, desktop/360/320 Chromium and static package.
- Content is **unreviewed by clinical experts**, educator preview is open to all, and learner notes are RAM-only; no approval/grade certification.

## v0.4.0 — Device alarm recognition and parameter-versus-monitor literacy (2026-10-12)
- Baseline v0.3.9 Private main `249bb3b132679b15d44e56136a0927be3f839fac`.
- Evidence review: Medtronic PB980 Operator Manual chapter 6 / Table 6-5 and AARC 2024 Patient–Ventilator Assessment; avoided implying a single fixed alarm priority or actual response algorithm for multiple hardware/firmware conditions.
- New pure `src/device-learning.js`: four documented alarm recognition lessons with 3 response choices, generic patient-safety observation/report education, source links, safe grading; glossary crosswalk matches simulator's seven settings, seven fixed monitor readouts, and example SIMV mode.
- New fourth **ALARM** right-side study tab. No alarm state emitted to existing fixed monitor, synthetic waveform, case-state engine, staged setting editor, or CIRCUIT view.
- Risk review: (1) confusion between fake alarm and actual device → always-on explicit “실제 발생 경보 아님” notice; (2) numerical changes triggering false alarms → source-only read and no waveform/settings writes; (3) narrow screen → four tab labels adapt with native buttons, Chromium viewport regression; (4) answer persistence/reset → page RAM per alarm ID, not device or case state.
- Dedicated source/UX limits in `docs/PB980_ALARM_EDUCATION_v0.4.0.md`. All clinical interpretations remain expert-review pending.
- Required verification: catalog/unit tests, desktop/360/320 Chromium alarm path and pre-existing 45 unit assertions, actual screenshot review, PR & final exact private main CI.


### v0.4.0 verified branch screenshots / CI
- PR branch [38208572810](https://github.com/pchjesus/ventilator-simulator/actions/runs/38208572810) passed **52/52 Node tests**, Chromium 1440/360/320 and static package.
- A browser-test selector string quoting error was detected by CI and corrected; `npm run check` now validates test script syntax before Chromium installation.
- Manually examined 28-shot browser artifact, including desktop glossary, desktop quiz feedback, and 320px mobile lesson.
- Manufacturer manual-grounded vocabulary remains distinct from unreviewed student interpretation; there is still no actual simulated alarm engine.

## v0.4.1 — student-first nursing education (2026-10-12)
- Baseline Private main 68aea8ef631c13e86a916f8420f0e20b94bb9961.
- Reprioritized initial study content around PEEP/FiO₂/VTE/set-vs-total respiratory rate/Ppeak/patient assessment, on AARC 2024 assessment concepts; curricular ordering is an educational design choice.
- Added pure src/student-learning.js with six source-linked content objects and tier-coverage checks; no changes to waveform calculations, setting editor logic or hardcoded monitor samples.
- Changed right-side navigation to core/CASE/Help by default and CIRCUIT/ALARM under native disclosure; restore core when advanced navigation collapses, auto-open when shortcut navigates to advanced. Additional Help and PB980 technical descriptions are collapsed.
- Styled 3 core settings and 4 supplemental settings without changing array order, IDs or values. Screen remains a simulator demo, not real patient measurement.
- Reviewed Medtronic software-version-specific PB980 manuals and High PEEP Alarm guide with 8.4.4.3+ qualifier; site-specific installed software remains unknown.
- Test plan: 57 unit checks, Chromium 1440/360/320, mobile and existing CASE/editor/ALARM/circuit regressions, release zip source integrity; clinical SME signoff separately required.


## v0.4.2 (2026-10-12) — 핵심 개념 학습 확인
Added: 10 objective/evidence/misconception-linked quiz items, feedback for all three choices after selection, in-memory score, retry, concept review and CASE 01/02 navigation. Added optional after-completion instructor/developer answer preview (no access control).
Changed: existing core panel only; responsive quiz UI, CI syntax/package/test coverage; docs and release note.
Preserved: seven device controls, Accept/Cancel, Quick Study, static monitor examples, waveform model, analysis/grid, Help/manual, CIRCUIT, ALARM, original CASE prompts/answers/debrief.
Risk control: separate pure quiz engine, page-only RAM state; no device/case mutations; answer exposure gated until choice; malformed content fails closed.
Known: source links and wording still require clinical educator review; not a medical-device emulator, summative examination or clinical competency certificate.
Next: instructor content audit and deidentified student pilot.

### v0.4.2 UI verification addendum
- New ten-item knowledge check initially produced a long page that moved the PB980 example screen outside the visible area during desktop answer review. Only while a quiz is active and at desktop widths >=1101px, the study panel now uses a bounded sticky scroll container. Starting the quiz aligns the desktop workspace to retain the ventilator overview. Mobile 360/320px and the pre-quiz layout keep their previous single-page scroll.
- Browser screenshot review: PR #11, 1440px desktop-core-quiz-feedback / desktop-core-quiz-complete, mobile-core-quiz-360, narrow-core-quiz-320. No clipped answer or review buttons; key simulator areas remain visible in desktop quiz.


## v0.4.3 (2026-10-12) — clinical content QA handoff
Added: Per-item faculty evidence notes and review questions for all ten formative items; after concept-card review, a button returns to the current quiz question. A separate faculty clinical-review handoff matrix and future pilot protocol were documented.
Changed: App-only implementation evidence appears as internal product behavior without an inaccessible Private GitHub link; one f/fTOT question clarifies that displayed figures are a **conceptual example**, not real patient data. Updated version metadata/patch history.
Preserved: Ten question IDs, correct answer IDs, six core concepts, CASE 01/02 and their answers, settings, monitor reference values, mathematical waveform engine, pause/inspect/grid, ALARM/CIRCUIT/Help, RAM-only privacy boundary, and existing first-screen student-first layout.
Risk/QA: Source classification and every faculty trace must pass schema audit, and all baseline regression tests remain. No human clinical SME review, hospital device signoff, user recruitment or certification was performed.
Next: Independent educator review → targeted wording corrections → real student usability pilot (with required approvals).


### v0.4.3 QA closeout notes
- New quiz→concept→quiz return path is accessible through an expanded original concept card; unopened cards remain naturally collapsed. This preserves existing progressive disclosure.
- Structured clinical reviewer questions are descriptive evidence interpretation, not a reviewer decision or review signoff.
- PR #12 regression: 66/66 unit + 21 Chromium PASS checkpoints at 1440/360/320 (run 38242016756). A mistaken collapsed-<details> visibility assertion was corrected without altering application behavior.


## 2026-10-13 — UX design decision and regression risk review (documentation only)
Five user decisions for v0.4.4–v0.4.6 were confirmed and tracked in `docs/UI_UX_REDESIGN_PLAN_v0.4.4-v0.4.6.md`. Inspected current main v0.4.3 behavior: staged numeric edits lack direct-entry precision validation; TURN is inert; modal reset currently resets all seven; desktop study pane is narrow and existing breakpoints may clip compact device settings; single caseState is discarded when returning to CASE list. Planned separate UI-presentation/layout/control-mode state, strict pending input validation, pointer long-press cleanup, per-parameter reset, independent CASE resume and 1440–320px regression gates. **No source/runtime feature changed; no v0.4.4/0.4.5/0.4.6 implementation or functional verification has been claimed.**


## v0.4.4 → v0.4.5 → v0.4.6 (2026-10-13) — progressive UX implementation
### v0.4.4 — student-first layout/presentation
- Added three layout presets (learning-focused default / balanced / device-focused) and two UI views (basic learning default / device exploration).
- View switches use only body data attributes and CSS; no simulator/model, quiz, CASE or waveform reset. Inactive decorative physical-key graphics are hidden in basic learning and remain visible in exploration.
- Added simple anchor jump navigation and responsive settings tile design, while retaining the original devices and learning tabs.
### v0.4.5 — accessible setting manipulation
- Replaced decorative modal TURN with direct numeric input; strict numeric/precision/range validation rejects invalid drafts rather than rounding silently.
- Added press-and-hold +/- to modal and existing quick-study controls; pointer/blur/hidden/close cleanup prevents runaway intervals. Keyboard activation remains single-step.
- The modal "이 항목 기본값" stages only the selected parameter initial value; global reset remains in the main header. Pending adjustments do not affect waveform, CASE, quiz, or fixed monitor.
### v0.4.6 — guided CASE and resume
- Added visible objective/step roadmap and re-openable scenario information without changing case source data or correct answers.
- Separate in-RAM sessions for CASE 01 and CASE 02: list navigation no longer drops progress, each card offers start/resume/result/restart. Per-case reflection notes are independent. Browser refresh intentionally clears them.
- Kept expert-unreviewed and fictional-case source labels; no live SpO2/VTE/gas-exchange model or clinical approval.
### Implementation risks and test coverage
- Biggest risks: arbitrary typed precision, long-press lifecycle, small device width after layout change, CSS collisions, and CASE session preservation. Tests cover bounded numeric entry, no pre-accept device update, focus/Cancel, case stages and independence.
- Run npm syntax/unit, real Chromium desktop/mobile, inspect screenshots, private PR merge, exact post-merge main CI; record failures and fixes in TEST_REPORT.


## v0.5.2.1 — neonatal MAS and severe infant RSV (2026-10-14)
- Original 2 adult CASEs unchanged; appended two independent fictional cases (3 objective-linked questions and 3 debrief prompts each).
- AHA/AAP 2025 newborn delivery suction vs AARC 2022 intubated neonatal/pediatric indication-based suction carefully separated; source-linked MAS (Merck) and severe bronchiolitis (NICE) cognition-only education.
- Original CASE progress RAM, CORE quiz, committed/Pending ventilator settings, fixed readouts and illustrative waveforms not connected to pediatric scenarios.
- Clinical expert review, student pilot and actual PB980/pediatric ventilation model not done.


### v0.5.2.1 stabilization: presentation and clinical reference equipment
- Repair conflict between existing device/learning presentation buttons and clinical CASE default-closed equipment: device presentation opens optional independent equipment; learning presentation closes it.
- No change to case content, device values, waveform state, quiz answers or CASE sessions. Add explicit Chromium regression.


## v0.5.2.2 — Stage-aware fictional clinical documents (2026-10-14)
- MAS X-ray from the first stage, previously drawn ABGA from the second; severe RSV current clinical observations from the first, previously drawn capillary gas from the second. No instruction to delay a patient's assessment pending investigations.
- Clinical information has sample type, timing, oxygen context, units, source IDs and post-answer gated rationale. Static values are not patient-model calculations; CBG PO₂ is not displayed as an arterial PaO₂.
- Pure audit checks source availability, valid stage, capillary sampling constraints and Henderson-Hasselbalch educational example consistency. Source review does not imply bedside validation.
- Disclosure state is separate from quiz, adult monitor, waveform, committed/Pending settings and independent CASE sessions. Experts and real users have not reviewed.


## v0.5.2.3 — RAAS-informed nursing action & study return (2026-10-14)
- New optional one-per-pediatric-case action choices follow the existing MAS stage 2 and RSV stage 2 clinical judgement; do not add to the existing 4 CASE × 3 scored answers.
- After selection: selected/recommended actions side-by-side in text, immediate rationale, nursing observation/report points, evidence links and mapped foundational concepts.
- A new short core-page blood gas reference clarifies arterial PaO₂ vs capillary pH/PCO₂ and patient observations; navigation from a CASE and back preserves quiz/case state and optional action choices.
- Existing clinical readouts remain static, waveform/device states unchanged; independent RAM action selection resets only with explicit CASE restart or page refresh.
- Medical faculty signoff, pediatric physiology model, and real student/physical phone usability review not performed.


### v0.5.2.3 release-packaging regression prevention
- Confirmed v0.5.2.2 packaged ZIP could omit newly imported `case-clinical-data.js` because CI copied an explicit historical whitelist; branch/full-repository Chromium was unaffected and could misleadingly report success.
- Added both `case-clinical-data.js` and `case-actions.js` to dist copy and non-empty checks, plus an actual import/sanity smoke test executed against **dist** (four cases; both pediatric data/action assets loaded).
- Release acceptance requires new exact main SHA's test/browser/package jobs all pass; do not treat the earlier v0.5.2.2 ZIP as a complete independently launchable package.
