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


## v0.3.2 — Visual patch CI acceptance
- Run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37944924891 — SUCCESS for test, browser and package.
- Unit tests: 16 passed, 0 failed.
- Desktop Chromium 1440px: seven readouts, three waveforms, seven controls; focus, reset, help, circuit, pause and setting-driven trace changes work.
- Additional UI: curved bezel, left MENU strip, new Home/Help shortcuts work.
- Mobile Chromium 360/320px: settings and Circuit controls work; no page-wide horizontal overflow.
- Reduced-motion preference and playback remain functional; no JS page/console errors captured in tested flows.
- Screenshots retained in Actions browser-screenshots artifact; desktop/320px visually inspected.
- Manufacturer limits, pixel-perfect matching, physical phone touch experience and clinical accuracy: NOT validated.

## v0.3.3 — PB980 reference GUI patch (2026-10-10)
- Starting remote main head: `69aff76fd34cc2424acc35d410f7fb1a9cbc20de` (v0.3.2).
- Added three new manufacturer-reference consistency tests alongside 16 existing pure tests; extended browser checks for visual region geography, left graph labels, reference help and original controls.
- **Execution pending**: Do not report a CI success until the actual workflow run and screenshot evidence have been checked.
- Outside scope / still unverified: device-specific firmware pixel comparison, physical smartphone, true clinical parameter interlocks, actual ventilator waveform or clinical use.

### Actual implementation verification and visual regression (2026-10-10)
- First GUI implementation run [37962118564](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962118564): SUCCESS test/browser/package; 19/19 Node tests.
- Visual inspection of the three screenshot artifacts exposed a **real regression not caught by the then-current test**: mobile settings fell into four thin columns because late global CSS overrode the existing narrow breakpoint.
- Patched CSS to restore two-column settings at widths ≤550px. Added explicit 320/360px computed grid-column assertions to browser regression checks.
- Patched **application code** was verified in [37962366798](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962366798): SUCCESS test/browser/package; 19/19 units. Inspected desktop (1440), mobile (360), narrow (320) screenshots, confirmed readable two-column controls and no obvious overlap.
- The later test-only commit introducing explicit two-column assertions is covered by separate CI run [37962394683](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962394683); final outcome should be checked before main merge. Latest report should not treat an in-progress run as passed.
- Browser tests cover focus, settings, waveform/pause/reduced motion, circuit/help, layout, reset and JS errors. No actual PB980 pixel overlay or physical phone verified.

