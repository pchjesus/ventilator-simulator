# PB980 GUI reference comparison — v0.3.3 (2026-10-10)

## Target and evidence limits
Educational adult invasive SIMV with PC mandatory and PS spontaneous breaths. The manufacturer operator manual Figure 4-1 (GUI geography) and Table 11-9 (parameter ranges) are the authoritative references. A Taipei Veterans General Hospital normal-monitoring photo corroborates the broad external appearance, but its firmware version and precise mode are not verified. There is no version-identified, geometry-calibrated SIMV PC + PS reference screenshot. This is **not** an OEM-exact emulator.

| Region | Evidence status | v0.3.2 | v0.3.3 | Remaining gap |
|---|---|---|---|---|
| Vital Patient Data | Official manual: top configurable values | After extra status header | First strip in display with explicit fixed-example flag | Still disconnected from illustrative waveforms |
| Breath indicator | Official manual: breath-dependent A/C/S | Static C implied live behavior | Static C explicitly labelled fixed example | No dynamic breath synchronization |
| Waveforms | Official manual: central configurable graphics | Three stacked dark plots, above-plot captions | Labels and values left of plots, more contiguous black region | Physiological accuracy, actual scales/layout not validated |
| Prompt | Official manual: under waveform area | Study status in bottom settings | Study-only prompt between waveform and settings | Not OEM soft/hard-bound message |
| Current settings | Official manual: bottom center with dialogs/rotary knob | Educational step tiles | SIMV/PC/PS/V-TRIG grouping cue | OEM dialog/knob, visual coordinates and conditional constraints absent |
| Constant access | Official manual: right lower Home/Configure/Logs/O₂/Help | Home shortcut opened Circuit (misleading) | Study/EDU and Edu Help explicitly labelled; other icons illustrative | Clinical OEM actions unimplemented |
| Device bezel | Official manual and external real-device photo | Blue shell, static knob & keys | Preserved | Static stylized representation |
| Device parameter ranges | Official manual Table 11-9 (adult/PC) | Unverified educational bounds | Verified adult reference values documented and visible in each ? help | Study buttons still have separate teaching ranges |
| Responsive | Project web choice, not PB980 hardware | 360/320 stacking | Maintained | Not hardware pixel geometry |

## Verification levels
- **Manufacturer verified:** region relationships in Fig. 4-1; adult settings O₂ 21–100% at 1%; PEEP 0–45 cmH₂O at 0.5 below 20/1 thereafter; f 1–100/min at 0.1 below 10/1 thereafter; Pᵢ 5–90 cmH₂O at 1; PC Tᵢ 0.2–8 s at 0.01; PS 0–70 cmH₂O at 1; V-SENS adult 0.2–20 L/min at 0.1.
- **Real equipment visual observation:** blue enclosure, black central waveform field and blue numerical bands from Taipei Veterans General Hospital teaching photo.
- **Design inference:** color/spacing/typography/pixel details, left chart label width, simplified physical keys and adaptive responsive reflow.
- **Unverified:** one firmware-identified GUI screenshot, exact OEM axis values, real touchscreen workflows/knob, clinical accuracy, true conditional hard/soft bounds or compatible hardware controls.

## Version-specific verification
CI unit tests, real browser tests, screenshot visual review and their exact results must be recorded in TEST_REPORT after actual execution. Implementation is not verification.

## Explicit UX decision and risk
The originally available +0.1/-0.1 buttons conflict with actual OEM resolutions (e.g. PC Pᵢ and PS use 1 cmH₂O). The educational state updater and its teaching bounds remain unchanged by design. Manufacturer data are sourced reference material in the ? panel, not asserted active clinical limits. Introducing manufacturer-correct interlocks requires a separate UX mode and tests, not silent rounding under familiar controls.

## References (APA 7th)
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00), Figure 4-1 and Table 11-9. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

Medtronic. (n.d.). *Puritan Bennett™ 980 Series Ventilator: In-service videos*. https://www.medtronic.com/en-us/healthcare-professionals/products/respiratory/mechanical-ventilation/ventilators/puritan-bennett-980-series-ventilator/in-service-videos.html

Taipei Veterans General Hospital. (n.d.). *Introduction to intensive care unit equipment* [Nursing education webpage]. https://ihealth.vghtpe.gov.tw/media/1162
