# PB980 reference audit (partial, 2026-10-09)

## Device identity and references
The intended clinical reference device is **Puritan Bennett 980** based on the MICU context.
Do not assume that a separate classroom lecture photo shows PB980; its model was not independently established from the image.

## Confirmed manufacturer-described behavior
- The PB980 presents a Vital Patient Data banner and configurable waveform layouts.
- In the patient setup quick reference, a parameter in the large-font display can be changed by a double tap and selection; waveform layouts are chosen via the Waveform Layout icon and Graphs tab.
- The operator manual documents a waveform pause feature.

## Educational UI differences
- The built-in small `+10/+1/+0.1/-0.1/-1/-10` controls and `?` per setting are project-specific teaching enhancements, **not** a reconstruction of manufacturer touch/knob steps.
- Current min/max and increments are placeholders and have **not** been verified against PB980 settings limits.
- Current waveform and monitoring are independent static examples, not patient measurements from the selected settings.
- The circuit drawing and assembly summary illustrate a generic flow path and are **not** manufacturer assembly instructions.

## Next evidence gates
1. PB980 GUI screenshot and named control mapping.
2. Verify each parameter's allowed range, mode dependencies, default and increment against appropriate operator manual sections.
3. Confirm the intended MICU circuit parts and sequence from the official instructions before adding animations.
4. Verify waveform changes against a documented respiratory model before showing physiological causal effects.

## References (APA 7th)
Medtronic. (2022). *Puritan Bennett™ 980 ventilator: Patient setup quick reference guide*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/puritan-bennett-980-ventilator-patient-setup-quick-reference-guide.pdf

Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

## v0.3.3 device-reference facts (2026-10-10)
Medtronic operator manual PT00101843A00, Table 11-9, printed pages 11-10–11-13:
| Parameter | Adult / PC reference range | Manufacturer resolution |
|---|---|---|
| O₂ | 21–100% | 1% |
| PEEP | 0–45 cmH₂O | 0.5 below 20, 1 at/above 20 |
| f | 1–100/min | 0.1 below 10, 1 at/above 10 |
| Pᵢ | 5–90 cmH₂O | 1 |
| Tᵢ (PC) | 0.2–8 s | 0.01 s |
| PS | 0–70 cmH₂O | 1 |
| V-TRIG (adult V-SENS) | 0.2–20 L/min | 0.1 |

These values are **manufacturer-reported reference data**, not the range/step implementation of the simulator's original teaching buttons. Dependent or conditional soft/hard limits are not represented. No matched firmware identification is available.

Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00), Table 11-9. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf
