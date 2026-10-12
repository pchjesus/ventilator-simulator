# PB980 Alarm & Screen Literacy — v0.4.0 Education Reference
> 2026-10-12 · nursing undergraduate pre-placement learning only · **not a real PB980 alarm implementation**

## Motivation and baseline
- Baseline: `main` v0.3.9, commit `249bb3b132679b15d44e56136a0927be3f839fac`.
- Preserve the existing PB980-inspired internal information hierarchy: fixed monitor example → three illustrative synthetic waveforms → simulated settings → right-side CIRCUIT/?/CASE learning.
- v0.4.0 adds a separate **ALARM 학습** tab for recognizing 4 manufacturer-documented alarm terms and learning student-safe patient reassessment / communication principles.
- The user has not supplied clinical protocol access, PB980 firmware revision, real patient alarm logs or a live device. **No alarm triggers, priority timers, audio, real values or automatic physiologic relationships are introduced.**

## Sources verified and limits
1. **Manufacturer primary source:** [Medtronic Puritan Bennett 980 Series Ventilator Operator's Manual](https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf), Chapter 6 / Table 6-5 (printed pages 6-16, 6-17, 6-24), covering APNEA, CIRCUIT DISCONNECT, high circuit pressure (↑PPEAK) and low exhaled minute volume (↓V̇E TOT).
2. **Professional clinical guideline:** [AARC 2024 Patient–Ventilator Assessment](https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/), defining a comprehensive patient-and-ventilator assessment including bedside examination, airway, measured physiologic data, ventilator and humidification. It does **not** itself specify a particular Korean nursing student's scope of practice or create an emergency treatment algorithm.
3. **Institution-dependent items** — actual alarm priority, limits, alarm silencing/reset, manual ventilation, intubation / airway procedures, emergency notification pathways — are not simulated. The trainer must follow supervised clinical practice and local hospital rules.

### Crosswalk: manual-supported vs interpretation vs implementation
| Term | Manual-derived base meaning | Teaching implication (not device output) | App implementation |
|---|---|---|---|
| CIRCUIT DISCONNECT | Ventilator detects disconnect; manual directs checking patient and reconnecting circuit | Patient ventilation observation, notify supervisor promptly, assess airway/circuit *with supervisor* | Separate sample card, one quiz question; no real circuit changes |
| HIGH CIRCUIT PRESSURE (↑PPEAK) | Measured pressure meets configured limit; manual instructs check patient, circuit, ET tube | Do not label a specific cause using one indicator or independently raise limit | Separate sample card, one quiz question; no pressure threshold model |
| LOW EXHALED MINUTE VOLUME (↓V̇E TOT) | Measured exhaled minute ventilation meets low alarm limit; manual instructs patient and setting check | Patient-centered observation, report trends and uncertainty | Separate sample card; upper fixed V̇E TOT number does **not** cause alarm |
| APNEA | Set apnea interval passes without breathing triggers; manual instructs patient/settings check | Observe patient breathing, notify responsible team immediately | Separate sample card; no apnea timer or backup breaths |

**Important:** Table 6-5 documents variable priorities and duration/breath-count conditions. This build intentionally does not reproduce them; no static alarm priority label is applied to every hypothetical episode.

## User interaction design
1. Open the right-side **ALARM 학습** tab. The top disclaimer states “실제 발생 경보 아님”.
2. In **알람 인지** choose one of four cards, view manufacturer meaning, fictional cues, student observation/report priorities, select one of three formative choices, receive feedback and source links, retry or return to list.
3. In **설정·모니터 용어** switch among setting parameters (7), fixed monitor readouts (7), and mode reference (1). This distinction is central to avoiding confusion between configured values and measured values.
4. Tab switching preserves already answered ALARM choices in **current-page memory**. Patient vignette state in CASE is independent. Main Reset and device Accept/Cancel never change ALARM choices.
5. All references are linked through static HTTPS anchors with `rel="noopener noreferrer"`. Page contents are constructed through DOM `textContent`; no external application data or patient records collected.

## Architectural and regression controls
```
src/device-learning.js (immutable alarm lessons + terminology crosswalk + pure selection/audit)
       ↓
src/app.js (ALARM UI only: lesson selection, answer Map, glossary category)
       ↓
#panel-alarm (fourth right-side study panel)
```
- No imports from alarm UI into `sim-model.js` or `waveform-model.js`.
- `src/device-learning.js` **reads** simulator definitions to ensure term coverage matches seven settings and seven hardcoded monitor values. It does not write to these modules or compute alarms from them.
- `auditDeviceEducation()` asserts catalog term coverage, unique IDs, response key and source URLs. Clinical accuracy still requires expert content review.
- Node tests cover alarm IDs, source HTTPS links, answer scoring, immutability and 7/7 mapping. Browser CI verifies desktop 1440px, mobile 360 and 320px alarm cards/quiz/glossary, as well as prior setting editor, waveform, circuit and CASE.
- Real PB980 firmware matching, nurse educator review, physical Android/iOS testing and clinical learning-outcome validation remain **pending**.

## Next steps
- v0.4.1: confirm localization/manual software version with ICU staff, review the four alarm cards item by item, label any device model/version-specific exceptions.
- v0.4.x: extend instructor-reviewed glossary and patient-safety recognition cases; no fictional alarm thresholds presented as validated operation.
- v0.5+: if requested, integrate case-specific alarm recognition with explicit **fictional scenario state**, visually separate from actual PB980 simulated waveform; seek user decision and clinical educator approval before linking to dynamic outputs.
- v1.0 remains blocked until qualified educators validate item text, scope, site-specific workflows and learner usability.
