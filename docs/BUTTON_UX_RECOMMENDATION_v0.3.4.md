# v0.3.4 recommended parameter control UX — review before implementation

## Confirmed PB980 workflow vs simulator
PB980: touch setting → turn rotary encoder to adjust → Accept/Accept All to commit. Settings pending confirmation can be differentiated (yellow italic), and dependent/soft limits may affect allowed entries (manufacturer manual, ch. 4). Current simulator: immediate per-setting educational step clicks commit state directly, update waveform instantly, and have separate unverifiable classroom bounds.

## Options
| Option | UX | Benefits | Risks |
|---|---|---|---|
| A. Always-visible step keys (current) | All tiles show +10/+1/+0.1 etc. | Minimal effort, regression risk low, excellent rapid waveform comparisons | Visually cluttered, teaches different operational mental model from PB980 |
| B. Pure hardware-look Touch→Turn→Accept | Tiles read-only until selected; dial or keyboard controls edit pending values, Accept to apply | Highest recognition similarity and procedural practice | Harder on phone, longer learning curve, would conceal existing convenient controls |
| **C. Dual workflow (recommended)** | **Default PB980-inspired** settings strip; select tile to show focused edit panel with step keys and simulated turn dial, Cancel/Accept. **Quick study** switch restores existing immediate controls in education panel/overlay | Realistic device recognition while preserving existing convenient exploration; suitable for progressive learning | Two distinct operation paths, separate pending/committed states, more regression tests |

## Proposed C behavior
- Main visual mode (default): compact PB980-inspired setting fields. Click/tap or keyboard Activate on a field to open a **study adjustment** dialog/sheet.
- Edit state: `{activeId, pendingValue, originalValue}`; immutable `committedSettings` stays source of truth of waveforms. Never update waveform until Accept; Cancel/Escape discard. After Accept, apply in one state update, update readout/status/graphs and return focus to selected setting.
- Editor: labeled `– / +` at manufacturer's **documented base resolution** where supported, optional coarse step, and simulated wheel; up/down arrows supported. Gray or yellow `pending` vs white `committed`. Explicit label "교육용 PB980 방식 참고; 실제 제약·경고와 다름".
- Optionally retain original +10/+1/+0.1 rapid adjustment method behind "Quick Study" toggle **outside the OEM-look panel**. It remains separate and immediate, not manufacturer-equivalent.
- **Important data constraint**: Do not simply substitute published max/min ranges for current teaching bounds. True device has conditional settings limits and interactions; mechanical model `generateWaveform()` currently validates narrower physiological display inputs. Full range cannot safely be enabled without checking dependencies, valid inhalation/exhalation timing, computational cost and all tests.
- Modal must support Enter to Accept, Esc to Cancel, restored focus and screen-reader announcements; on mobile it should use a scrollable full-width sheet rather than obscuring tiny setting fields. Reduced-motion setting unaffected.
- UI cannot have both the current immediate small + buttons and new pending/Accept semantics simultaneously with indistinguishable labels; that creates false feedback and waveform mismatches.
- Test staged state isolation; Cancel rollback; clamping/resolution; accept immutability; keyboard focus; modal dismissal; fast study switch; pause/resume; reset while editing; help/circuit switching; 1440/360/320; no page overflow or critical clipping.

## Recommendation for approval
Select **C**. The choice between default device-inspired layout and default Quick Study mode is meaningful; **suggest default device-inspired** because fidelity is the stated priority, with Quick Study one click away. No implementation until user confirms.

## Source
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00), chapter 4. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf
