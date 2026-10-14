## v0.5.3 — Pure waveform comparison & CORE-local LAB (2026-10-14)

```text
initialSettings() ─────┬──> baseline copy ──> generateWaveform(0,16,320) ─┐
                       └──> trial copy + fixed PEEP/f/FiO₂ ──> generateWaveform(0,16,320) ──┤
                               src/waveform-compare.js ──> common per-type min/max ────┤
                               CORE #core-labs static SVG (one selected type) <────────┘

Separate existing device:
  device committed state / Pending edit → legacy paintWaveforms(waveformTime)
  fixed MONITOR_REFERENCE → 7 independently fixed sample tiles
  CORE quiz RAM / CASE RAM → existing isolated learning state machines
```

- `compareWaveforms()` is a pure fixed-time computation. Input configurations and returned copies do not read the live device state. Pressure/Volume use a nonnegative 0 baseline, Flow a symmetric signed scale and explicit 0 line. Both curves in each plot use identical X/Y transforms.
- LAB-specific state: `labState.active`, `labState.experiment`, `labState.graph` and cached `labSnapshot` in `src/app.js`. Page-only RAM. Graph selection does not regenerate or reset experiment samples; switching tabs, layouts or viewport does not clear LAB progress. Explicit LAB exit resets LAB only and focuses its start button.
- The SVG is independent of device SVG paths, animation frame scheduling, Pause/Resume, waveform cursor/inspection or grid. Neither LAB nor generator models oxygenation, SpO₂, PaO₂, actual VTE, fTOT, hemodynamic/clinical alarm reactions, or actual PB980 behavior.
- Static CI packaging explicitly includes `src/waveform-compare.js` and Node dynamically imports **`dist/src/waveform-compare.js`** as a dependency-loading smoke test, in addition to existing CASE smoke tests.
- D5 question state and content are deliberately deferred to v0.5.4; no fourth top-level tab, new scoring, persistence, API or backend.

# Architecture — v0.3.0

## v0.5.1 — Read-only reading overlay (2026-10-14)

`#open-reading` → native `#reading-dialog` → `readingCategory` (monitor/settings/waveforms, presentation only).
- `MONITOR_REFERENCE` 원본 7개를 읽기 전용 렌더링. 환자 측정값 재계산/정렬 금지.
- `PARAMETERS`+committed `state`만 표시, `editState`(Pending) 접근/변경 없음.
- 파형 텍스트 메타 정보는 기존 `waveform-model.js` 경계를 설명. `generateWaveform()`과 실제 3 SVG 상태 불변.
- HTML native modal에 focus trap/기본 Escape, 종료 시 공용 `#open-reading`으로 focus 복귀. 다른 dialog가 열려 있으면 중첩 열기 금지.
- 추가 네트워크·저장소·백엔드·기계 파라미터 영향 없음. 7 viewport와 reflow/키보드는 `tests/browser-check.mjs`로 회귀 검사.

## v0.5.0 FINAL — 계층과 상태 분리 (2026-10-13)

```text
UI presentation/layout/deviceExpanded (view only)
  → original shared DOM sections (device and study moved, never cloned)
  ├── committed settings state → illustrative waveforms (PEEP/Pi/PS/f/Ti only)
  ├── fixed monitor reference × 7 (not computed)
  ├── in-memory core quiz (10 questions; independent from device reset)
  ├── in-memory CASE 01/02 sessions (6 questions; per-case answer gate)
  └── independently stored in-page debriefing notes (no network/persistence)
```

- **반응형:** `matchMedia(max-width:1100px)`는 기본 학습 보기에서 학습 패널을 먼저 렌더 순서로 이동한다. `max-width:700px`의 학습 화면은 장비 전체를 접되 명확한 펼치기/학습 복귀 버튼을 제공한다. 장비 탐색 모드에서는 화면 전체를 유지. 새로운 실질 설정·환자·CASE 상태를 만들지 않음.
- **교육 설명:** `src/student-learning.js`의 CORE_LESSONS 기존 값과 새 CORE_LESSON_EXTRAS/STUDENT_GLOSSARY; `src/app.js`에서 상세 카드/선택적 심화 렌더. 기존 원문·문항 정답 변경 없음.
- **CASE 진행:** `caseState`와 `caseSessions`(Map), `chooseCaseAnswer`의 진행 게이트 그대로. 완료된 이전 응답만 펼쳐 보기. CASE done에서 목표별 읽기 복습. 실제 환자 측정/처방/변화 모델은 없음.
- **형성평가:** `CORE_QUESTIONS` 콘텐츠 버전은 앱 버전과 별개. 문항 `evidenceKind=simulator-contract`는 앱 사용 이해; 나머지는 간호 기초 개념 이해로 명시. 임상 수행 능력 인증 아님.
- **교수자 자료:** `docs/FACULTY_CLASS_GUIDE_v0.5.0_DRAFT.md`는 별도 인쇄 문서. 정적 `dist/` 브라우저 ZIP에 포함되지 않음. 인증/역할 제어 없음.
- **보호 범위:** 의료·기기 감수 보류. 화면 표시의 7개 예시값, 파형 생성 데이터, CASE 가상 데이터는 독립이며 한 환자 데이터로 결합/해석하지 않는다.

