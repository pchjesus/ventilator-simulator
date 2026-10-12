# DEVLOG

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
