# Architecture — v0.3.0

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
