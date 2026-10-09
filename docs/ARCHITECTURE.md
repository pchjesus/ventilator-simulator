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
