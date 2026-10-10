# PB980 public reference evidence audit — v0.3.4 (2026-10-10)

## Reference selection without private device access
Actual clinical unit screen not available. Use publicly accessible manufacturer quick guides and independently published full-device/normal-ventilation photographs; do not use downloaded copyrighted photos as repository assets. Firmware and operating modes vary. Document rather than fabricate missing evidence.

| Observation | Source level | Consequence / confidence |
|---|---|---|
| Nine physical controls: display brightness, display lock, alarm volume, manual inspiration, rotary encoder, inspiratory pause, expiratory pause, alarm reset, audio pause | **Manufacturer verified**, 2022 touchscreen quick reference, p. 3 (PDF index 2) | Added missing *Audio Pause* decorative bezel item; all remain noninteractive |
| C/A/S breath identifier is visible at far left of top patient data area in public **normal ventilation** photos | **Public equipment photo**, education examples (eCampusOntario and PB980 image on third-party pages); manufacturer quick guide p. 5 vital patient data | Move fixed C demonstration badge to left of monitoring readouts. This does not validate phase-specific behavior. |
| Top patient-data banner configurable; up to 8 displayed, 6 more scrolled | **Manufacturer verified**, patient data quick reference | Keep fixed 7 teaching readouts; do not imply screen supports configurable values yet |
| Touch-select/rotary dial/Accept or Accept All; yellow italic pending settings in manual | **Manufacturer verified**, PB980 Operator's Manual chapter 4 and manufacturer training materials | Document dual-workflow UX proposal; NOT implemented without user decision |
| SIMV PC PS V-TRIG grouped lower row incl. f/Pi/Ti/PS/V-SENS/O2/PEEP/Esens, from Korean nursing education blog (2022-01-03) | **Observed non-manufacturer image**, device/firmware not independently verified | Candidate for mode-grouped layout in future, not yet used as precise coordinate/clinical truth |
| Screenshots with ventilator UI in A/C or setup mode | **Public observations** only | Do not assert these are SIMV PC+PS normal-ventilation images |
| Exact pixel coordinates, font family, firmware, patient profile, alarm interlocks, parameter dependencies | **Unverified** | Do not implement or claim exact reproduction |

## v0.3.4 narrow patch
1. Move the *static demonstration* green C label from the separate status ribbon to the left edge of the patient data row while retaining a fixed-example qualifier. No physiological engine changes.
2. Add missing ninth physical keyboard item (Audio Pause), hidden from actual functional navigation.
3. Preserve all seven study controls, mode help, CIRCUIT, waveform/pause, reset, mobile and accessibility behavior.
4. Add desktop and narrow mobile smoke/regression assertions to distinguish implementation from evidence.

## UX choice reserved
**Recommended**: dual mode with default manufacturer-*inspired* Touch → Adjust → Accept workflow and optional study quick controls in the separate right learning panel; pending vs committed state and conditional OEM device limits must not be conflated. See `BUTTON_UX_RECOMMENDATION_v0.3.4.md`.

## References (APA 7)
Medtronic. (2022). *Puritan Bennett™ 980 ventilator: Touch screen quick reference guide* [Within quick reference collection; pp. 3–4]. https://healthcare21.eu/product/ventilators/?attachment_id=23218&download_file=1tijonmnepayy

Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00), chap. 4. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

검은 콩. (2022, January 3). *ventilator) PB ventilator, PSV mode 분석하기*. 글 쓰는 간호사. https://tulipblog.tistory.com/89

eCampusOntario. (n.d.). *Paramètres obligatoires en mode contrôlé – L’ABC de la ventilation mécanique* [PB980 photograph]. https://ecampusontario.pressbooks.pub/labcdelaventilationecanique/chapter/parametres-obligatoires-en-mode-controle/

## Evidence-caution note
This guide's appearance and included image correspond to published examples, not a confirmed software-version-specific SIMV-PC+PS clinical display. The user cannot access the original unit for pixel or clinical validation.