---

## Current update flow

```text
study setting control
  → src/sim-model.js: immutable bounded setting update
  → src/app.js: update visible setting number (retain keyboard focus)
  → src/waveform-model.js: deterministic *illustrative* time series
  → src/app.js: SVG render pressure/flow/volume by breath phase
```

Independent UI state: active CIRCUIT/help panel, assembly step, preview pause, virtual time.
Patient data readout banner remains a **fixed classroom reference**, not model output.

## Module responsibilities
- `index.html`: PB980-inspired screen scaffolding, three SVG panels, accessibility, descriptions.
- `styles.css`: responsive layout, phase-colored paths; not a validated OEM GUI reproduction.
- `src/sim-model.js`: settings metadata and bounded immutable update rules (ranges currently for teaching, not manufacturer-certified).
- `src/waveform-model.js`: pure computation from setting state/time to illustrative samples (no DOM or browser side effects).
- `src/app.js`: controls, help/circuit tabs, animation clock/pause state, SVG path rendering.
- `tests/model.test.mjs` and `tests/waveform.test.mjs`: pure-model correctness checks.
- `tests/browser-check.mjs`: Chromium functional checks for mouse, keyboard, responsive layout, pause, three traces and regression.

## Why this separation matters
- New patient physiology can replace the illustrative computation without rewriting tabs and controls.
- Waveforms consume **same setting state** while measured patient data remain separate, preventing a fake numerical relationship.
- A paused plot can still be regenerated on setting changes to allow comparison without animating time.
- No database, backend or network dependency; static site runs locally via HTTP.

## Important limitations
The model is not PB980 breath control, does not account for lung resistance, active patient effort, automatic triggers, carbon dioxide, oxygenation, tidal volume measurement or alarms.
See [WAVEFORM_MODEL_v0.3.md](WAVEFORM_MODEL_v0.3.md) and [PB980_REFERENCE_AUDIT.md](PB980_REFERENCE_AUDIT.md).

## Next safe milestone
Verify actual PB980 screen geometry and documented operating ranges against model-specific manufacturer manual/screenshots; only then consider correcting mode-specific controls.

## v0.3.1 numerical/accessibility boundaries
- Illustrative model expiry: `V(v)=V_peak * exp(-3.2*v)*(1-v)^2` and corresponding analytic `dV/dt` for flow. This guarantees a zero-volume and zero-flow endpoint by construction, **not** patient physiological accuracy.
- Waveform sampling rejects invalid caller input independently of the screen control bounds. The UI and numerical layer still remain separate.
- The display checks `prefers-reduced-motion` on load, initially pauses movement when requested, and allows the viewer to explicitly resume. A paused display is not repainted every ~85 ms.

## v0.3.5 staged vs immediate state architecture
```text
Control mode: device (default) or quick (UI-only)
  device tile selection → setting-editor.beginSettingEdit(committed, id)
     → local {id, original, pending} + modal
     → stepSettingEdit(pending, valid classroom increment)
     → Accept → acceptSettingEdit(committed, edit) → new committed state → refreshSettings + paintWaveforms
     → Cancel / Esc → discard pending + return focus (no waveform state change)
  quick ± button → existing sim-model.adjustSetting(committed, id, delta)
     → committed state → refreshSettings + paintWaveforms

Only committed state → waveform-model.generateWaveform.
Fixed sample monitor remains wholly independent from all the above.
```
No new database, native browser storage, backend or dependencies. UI-only control mode always starts in device mode after reload; switching never changes a setting itself.
The staged editor performs an original-value match on Accept to prevent a stale dialog from overwriting a more recent state value. Modals are single-setting only; original study bounds remain authoritative because the actual PB980 conditional limits have not been modeled. `tests/setting-editor.test.mjs` protects these invariants and Chromium checks verify browser states, focus and responsive bottom sheet.

## v0.3.6 information architecture
- `src/education-content.js` exports verified-reference URL registry, 13 structured Korean learning topics and the seven-section manual.
- `src/release-notes.js` exports curated chronological category-coded notes and a pure category filter.
- `src/app.js` renders both through DOM APIs using `textContent` rather than injecting remote/source HTML. The per-param `explain()` contract and stable help selectors are preserved.
- Native `dialog.showModal()` is used for top info popups; independent from `#setting-editor`. Backdrop pointer dismissal is accepted only outside dialog bounds and restores focus to its triggering toolbar button.
- No runtime requests, new dependencies, persisted state, patient model or waveform changes. New modules included in `dist/src` and syntax check.

