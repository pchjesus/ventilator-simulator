# Development Roadmap (checked against GitHub 2026-10-09)

## Phase 0 — Verify reference and baseline
- [x] Inspect repository, README/AGENTS/SPEC and initial commit
- [x] Identify MICU webapp patterns to reuse (separation, regression, reporting)
- [x] Choose PB980 as primary device reference from user context
- [ ] Validate exact GUI and supported increments against PB980 operator manual / confirmed screenshots

## Phase 1 — First web MVP (v0.2.0)
- [x] Add runnable `index.html` + dependency-free modules
- [x] Create monitor / example waveform / setting sections
- [x] Add parameter step controls + `?` explanations + reset
- [x] Add right-side CIRCUIT *concept* views (not real assembly)
- [x] Basic pure-function automated tests
- [x] Automated Chromium desktop, 360px and 320px acceptance checks
- [ ] Manual review on physical PC and smartphone
- [x] Private GitHub code/Actions review selected; public URL release deferred

## Phase 2 — Reference-consistent controls / dynamic waveform
- [ ] Exact PB980 mode settings, valid ranges, increments and tooltips from manuals
- [ ] Separate normal breath state/events from visual curves
- [ ] Pressure, flow and volume waveform generated from a documented simplified model
- [ ] Mandatory/spontaneous breath distinction and clock/pause/reset

## Phase 3 — Circuit learning
- [ ] Confirm specific circuit profile and component connections
- [ ] Illustrated/animated parts and assembly guidance
- [ ] Clear flow direction and optional fault demos

## Phase 4 — Patient & ABGA
- [ ] Simplified respiratory mechanics (compliance/resistance/drive)
- [ ] Educator-reviewed relationships for oxygenation/ventilation
- [ ] ABGA demonstration with explicit assumptions

## Phase 5 — Alarms and evidence-based learning cases
- [ ] Alarm logic tied to state
- [ ] Small branching nursing-student scenarios (e.g., COPD, ARDS, weaning)
- [ ] Per-case source, applicability and clinical review checklist

## Continuous validation
- Per patch: unit + affected feature + regression verification
- Before release: live browser, mobile, clinical content and deployment checks
- Do not label unverified behavior as validated

## v0.2.2 reliability improvements
- [x] Preserve keyboard focus during repeated parameter adjustment
- [x] Enable manual workflow trigger in GitHub Actions
- [x] Document how to inspect and run the private project
- [x] Manufacturer reference audit (partial only, limits not yet verified)
