# Development Roadmap (GitHub 릴리스 상태 2026-10-14 확인)

> **2026-10-14 릴리스 상태:** v0.5.1 D1-A 읽기 확대 기능은 [PR #19](https://github.com/pchjesus/ventilator-simulator/pull/19)로 main 병합 완료. 코드 main SHA `893476ff19de1db576e87cd5d4e8966c1e3e4e05`; [정확한 해당 main의 CI #38423564087](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087) test/browser/package 전부 성공. v0.5.2–v0.6.0 D2–D5는 아직 미구현이며 기존 [승인 UX 명세](V0.6.0_APPROVED_UX_IMPLEMENTATION_SPEC.md)와 [Playbook](V0.5.1_TO_V0.6.0_IMPLEMENTATION_PLAYBOOK.md)을 기준으로 개발한다.

## v0.5.1 — Readability and Focus Baseline
- [x] 7개 독립 고정 모니터 확대 읽기(순서·값 보존), 한국어 뜻/단위/출처.
- [x] 7개 committed 설정과 Pressure·Flow·Volume 3종 생성곡선 설명/출처.
- [x] 키보드·Escape·포커스 복귀·읽기 전용 동작 테스트, 7개 반응형 viewport.
- [x] 초기 CI test/browser/package 성공, PNG 다운로드 후 v0.5.0 기준 스크린샷과 비교.
- [ ] 실제 물리적 스마트폰, OS 브라우저 자체 200%·400% 확대, 화면읽기 보조기기·학생 사용성 파일럿, 임상 전문가 감수(릴리스 자동화 테스트와 별개).

## 다음 릴리스
- **v0.5.2:** D2-A 핵심 요약·상세 설명·네 자료 출처를 간결하게 구분; 기존 6카드·10문항의 정답/원문 불변.
- **v0.5.3:** D3-A 파형 비교 엔진과 D4-A CORE 내부 독립 LAB 표면.
- **v0.5.4:** D5-A PEEP/f/FiO₂ LAB 3개와 전용 6문항, 별도 메모리 상태.
- **v0.5.5:** 교수자/학생 문서 분리 및 콘텐츠 감사.
- **v0.6.0:** 전체 통합·회귀 검증 및 교육용 베타 릴리스.

## v0.5.0 FINAL — 학생 학습 UX 단계별 진행 (2026-10-13)

- [x] v0.4.7 — 설명서·팝업 불일치와 고정 모니터 값 잘림 수정. CI [38343016130](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343016130) 통과.
- [x] v0.4.8 — 모바일 학습 우선, 장비 접근 및 6개 개념 설명 층위/약어. CI [38343423745](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343423745) 통과.
- [x] v0.4.9 — CASE 이전 응답 읽기 전용·목표별 복습, 형성평가 영역 구분, 교수자 수업 자료. CI [38343729579](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343729579) 통과.
- [x] v0.5.0 — 승인된 다섯 UX 선택, 자료 출처 분리 안내, 브라우저·회귀 테스트·문서·사용성 파일럿 계획 통합 구현. 최종 CI/병합 검증은 `TEST_REPORT.md` 참고.
- [ ] 실제 학생 사용성 파일럿 및 교수자 수업 적합성 평가 시행(계획 문서만 작성).
- [ ] 임상 전문가의 6개 개념·10개 문항·CASE 2개 및 실습학생 역할 검토/승인.
- [ ] 병원 PB980 실물 펌웨어/설정 범위, 실제 스마트폰 조작, 확대·보조기기 접근성 검증.

관련 문서: [승인된 구현 추적](V0.5.0_APPROVED_STUDENT_UX_IMPLEMENTATION.md), [교수자 수업자료](FACULTY_CLASS_GUIDE_v0.5.0_DRAFT.md), [파일럿 계획](V0.5.0_USABILITY_PILOT_PROTOCOL.md). **실제 사용자·임상 검증을 완료한 버전은 아님**.

---

## Phase 0 — Verify reference and baseline
- [x] Inspect repository, README/AGENTS/SPEC and initial commit
- [x] Identify MICU webapp patterns to reuse (separation, regression, reporting)
- [x] Choose PB980 as primary device reference from user context
- [ ] Validate exact GUI and supported increments against PB980 operator manual / confirmed screenshots

## Phase 1 — First web MVP (v0.2.0)
- [x] Add runnable `index.html` + dependency-free modules
- [x] Create monitor / example waveform / setting sections
- [x] Add parameter step controls + `?` explanations + reset
- [x] Add right-side CIRCUIT *concept* views (not real assembly)
- [x] Basic pure-function automated tests
- [x] Automated Chromium desktop, 360px and 320px acceptance checks
- [ ] Manual review on physical PC and smartphone
- [x] Private GitHub code/Actions review selected; public URL release deferred

## Phase 2 — Reference-consistent controls / dynamic waveform
- [ ] Exact PB980 mode settings, valid ranges, increments and tooltips from manuals
- [ ] Separate normal breath state/events from visual curves
- [x] Pressure, flow and volume waveform generated from a documented **illustrative** model (not a validated patient model)
- [x] Illustrative mandatory/spontaneous distinction and scroll/pause/reset; **true breath synchronization remains pending**

## Phase 3 — Circuit learning
- [ ] Confirm specific circuit profile and component connections
- [ ] Illustrated/animated parts and assembly guidance
- [ ] Clear flow direction and optional fault demos

## Phase 4 — Patient & ABGA
- [ ] Simplified respiratory mechanics (compliance/resistance/drive)
- [ ] Educator-reviewed relationships for oxygenation/ventilation
- [ ] ABGA demonstration with explicit assumptions

## Phase 5 — Alarms and evidence-based learning cases
- [ ] Alarm logic tied to state
- [ ] Small branching nursing-student scenarios (e.g., COPD, ARDS, weaning)
- [ ] Per-case source, applicability and clinical review checklist

## Continuous validation
- Per patch: unit + affected feature + regression verification
- Before release: live browser, mobile, clinical content and deployment checks
- Do not label unverified behavior as validated

## v0.2.2 reliability improvements
- [x] Preserve keyboard focus during repeated parameter adjustment
- [x] Enable manual workflow trigger in GitHub Actions
- [x] Document how to inspect and run the private project
- [x] Manufacturer reference audit (partial only, limits not yet verified)

## v0.3.0 — Completed educational preview
- [x] Add 3 time-based preview plots (pressure, flow, volume) with phase legend
- [x] Add optional simulated spontaneous breaths for teaching differences
- [x] Use UI inputs PEEP, Pi, PS, f and Ti to redraw preview
- [x] Retain FiO2/V-TRIG as unmodeled controls; preserve monitoring readouts as static examples
- [x] Pause/resume scrolling and define a pure waveform generator with unit tests
- [ ] Calibrate exact PB980 screen coordinates/colors and setting limits against local hardware/official operator manual
- [ ] Add breath-level model and patient-specific mechanics (separate from current demonstration)

## v0.3.1 — Math consistency and accessibility patch
- [x] Replace exponential-expiration cutoff with exp × squared-end-taper waveform
- [x] Analytical expiratory flow derivative with end-of-expiration smooth return to zero
- [x] External input guard on rate/pressure/inspiratory duration for illustration engine
- [x] Respect reduced-motion preference on initial load and allow opt-in playback
- [x] Retain paused redraw on parameter changes while skipping repeated inactive paints
- [x] Regression coverage for the new model and mobile/UI controls
- [ ] Obtain validated PB980-specific setting bounds and real patient-waveform evidence before suggesting clinical equivalence


## v0.3.2 — Visual similarity patch
- [x] Compare baseline screen with manufacturer GUI geography and PB980 monitoring photos
- [x] Blue patient data / black central waveforms / vertical MENU / lower settings strip
- [x] Deep blue case and non-interactive hardware key/encoder representation
- [x] Educational Home/Circuit and Help shortcuts
- [x] Functional/browser/mobile/screenshot regression
- [ ] Pixel-based comparison against a known PB980 software version and mode
- [ ] Verify manufacturer hard/soft bounds and mode-dependent controls
- [ ] Evaluate user demand before emulating additional OEM dialogs/icons

## v0.3.3 — GUI and sourced PB980 reference
- [x] Align data banner / example phase / waveform / educational prompt / setting region to documented GUI geography.
- [x] Move axis labels to left and explicitly separate study actions from OEM-looking icons.
- [x] Display verified adult PB980 Table 11-9 reference ranges/resolutions in all seven parameter help panels.
- [x] Preserve independent educational step controls; no silent manufacturer range enforcement.
- [x] Confirm passing v0.3.3 application CI + screenshot review and record real run in TEST_REPORT (37962366798; test-only assertion rerun separately monitored).
- [ ] Obtain version-identified normal-ventilation SIMV PC+PS photograph and exact geometry measurements.
- [ ] Only later consider separate verified OEM-style input mode with dependency-based constraints.

## v0.3.4 — Public evidence only (no local-device screenshot required)
- [x] Replace unobtainable real MICU hardware screenshot prerequisite with a public-evidence matrix (manufacturer first, public-photo observation second, inference clearly marked).
- [x] Correct static C badge placement and ninth decorative bezel key from manufacturer guide.
- [x] Prepare but **do not implement** the clinically consequential adjustment UX choice; recommendation in BUTTON_UX_RECOMMENDATION_v0.3.4.md.
- [x] Check CI passing desktop/360/320 and rendered screenshots for v0.3.4 (branch run 38052371541; main post-merge validation separately required).
- [ ] User decision: dual-mode study control scheme vs existing step buttons vs pure staged OEM-inspired workflow.
- [ ] Later: verify grouping and exact labels via public SIMV PC PS photo, distinguish visible Esens data from future actual Esens control.
- [ ] Do not block future GUI work solely due to missing private unit photograph. Retain no claim of firmware-exact pixel alignment.

## v0.3.5 — Dual parameter-control workflow
- [x] Approve UX C: default PB980-inspired select → adjust → Accept with optional legacy Quick Study.
- [x] Separate pending edit state from committed simulation data and guard stale editing.
- [x] Use model-valid educational increments, not unverified OEM parameter interlocks.
- [x] Preserve all 7 legacy quick controls and original waveform/CIRCUIT/help/reset behaviors.
- [x] Add dialog focus, Escape/Cancel, Enter Accept, keyboard arrows, mobile bottom sheet and in-dialog reset.
- [x] Expand pure unit tests (19 → 24); preliminary branch CI 38054608709 succeeded.
- [x] Verify editor-open/device/quick screenshots on 1440/360/320 and branch CI (38054960790).
- [x] Verify merged application commit CI on main (38055192585: SUCCESS); physical PB980 and actual handset remain unverified.
- [ ] Later consideration only: clinically reviewed conditional OEM settings, multi-param Accept All or truly interactive encoder; not within v0.3.5.

## v0.3.6 — Educational depth, help overlays and patch history
- [x] Add 13 evidence-linked conceptual education topics with nursing observations and known limitations.
- [x] Keep device-specific PB980 references separate from AARC 2024 and Merck general clinical guidance.
- [x] Add upper-screen manual modal and categorized patch-history modal; X/backdrop/Esc, focus and mobile sheet.
- [x] Keep v0.3.5 dual-control semantics and unchanged waveform/circuit logic.
- [x] Extend unit/browser regressions for help content, release filter and popups.
- [x] Latest PR test/browser/package CI + screenshot audit (run 38187368353; 29/29, browser and package PASS).
- [ ] Final Private main merge and clean post-merge CI.
- [ ] Later: subject-matter expert review of educational texts, actual PB980 firmware-specific workflow if device available (not a release prerequisite).

- [x] Final v0.3.6 Private main merge and post-merge CI completed (PR #4, run 38187571168; 29/29, browser, package SUCCESS).

## v0.3.7 — High-visibility LCD and waveform teaching tools
- [x] Inspect prior v0.3.6 app architecture and PB980 waveform/grid/cursor reference concept.
- [x] Reduce visual hardware imitation and raise contrast, typography and hit-target legibility without changing model semantics.
- [x] Add waveform grid on/off and paused cursor analysis (pointer, touch, slider and keyboard) based only on illustrative samples.
- [x] Retain static patient monitor labels, Accept/Cancel + Quick Study, CIRCUIT, manual and changelog data.
- [x] Add cursor math and 1440/360/320px browser regression tests.
- [ ] Final browser screenshot review, PR gate, and Private main CI confirmation.
- [ ] Later: clinician-reviewed physiological waveforms and carefully bounded PB980 GUI behavior (not silently assumed).

- [x] v0.3.7 screenshot review and PR gate complete (34/34 plus Chromium and package).
- [x] v0.3.7 merged into Private `main` PR #5 and exact code-commit CI 38192764211 passed.

## v0.3.8 — Preclinical teaching pilot
- [x] Implement introductory CASE tab with two structured fictional vignettes and 6 total formative questions.
- [x] Build pure independent case-state transitions, references and individual feedback.
- [x] Extend case-engine unit and browser tests for desktop/mobile, navigation persistence and device state independence.
- [x] Design staged medical/nursing content, simulation-curriculum and clinical review roadmap. See [preclinical educational roadmap](CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md).
- [x] Complete GitHub PR integration and exact merged-main CI, screenshot review.
- [ ] Subject-matter expert review and field pilot (**not claimed as v0.3.8 completion**).

- [x] v0.3.8 corrected PR branch 38/38 unit and Chromium/package gate passed (run 38198237425; 22 screenshots, selected desktop/320px CASE views inspected).

- [x] v0.3.8 PR #6 merged into Private main and exact app-commit CI 38198481423 test/browser/package SUCCESS.

## v0.3.9 — audited content and instructor preview
- [x] Version source bank and link pilot-case objectives, per-item evidence and explicit medical-review pending status.
- [x] Pure schema/evidence audit and fail-closed CASE presentation; negative malformed-content test fixtures.
- [x] Open instructor preview that **reveals answers**, never implies secured access or medical signoff.
- [x] Structured reflection and learner item-evidence review, page-only memory.
- [x] Current INACSL standards page references 2025 revisions; clinic-specific advice still awaits review.
- [x] Exact PR/main CI and 1440/360/320 screenshot review.
- [ ] External qualified reviewers sign clinical item validation (out of scope for automatic coding).
See [clinical content QA v0.3.9](CLINICAL_CONTENT_QA_v0.3.9.md).

- [x] v0.3.9 45/45 unit, Chromium desktop/360/320 and static package PASS on PR branch run 38203543362; reviewed 24 screenshots with desktop/mobile instructor preview.

- [x] v0.3.9 PR #7 merged into Private main; full code-merge CI 38203800899 test/browser/package SUCCESS.

## v0.4.0 — PB980 terminology and non-live alarm recognition
- [x] Crosscheck four alarm label/meaning topics against Medtronic PB980 Operator Manual chapter 6/Table 6-5.
- [x] Implement fourth ALARM tab with recognition exercises, feedback and source links, without actual sensor alarms.
- [x] Add 7/7 setting-vs-monitor glossary and permanent distinction between device display reference and modeled waveform.
- [x] Preserve original CASE / CIRCUIT / Help / waveform / staged device editor and quick study states in application architecture.
- [x] Add pure grading and glossary integrity tests and desktop/360/320 browser regression coverage.
- [ ] PR screenshot review, merge Private main, verify exact final SHA CI.
- [ ] Clinical SME sign-off and local MICU firmware/alarm protocol comparison (future).
See [PB980 alarm education design & evidence boundaries](PB980_ALARM_EDUCATION_v0.4.0.md).

- [x] v0.4.0 PR branch run 38208572810: **52/52 unit, Chromium desktop/360/320, package successful**; reviewed 28 browser captures for alarm UI.

## v0.4.1 completed scope
- [x] Student-first PEEP/FiO₂/VTE/f/fTOT/Ppeak/direct assessment six-card default UI.
- [x] Keep original seven settings with 3 highlighted core / 4 supplementary controls.
- [x] Make Help deep topics, CIRCUIT/ALARM and PB980 alarm details optional disclosures without removing functionality.
- [x] Review official PB980 software-version manuals and mark unknown hospital firmware; cite 8.4.4.3+ High PEEP Alarm guide example.
- [x] Add unit and 1440/360/320 browser regressions including collapse navigation and legacy controls.
- [ ] Independently clinically review and pilot contents with nursing students and faculty.
See STUDENT_FIRST_AND_PB980_VERSION_REVIEW_v0.4.1.md.


## v0.4.2 — core concepts → knowledge check → misconception review → CASE
- [x] 10 source-aware items covering six core concept cards, objective mapping and all-option feedback.
- [x] In-panel staged self-assessment, incorrect-concept revisit, original CASE 01/02 handoff, retake and post-completion open instructor preview.
- [x] In-memory assessment state separated from simulator, fixed monitor, waveforms and CASE.
- [x] Extend unit and Chromium scripts to cover 1440/360/320px and reset/tab persistence.
- [ ] Instructor/clinical SME content signoff and in-person student usability study: NOT completed through source-code changes.
See CORE_LEARNING_CHECK_v0.4.2.md for QA/evidence matrix.


## v0.4.3 — content QA and guided review (bounded, no real expert signoff)
- [x] 10-question faculty trace: explicit source interpretation limits and review prompts.
- [x] Remove private-repository link as false external evidence for app-specific static monitor behavior.
- [x] In-panel return-to-quiz navigation after concept rereading, with page RAM quiz state maintained.
- [x] Add clinical educator handoff matrix, blank review record, proposed deidentified student pilot protocol.
- [x] Extend tests for internal/external reference typing and review prompt coverage, plus browser navigation.
- [ ] Obtain independent qualified clinical review and site-specific PB980 firmware comparison (not performed by software CI).
- [ ] Run supervised user pilot with permission and deidentified findings (not performed).
See CLINICAL_REVIEW_HANDOFF_v0.4.3.md.


## CONFIRMED UX RELEASES — approved 2026-10-13; implemented in progressive v0.4.4–v0.4.6 branch
**Design baseline:** Private v0.4.3 FINAL `56e120b6ad4c192cfde7064a4997e42fb582d6e0`.
Detailed decisions, implementation invariants, risk register, patch sequencing and release-acceptance matrix:
[UI/UX final redesign plan v0.4.4–v0.4.6](UI_UX_REDESIGN_PLAN_v0.4.4-v0.4.6.md).

### v0.4.4 — three layout presets + two UI presentations
- [ ] Display presets: 학습 집중 (default) / 나란히 / 장비 집중.
- [ ] UI presentations: 기본 학습 UI (default) / 장비 탐색 UI.
- [ ] Preserve separate existing staged-vs-quick settings mode, settings, waveform, quiz, CASE and extra-learning state when switching layout/presentation.
- [ ] Hide/de-emphasize inert decorative elements in learning UI, not functional controls. Improve readable terminology, font, click/touch sizing, discoverability.
- [ ] Avoid naive whole-device transform scaling, mobile DOM/focus order mismatch, overflow or nested-scroll traps.
- [ ] PASS 3 × 2 presentation/layout permutations plus staged/quick regression; browser 1440/1280/1100/960/700/360/320; unit, Chromium and static package.

### v0.4.5 — press/hold, text input and setting-level default
- [ ] Keep Pending → Accept/Cancel transaction. Add strict direct-entry parsing, educational bounds, per-parameter precision/grid checks; no silent rounding or live waveform change before Accept.
- [ ] Hold +/- with pointer lifecycle cleanup, no double click on release, keyboard and touch coverage; remove decorative TURN from setting dialog.
- [ ] Dialog `이 항목 기본값` changes only the selected parameter Pending; retain header global `설정 초기화`.
- [ ] Preserve stale-edit guard, seven existing parameter settings/ranges, quick mode, keyboard focus and model/monitor separation.
- [ ] PASS boundary/invalid-input/blur/close/cancel/timer/state-independent regression across UI modes/sizes.

### v0.4.6 — goal-led CASE with separate per-CASE resume
- [ ] Display explicit prebrief, objective/roadmap, three original questions, stage guidance, and debrief.
- [ ] In-memory per-CASE states with not-started/in-progress/completed and explicit resume/restart; preserve each case's notes.
- [ ] Preserve original 2 × 3 questions/answers, core quiz and expert-unreviewed warnings, CASE-ventilator independence.
- [ ] Page refresh still clears quiz/CASE; no storage or PHI feature.
- [ ] PASS switching CASE 01 ↔ CASE 02, tabs, view/layout, device reset, retry, student/faculty preview and responsive regression.

**Release gates:** assess impact before each patch; run unit, feature, integration, actual Chromium/browser visual, and affected old-feature regressions; inspect screenshots; merge only after successful PR CI; verify final exact main SHA CI. Real expert content signoff and physical student pilot remain **separate, incomplete activities**.


### v0.5.2.1 delivery (2026-10-14)
- Four independent fictional CASEs: adult handoff and oxygenation decline unchanged + newborn MAS + severe infant RSV. 12 CASE questions, clinical signoff pending; no pediatric physiology simulation.
- v0.5.3+ original approved LAB plan still to be implemented separately.
