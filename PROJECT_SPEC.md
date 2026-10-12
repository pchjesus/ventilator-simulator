# Project Specification

## 1. Product concept
학생이 실제 ventilator를 보고 조작하는 것처럼 학습할 수 있는 인터랙티브 교육용 simulator.

## 2. Main screen
실제 ventilator의 화면을 기준으로 한 single-screen 중심 구조.

### Monitoring
- Ppeak
- Pmean
- PEEP
- I:E
- fTOT
- VTE
- VE

### Waveforms
- Pressure-Time
- Flow-Time
- 향후 Volume-Time

### Settings
- Mode
- Pi
- PS
- Frequency
- FiO2
- PEEP
- V-TRIG
- Ti
- 향후 E-sens, rise time 등

각 parameter는 장비 화면과 어울리는 작은 +/- controls와 `?` help를 갖는다.

## 3. Right-side tabs
### CIRCUIT
- Components
- Assembly
- Completed circuit
- Gas-flow animation

### PATIENT (future)
- Respiratory effort
- SpO2
- HR/BP
- Lung mechanics

### ABGA (future)
- pH
- PaCO2
- PaO2
- HCO3-
- SaO2

### ALARM (future)
- High airway pressure
- Low minute ventilation
- Apnea
- 기타 장비별 alarm

### CASE (future)
- COPD
- ARDS
- Pneumonia
- Weaning
- 기타 교육용 case

## 4. Simulation chain
Vent settings
→ lung/respiratory model
→ patient response
→ waveforms
→ monitoring values
→ ABGA / SpO2
→ alarm
→ learner intervention
→ outcome

## 5. First milestone
사진의 SIMV(PC)+PS 화면을 최대한 정확하게 재현하고, parameter controls와 help popup을 동작시키는 것.

## v0.3.5 study-control UX
- Default PB980-inspired one-parameter adjustment: user selects tile, edits pending study value, commits with Accept or discards with Cancel/Escape. The modal shows original/modified values separately.
- Optional Quick Study mode restores immediate plus/minus controls and original study increments exactly.
- Switching modes does not change values. The only waveform input is the confirmed setting state; Help, CIRCUIT, reset and keyboard access remain.
- No assertion of manufacturer-certified dial resolution, interlocking limits or real ventilation changes. The top monitored data are still fixed instructional references.

## v0.3.6 help, manual and categorized release history
- Single-screen layout adds **top explanatory manual icon** and **patch history icon**; both launch native modal overlays dismissible using X, outside click/touch, or Esc. Screen-reader dialog title and keyboard focus return required.
- Parameter ? remains the entry point to per-setting reference and expanded clinical/nursing interpretation. The right panel additionally offers 13 topical study selectors.
- Clinical text must separate established general principles from specific PB980 manual facts and from the unmodeled simulator behavior. Every topic has explicit sources.
- Release notes are grouped by version, with five category filters. The categories refer to changes actually shipped.
- None of the popups may change committed settings, pending edits, control-mode switching, waveform state, reset or CIRCUIT navigation.
