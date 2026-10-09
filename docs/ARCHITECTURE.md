# Architecture — v0.2.0

```text
User interaction (buttons)
  → src/app.js (DOM / tabs / help / ephemeral UI state)
  → src/sim-model.js (parameter metadata, pure bounded updates)
  → re-render settings
```

## Separated responsibilities
- `index.html`: screen structure, demo waveform SVG, accessibility labels.
- `styles.css`: layout and responsive behavior. No domain rules.
- `src/sim-model.js`: settings schema, initial state, increments, bounds and value formatting.
- `src/app.js`: DOM creation, UI transitions, tab and help rendering.
- `tests/model.test.mjs`: parameter boundary, immutability and rounding tests.

## Critical limits
At v0.2 the monitored data are fixed reference values, not outputs from parameter changes.
No physiology engine is present; do not wire physiological labels to UI convenience formulas.

## Planned state separation
```text
Simulation state (mode/settings/patient/lung mechanics)
  → deterministic engine / breath event
  → monitored values and waveform samples
  → view

Separate UI state (active help/circuit view/assembly step)
```

The actual circuit assembly depends on equipment and site-specific practice; don't assert a universal procedure.

## Deployment
Pure static app. Future URL deployment uses GitHub Pages or equivalent static hosting. No stored user data or backend required at this stage.
