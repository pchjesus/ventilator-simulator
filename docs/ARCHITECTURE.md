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
