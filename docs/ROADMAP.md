# Development Roadmap (checked against GitHub 2026-10-09)

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
