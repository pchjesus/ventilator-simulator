# Waveform model — v0.3.0 (educational preview)

## Scope and claims
This is a **deterministic illustrative waveform generator**, **not** a validated PB980 control algorithm or human-lung physiological model. It draws pressure, flow, and volume vs. time and is independent of the upper static example monitor banner. No model-based ABGA, oxygenation, alarms, leak, circuit mechanics, resistance, respiratory drive or clinical prediction is implemented.

## Input controls and effects
| Input | Illustrative waveform effect | Important caveat |
| --- | --- | --- |
| PEEP | shifts airway-pressure baseline and inspiratory plateau | Does not compute recruitment, circulation or measured PEEP |
| Pi | changes mandatory inspiratory plateau and volume/flow scale | Compliance is a fixed demo constant, not patient-specific |
| PS | changes spontaneous inspiratory plateau and volume/flow scale | Artificial breath efforts, not real patient triggers |
| f | sets idealized mandatory cycle period, 60/f seconds | No synchrony algorithm or breath stacking simulation |
| Ti | controls idealized mandatory inspiratory duration | Internally clipped to keep waveform events non-overlapping |
| FiO2 | **not modeled** in waveform | Changes study control only; not SpO2/ABGA |
| V-TRIG | **not modeled** in waveform | Does not detect or trigger breathing effort |

## Model details
- Mandatory event every 60/f seconds.
- For visual differentiation only, an artificial spontaneous event is inserted halfway through every second mandatory interval when the interval is at least 3 seconds and PS is positive.
- Airway pressure = PEEP + (Pi or PS) × a short ramp during inspiration; PEEP during expiration.
- Teaching-example nominal volume amplitude = 35 mL/cmH2O × (Pi or PS); **35 is arbitrarily selected, not inferred from a patient**.
- Inspiratory volume follows a half-cosine curve, from zero to a nominal amplitude, and inspiratory flow is its time derivative.
- Expiratory volume decreases exponentially back to zero, with flow as its derivative. This avoids contradictory independently drawn volume and flow.
- Fixed 16-second scrolling display; sampling 320 points per frame at a limited draw cadence.
- Breath phase colors distinguish mandatory inspiration, artificial spontaneous inspiration, and expiration.
- Pause freezes time-based scrolling; parameter changes can still update the frozen preview so students may compare traces.

## Numerical guarantees to verify
- Flow is the derivative of volume in each phase (units converted to L/min).
- Volume remains nonnegative and returns near zero at the next breath.
- PEEP shifts displayed pressure but does not change modeled flow/volume.
- FiO2 and V-TRIG do not falsely affect currently unsupported physiologic outputs.
- Extreme settings use bounds inherited from the **unverified study controls**, not manufacturer-authorized limits.

## Manufacturer reference vs. project invention
Official PB980 documentation describes the graphical user interface, patient data banner, waveform layout selection and pause functionality. This project references the broad screen structure, while its waveform equations, artificial spontaneous breaths, mini-step controls and calculations are original educational simplifications.

## Reference (APA 7th)
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator’s manual*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

Medtronic. (2019). *Puritan Bennett™ 980 ventilator: Patient setup quick reference guide*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/puritan-bennett-980-ventilator-patient-setup-quick-reference-guide.pdf
