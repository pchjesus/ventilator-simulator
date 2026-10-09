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

## v0.2.2 — CI result (2026-10-09)
- [GitHub Actions 37885689471](https://github.com/pchjesus/ventilator-simulator/actions/runs/37885689471): **SUCCESS** across `test`, `browser`, and `package`.
- Syntax verification and the five existing unit tests: passed.
- Chromium desktop: 1440px main screen, help, circuit steps, reset, example monitor isolation: passed.
- Chromium mobile: 360px + PEEP 0.1 and help: passed.
- Chromium narrow mobile: 320px no horizontal page overflow, setting interaction: passed.
- Keyboard: FiO₂ increment button retains focus after click; Enter increments again: passed.
- Screenshot artifacts uploaded, including 320px output.
- Not covered: actual Android/iOS hardware, PB980 manufacturer setting bounds, clinical model fidelity, a public website URL.

## v0.3.0 GitHub Actions verified
- Run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37932826738
- Outcome: `test`, `browser`, and `package` **success**.
- Numerical waveform tests: **8**; preexisting setting tests: **5**; syntax checks passed.
- Browser: all three traces, Pi/PS/PEEP changes, pause/resume, focus, reset, CIRCUIT, help, 1440/360/320px layouts, JS error capture.
- Visual evidence: `browser-screenshots` artifact with desktop/mobile/narrow captures; inspected for layout readability. Not pixel-level OEM fidelity or physical-device test.
- First browser run had ambiguous +1 vs +10 selector. Second surfaced an actual freeze-frame repaint race. Both were fixed and CI rerun successfully.
- Clinical validation, parameter bounds and OEM waveform equivalence **not tested**.

## v0.3.1 — Actual GitHub Actions verification (2026-10-09)
- Run [37942300189](https://github.com/pchjesus/ventilator-simulator/actions/runs/37942300189): **SUCCESS** (`test`, `browser`, `package`).
- Node unit tests: **16 passed, 0 failed**. Includes previous 13 and three additional numerical/safety cases.
- Browser: desktop 1440px; mobile 360px/320px; settings, help, CIRCUIT, reset, keyboard focus, waveform response, pause/resume and reduced-motion preference passed.
- Console/page script error capture: no errors observed in tested flows.
- Initial run [37942154751](https://github.com/pchjesus/ventilator-simulator/actions/runs/37942154751) failed **only** because a new test requested 2,001 samples when the implementation allows at most 2,000. Corrected the test input, reran successfully.
- Physical Android/iOS hardware, OEM GUI/pixel fidelity, manufacturer parameter bounds and clinical validity remain **unverified**.