## v0.3.4 — Public reference GUI checks (2026-10-10)
- Base: v0.3.3 main e9a2ed4ca3ffb03b24781110a3c8841a6ee780a5 (private).
- No change to simulation domain, value adjustment or waveform computation.
- Added expected browser checks: green fixed C badge inside top patient data, nine physical visual key representations, narrow-screen element visibility, previous keyboard/settings/waveform/help/circuit/reset/motion/overflow checks.
- **Branch CI PASS**: [GitHub Actions 38052371541](https://github.com/pchjesus/ventilator-simulator/actions/runs/38052371541) — syntax OK, 19 unit tests passed, 0 failed; Chromium desktop/360/320, button, pause, keyboard, help, CIRCUIT, reset and no-overflow checks passed; package succeeded. Desktop and narrow 320px images inspected, source markers/9 keys as expected. Separate post-merge main checks remain to be observed; no actual PB980 fidelity or physical phone test.
- Unverified: device firmware/patient parameter parity and true clinical functions.

## v0.3.5 — Dual-control verification (2026-10-10)
- Base `main` v0.3.4: `54d21a404e743955d06f1e0adbf2ffddfbf643ba`.
- Initial branch run [38054608709](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054608709): **SUCCESS** across syntax, 24/24 Node tests, Chromium browser and static package. No failures reported.
- Pure tests cover separate pending/committed values, bounds, decimal steps, immutable Accept, unchanged Cancel, unknown setting and stale-edit protection.
- Browser checks cover device mode default, independent pending value, Cancel/Esc, ArrowUp+Enter Accept, modal reset, restored focus, Quick Study control parity, keyboard and responsive 1440/360/320, original waveform/Pi/PS/PEEP/rate/Ti behavior, reduced motion, help, CIRCUIT, reset, browser JS errors and package.
- Separate dialog-open screenshots were added to browser CI *after the initial successful run*. Inspect the latest run and screenshots before claiming final visual verification.
- Real device/physical smartphone, true PB980 knob/menu/conditional limits, firmware-identical UI and physiological validity remain UNVERIFIED.

### Final expanded visual verification — v0.3.5 branch (2026-10-10)
- [GitHub Actions 38054960790](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054960790): SUCCESS; unit, Chromium browser and static package all passed with additional screenshots.
- Chromium screenshots generated for each layout and workflow: `desktop.png`, `desktop-quick.png`, `desktop-editor.png`, `mobile.png`, `mobile-quick.png`, `mobile-editor.png`, `narrow-320.png`, `narrow-quick-320.png`, `narrow-editor-320.png`.
- Examined desktop editor, 320px device view, 320px open sheet and 320px quick view. Pending highlighted in yellow; Accept/Cancel and reset visible; no obvious clipping, Quick Study buttons remain independently shown in two-column settings tiles.
- No capture is a pixel comparison to verified PB980 firmware. Post-merge main CI remains a separate gate.

### Merged-main integration verification (v0.3.5)
- Merge PR [#3](https://github.com/pchjesus/ventilator-simulator/pull/3), squash SHA `762fea2cb03c747f6a6e1c9e94676436b8b4b71e`.
- Actual main-branch Actions [38055192585](https://github.com/pchjesus/ventilator-simulator/actions/runs/38055192585): **SUCCESS**, all `test`, `browser` and `package` jobs green; verified remote `main` and repository Private visibility.
- This subsequent report-only commit does not modify application code; CI should still be checked against its final commit before closing the patch.

## v0.3.6 — Clinical info and modal UX regression (2026-10-12)
- Base `main`: `41d1b80b97ec8de2f7d913836a83eb277f786bba`.
- Added 5 unit-schema tests covering seven per-setting topics, source links, 13-topic navigation, seven-part manual, release category definitions and filter immutability.
- New Chromium checks: desktop manual sections, linked references, release list & category filter, X, Escape, outside click, inside click stays open, focus restoration; 360px modal geometry and X; 320px native touch/backdrop close, filters and overflow. All existing editor/quick settings/CIRCUIT/waveform/reduced-motion assertions retained.
- Initial PR #4 run 38187105272 failed 1 content assertion (PS summary too short) and browser focus restoration on backdrop; corrections made and CI rerun required. These are test-caught defects, not a passing release.
- Manufacturer-certified clinical algorithms, patient-specific settings, actual ABGA/spO2, true ventilator alarms and physical mobile testing remain outside verification.

### Final v0.3.6 PR regression result (2026-10-12)
- After correcting the initially detected PS summary completeness and backdrop focus errors, [GitHub Actions #38187368353](https://github.com/pchjesus/ventilator-simulator/actions/runs/38187368353): **SUCCESS** for `test`, `browser`, and `package`.
- Node built-in suite: **29/29 passing, 0 failures**. No changes to waveform engine or educational parameter calculation.
- Chromium: native manual and version dialogs, 5-category filter, Escape/X/outside touch/click, focus handling, 13 evidence-linked learning topics, desktop 1440px, mobile 360px and 320px checks; original quick/device setting mode, waveform pause/reset/CIRCUIT still pass.
- Examined 15 browser screenshots from latest branch workflow, including the corrected narrow 320px `사용 설명서` heading, 320px patch filtering and desktop clinical help.
- PR merge + post-merge main CI is a **separate required gate**.
