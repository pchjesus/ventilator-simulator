# TEST_REPORT — v0.2.0

## Scope
Implementation introduces first web entrypoint, educational settings and CIRCUIT conceptual views.

## Automated checks
- `npm run check`: JavaScript syntax checks for model and UI.
- `npm test`: Node built-in unit tests of settings initial values, increments, bounds, rounding, invalid operations and immutability.

## Expected manual acceptance checklist (pending actual execution)
- [ ] Open http://localhost:8077/ and confirm all assets load without console errors
- [ ] Observe monitoring/waveform as clearly tagged static examples
- [ ] Increment and decrement each setting; clamp at bounds
- [ ] Reset after adjusting several settings
- [ ] Open ? explanations and return to CIRCUIT tab
- [ ] Switch parts/assembly overview/complete schematic and use prev/next
- [ ] Verify keyboard focus, desktop and narrow-mobile layout

## Explicitly not tested
Actual PB980 fidelity and range correctness, physiologic model (not implemented), clinical use, actual Android/iOS hardware, GitHub Pages URL availability.

Do not interpret source-code presence as browser acceptance evidence.

## GitHub Actions verification (2026-10-09)
- Workflow: [Ventilator simulator checks](https://github.com/pchjesus/ventilator-simulator/actions/runs/37880435097)
- JavaScript syntax check: **passed**
- Node model tests: **5 passed / 0 failed** (initial state, bounds, decimal arithmetic, invalid operations, immutability)
- Actual browser execution, manual screen/interaction review and real-device checks: **not yet verified**
- CI proves the tested source paths, not PB980 clinical fidelity or public URL deployment.

## Browser acceptance and screenshot review (2026-10-09)
GitHub Actions run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37883088395

- Chromium headless desktop (1440×900 viewport): PASS; initial UI, seven settings, seven static monitor values, increment, help, circuit tabs and assembly steps, reset.
- Chromium headless mobile (360×780 viewport): PASS; no horizontal overflow, PEEP +0.1, help tab interaction.
- Script/page console errors observed: none.
- Browser screenshot artifacts: `desktop.png` and `mobile.png` attached to the run.
- Screenshot visual inspection: two-column desktop composition and stacked mobile controls are legible; this is **not** a pixel-match test against PB980.
- Real phone, touch comfort and manufacturer clinical parameter confirmation: **not verified**.
