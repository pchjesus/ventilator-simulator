# v0.3.6 Clinical Education Evidence Review — 2026-10-12

## Scope and hierarchy
This application is a **nursing-student teaching aid**, not clinical decision support or PB980 operator training. Clinical statements paraphrase published sources and always distinguish: **manufacturer-specific** setting semantics; **general clinical evidence**; and **unmodeled simulated values**.

| Content | Manufacturer PB980 manual | AARC 2024 guideline | Merck Professional | Important limitation |
|---|---|---|---|---|
| FiO₂, PEEP, rate, Pi, Ti, PS, V-TRIG | Definitions and GUI-specific settings | Assessment of FiO₂/PEEP | Ventilation physiology | No real oxygenation, ABGA or trigger response |
| SIMV PC + PS | Device modes and breath type | Patient-ventilator assessment context | PC and PS conceptual behavior | No physiological breath synchrony algorithm |
| Pressure/Flow/Volume | GUI concepts | Ventilation assessment | Waveform interpretation and auto-PEEP | Synthetic teaching graphs; not clinically calibrated |
| Ppeak, Pmean, PEEP, I:E, fTOT, VTE, VE | Displayed monitoring vocabulary | PBW-adjusted Vt, Pplat, PEEP/autoPEEP | General ventilation | Entire monitoring banner **fixed** and disconnected |
| Nursing checks | Hardware/operation context | Airway security, cuff pressure, humidification, Vt, Pplat, PEEP etc. | Patient-oriented assessment | No bedside patient, no functional alarms |
| ABGA relations | Not a blood gas analyzer | Oxygenation/ventilation assessment | Respiratory gas concepts | ABGA computation not implemented |
| Circuit | PB980 circuit descriptions | Humidification, airway interface | Mechanical ventilation general | Conceptual only, not an assembly recipe |

## High-priority clinical care caveats
- An increase in FiO₂ does **not** deterministically give a specific SpO₂/PaO₂: shunt, underlying disease and current clinical state matter.
- In appropriate contexts PEEP can improve oxygenation but excessive PEEP can reduce venous return and have adverse hemodynamic effects.
- The **set** rate in SIMV is not necessarily the **total measured** rate; neither alone provides a full picture of alveolar ventilation.
- In pressure-targeted ventilation, delivered volume depends on lung mechanics, effort and resistance; displayed Pi is not identical to the actual measured Ppeak or plateau pressure.
- The presence of PS cannot create true patient effort in this app. Lower flow-trigger thresholds may be more sensitive, but leaks can autotrigger and insufficient sensitivity can miss effort.
- Observing expiratory flow failing to return to baseline can be a clue to air trapping/autoPEEP **in real clinical waveforms**; the app's plotted curves cannot diagnose this.
- AARC 2024 recommends assessment of tidal volume relative to **predicted body weight (4–8 mL/kg PBW in lung-protective ventilation assessment)**, plateau pressure, PEEP/auto-PEEP, and airway/cuff/humidification aspects. This is context for learning *what to assess*, not a parameter-setting prescription.
- Physical patient examination, alarms, ventilator readings and institution protocols take precedence over any study simulation.

## Traceability and update process
- Authoritative on-screen learning content lives in `src/education-content.js`; visible per-setting existing `help` text and OEM reference panel remain separate.
- Each topic declares source IDs, used to render live HTTPS links to the original sources in the right-side Help tab. No source content fetched dynamically and no copyrighted textbook chapters or screenshots bundled.
- `tests/education-content.test.mjs` checks source IDs, topic completeness and manual structure; browser tests check actual screen rendering and source-link security.
- Exact firmware version, hospital-specific circuit, adult/child settings interlocks and clinical validity cannot be inferred from this dataset.
  
## References (APA 7th)
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00). https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

Goodfellow, L. T., Miller, A. G., Varekojis, S. M., LaVita, C. J., Glogowski, J. T., & Hess, D. R. (2024). AARC clinical practice guideline: Patient-ventilator assessment. *Respiratory Care, 69*(8), 1042–1054. https://doi.org/10.4187/respcare.12007

Merck Manual Professional Edition. (n.d.). *Overview of mechanical ventilation*. https://www.merckmanuals.com/professional/critical-care-medicine/respiratory-failure-and-mechanical-ventilation/overview-of-mechanical-ventilation
