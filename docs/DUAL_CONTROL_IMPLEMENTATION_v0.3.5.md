# Dual Control Architecture & Validation — v0.3.5 (2026-10-10)

## Intent and normative reference
The PB980 Operator's Manual (chapter 4.5.5) documents touch/selecting a setting, turning the adjustment knob, and Accept/Accept ALL; pending values may appear yellow italic rather than the white committed display. The simulator reconstructs the **learning concept**, not the actual OEM interaction, controller requirements, soft/hard constraints or clinical safety logic. Per-parameter +/− buttons are non-OEM study extensions.

## State model
| State | Owner | Writes | Drives waveforms |
|---|---|---|---|
| `state` (committed settings) | `src/app.js` and `src/sim-model.js` | Quick Step; Accept; full Reset | **Yes** |
| `editState` `{id,original,pending}` | `src/app.js` via pure `src/setting-editor.js` | Open, Arrow/step, Cancel/Esc, Accept | **No** |
| `controlMode` `device / quick` | `src/app.js` | Explicit mode toggle only | **No** |
| `waveformTime`, `waveformPaused` | `src/app.js` | Animation/Play/Pause | Illustrative view only |
| `MONITOR_REFERENCE` | `src/sim-model.js` | Never at runtime | **No** |

## Behavior contract
1. Default = device. Each setting tile becomes a keyboard-focusable button, and clicking it opens native modal.
2. Original and Pending are visible separately; simulated dial +/- and four arrow keys adjust only pending, based on existing **educational** metadata and hard clamps.
3. Accept commits a single field with a stale-original guard; if value changed, redraws waveform, updates tile and restores focus. Enter submits while Accept focused.
4. Cancel, native dialog Escape, or mode-switch close discard pending and restore focus.
5. Dialog's Entire Reset discards pending, resets all confirmed teaching values and redraws, without touching mode or replay state.
6. Quick Study uses the original per-setting +/- buttons and exactly the original immediate `adjustSetting` path. Mode switches preserve values, focus behavior is preserved through in-place updates.
7. Modal on 320/360 mobile is full-width scrollable bottom sheet; keyboard/screen reader label and browser-native dialog focus trap apply.
8. Help panel, Circuit, device look, pause/play, reduced motion, three educational waveforms, fixed sample monitor and Private status remain unchanged.

## Risk and validation ledger
| Risk | Mitigation | Evidence |
|---|---|---|
| Unaccepted values change waveform | Pure staged state; generator only accepts committed state | Editor tests + paused SVG path browser check |
| Cancel/Esc leaves unintended state | Drop pending edit, no repaint | Browser Escape/Cancel |
| Quick Study gets reimplemented incorrectly | Old button listeners and metadata preserved, shown only in quick mode | Legacy browser tests run after toggle |
| Stale pending state overwrites reset | Guard on original value + modal Reset closes edit | Stale unit test, modal reset browser test |
| Keyboard focus lost | Reuse DOM tiles, native dialog, explicit focus restoration | Chromium browser |
| Mobile overlay overflows/clips | Native dialog with narrow full-width bottom sheet | 360/320 geometry checks and screenshots |
| Manufacturer limit confusion | Educational range display + independent official reference facts in ? help | UI labels and documentation |
| Static web package missing new module | Include `src/setting-editor.js` in syntax check and distribution | Actions package job |

## Explicitly out of scope
PB980 conditional constraints, patient physiology/ABGA/alarm logic, firmware pixel calibration, actual functional physical knob and batch Accept ALL. The simulator is not clinical decision support and not an approved training-device emulator.

## References (APA 7th)
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator: Operator's manual* (PT00101843A00), section 4.5.5. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

## Actual CI and screenshot results
- GitHub Actions branch run [38054960790](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054960790): **PASS**, 24/24 Node tests, Chromium 1440/360/320, interactive dialog behavior and static package.
- Nine images include each device-inspired/quick view plus native edit dialog at each viewport. Desktop + 320px sheets and narrow Quick were directly reviewed. Buttons remained visible, and the former two-column mobile regression did not recur.
- Deployment or clinical-equivalence testing was not performed. A separate main-branch push workflow must succeed after merge.
