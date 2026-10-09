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