## v0.3.7 waveform inspection state isolation
```
committed settings + animation clock
  -> waveform-model.generateWaveform() (320 synthetic samples / 16s)
  -> app.paintWaveforms() (same 3 paths as before)
  -> waveform-inspector.inspectAt(samples, ratio)
  -> readout + shared three vertical cursors (presentation only)
```
- Independent UI state: `inspectorActive`, `pausedBeforeInspection`, `inspectionRatio`, `gridVisible`. All are transient, never persisted, never affect settings or fixed patient monitoring.
- Enter analysis: store prior pause flag, freeze, render synthetic sample readouts; exit: restore prior pause flag, hide cursor and inspection panel. Resume inside analysis closes analysis then resumes playback.
- The slider's native keyboard handling provides accessible seek; pointer hit-testing uses each SVG's bounding rectangle.
- Grids are CSS background toggled on one shared graph-area class; phase colors and waveform paths remain model driven and unchanged.
- CSS appended as new version layer to preserve stable existing selectors. A later isolated cleanup/refactor is optional only after screenshot and accessibility review, not mixed into this patch.

## v0.3.8 independent CASE education
```
src/preclinical-cases.js (2 fictional vignettes, objectives, options, references)
         ↓
src/case-engine.js (start, choose, advance, score: pure functions)
         ↓
src/app.js → #panel-case (presentation, in-memory caseState)
```
Case state is not connected to `sim-model.js`, `waveform-model.js`, `waveform-inspector.js`, `setting-editor.js` or `MONITOR_REFERENCE`. The two simulated cases never alter the device's own visual values, making v0.3.8 a separate **cognitive simulation rather than a physiological patient model**. Grouping CASE with Help/CIRCUIT updates only side-panel visibility and selection states, preserving all existing button selectors and tab behavior.

## v0.3.9 content integrity boundary
```
src/preclinical-cases.js (versioned fictional case items, objectives, source IDs, pending review)
  -> src/case-quality.js (pure schema/referential integrity: error list, not medical signoff)
  -> src/app.js CASE (error => fail-closed; success => list/student or optional open instructor preview)
  -> src/case-engine.js (same immutable learning answer state; untouched)
  -> app.js reflectionNotes Map (current-page RAM only, not scored or stored)
```
- `caseAudit` computed once on module load for immutable static bundled contents; no network lookups, localStorage or scoring side effects.
- Separate `reviewerCaseId` is only which source-preview card is expanded, never medical `approved`; learn/exam authorization **not available**.
- `caseState` retains prior transition logic. Reflection inputs are stored separately by case ID and only updated on input; re-render restores them after tab change; replay deletes notes.
- No change to `sim-model.js`, `waveform-model.js`, `setting-editor.js` or fixed top monitor reference values (except version string).

## v0.4.0 non-live alarm study module
```
src/sim-model.js (7 settings metadata + 7 fixed readouts) READ ONLY
             ↓
src/device-learning.js (15 display terms, 4 alarm lessons, pure grading/audit)
             ↓
src/app.js local ALARM state (selected lesson, chosen response Map, filter)
             ↓
#panel-alarm (text-only educational card; no changes to device LCD)
```
- `src/waveform-model.js`, `src/case-engine.js`, `src/setting-editor.js` have no dependency on alarm module.
- No timer, patient signal, hardware inputs, sound, alarm limit setting, device transport or persistence is introduced.
- `auditDeviceEducation()` compares glossary IDs to `PARAMETERS`/`MONITOR_REFERENCE` to prevent an omitted setting or readout when device screen is later extended.
- Note: imported case content and this catalog are separate educational domains: combining them into dynamic simulated patient safety messages needs a future planned clinical safety design gate.

## v0.4.1 student-first UI separation
src/student-learning.js exports core teaching concepts, metadata tiers, references and audit. src/app.js renders these read-only in #panel-core and sets initial active study tab to core.
The existing CIRCUIT/ALARM panels are retained verbatim behind the #extra-learning details control, with safe restore-to-core on close. All 7 setting tiles stay in existing order; a data-learning-tier attribute only changes CSS emphasis.
No state transitions in waveform model, device setting editor, case engine, alarm lesson scoring or monitor examples.
src/device-learning.js exports manufacturer catalog version uncertainty and official documentation links only; no PB980 hardware revision detection.


## v0.4.2 isolated core formative check
Student-learning lessons/sources (read-only) → src/core-quiz.js (10 items, pure immutable state operations, schema audit) → src/app.js (independent coreQuizState in RAM and #core-quiz-root rendering) → existing concept-card review / existing CASE tab navigation.
No write path reaches the device state, pending setting editor, fixed monitor example values, waveform engine, CASE state/reflection, alarm bank or circuit.
The rate-static item cites this app's README as an implementation contract, not a manufacturer claim. No database, new browser tab, login, API, or automatic patient physiology is introduced.
1440px / 360px / 320px browser regression is required.


## v0.4.3 documentation and state boundaries
- `src/core-quiz.js` retains question content and a separate `CORE_REVIEW_GUIDE` keyed by stable question IDs, checked by `auditCoreQuiz`. Global review approval stays `pending/false`.
- External source IDs point to HTTPS medical reference pages; the `app` source has `scope:"internal"` and no URL. UI renders it as plain explanatory text, never as a link to a private repository.
- The concept-card return button only scrolls/focuses the existing quiz area. It does not reset `coreQuizState`, `caseState`, device setting state, waveform time, or fixed monitor values.
- No new tabs or runtime dependencies. Faculty handoff and future pilot protocol are repository documentation, not execution of review or data collection.
