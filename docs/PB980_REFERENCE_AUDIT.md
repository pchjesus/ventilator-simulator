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
