# PB980 UI reference comparison — v0.3.2 (2026-10-09)

## Scope
This patch improves **visual resemblance** to the Puritan Bennett 980, rather than claiming a pixel-identical or functionally interchangeable device emulator.

## Sources used
1. Medtronic official *Puritan Bennett 980 ventilator operator's manual*, section 4.4.1 / Figure 4-1 (Areas of the GUI) and surrounding GUI controls descriptions.
2. Medtronic *Puritan Bennett 980 in-service videos* (screen geography, large font display, waveform/graphics and bezel keys).
3. Publicly available photographs of the PB980 monitoring screen, particularly Taipei Veterans General Hospital nursing education material (external visual reference; software profile not independently verified).
4. Current project's v0.3.1 desktop screenshot (GitHub Actions, run 37942595386).

## Grounded design decisions

| UI region | PB980 documented/visually observed | v0.3.1 before | v0.3.2 after | Fidelity status |
| --- | --- | --- | --- | --- |
| Device bezel | Deep blue display housing and physical buttons/central encoder | Simple rectangular panel | Blue curved bezel, static rotary and soft-key representation | Visual approximation |
| Vital Patient Data | Blue banner at top, up to eight visible monitored data values, configurable per patient | Seven values on dark cards | Seven sample values on continuous saturated blue band | Partial; still fixed demonstration values |
| Breath phase indicator | Upper-left indicator with A/C/S phase representation | Absent | Green 'C' visual sample | Static display only, not synchronized |
| Menu tab | Vertical left tab | Top 'MENU' text | Narrow vertical left MENU strip | Approximation |
| Waveform area | Central black waveform workspace, selectable time-series/loops | Three dashboard-style graphs | Black PB980-style continuous plots with subtler axes | Inspired by real UI; physics remain illustrative |
| Current settings | Lower-center blue region with compact controls | Large dark card grid | Compact blue bottom strips/tiles | Approximation; increments are teaching additions |
| Constant-access icons | Lower-right Home/Configure/Logs/Elevate O2/Help | Separate education side panel | PB980-inspired visual strip; only Home/Circuit and Help are functional in our app | Explicitly limited |
| Circuit learning | Not part of the referenced default PB980 UI | Separate side panel | Preserved separate side panel | Educational addition, not manufacturer UI |

## Functional behavior retained
- All seven adjustable study parameters and prior rounding/bounds behavior.
- Three generated teaching waveforms, pause and resume, reduced-motion preference.
- Fixed example data banner remains **explicitly disconnected** from the teaching waveform engine.
- Help and Circuit tabs, step-by-step concept view, reset and keyboard focus stability.
- Existing desktop/360px/320px responsive breakpoint strategy.

## Remaining gaps against actual PB980
- Screen dimensions, exact fonts/icons, colors and pixel placement are approximations, not a measured screenshot overlay.
- Interactive control pathways differ: actual PB980 settings dialogs and physical rotary encoder are not simulated.
- Manufacturer-compatible settings ranges, soft/hard bounds and alarms are not verified.
- Real waveform display modes, synchronized breath phase indicators, customizable patient data layouts and firmware-specific menus are not reproduced.
- Hardware bezel keys are **visual only**. The two study shortcut buttons (Home/Help) navigate educational panels.
- Screen width is adapted responsively for phones (a deliberate deviation from physical hardware).
- No actual patient/ventilator clinical response, oxygenation or alarm detection.

## Future quality gate (recommended)
Choose one PB980 software version, ventilation mode (e.g. SIMV PC + PS) and actual reference screen. Then compare screenshot regions by pixel dimensions, use a visual regression baseline for desktop, and require named educational task completion tests. Maintain clear non-clinical labeling. Do **not** imply equipment operation equivalence.

## Design goal recommendation
A near-reference learning UI for **recognition, parameter literacy, waveform interpretation and guided safe practice** is appropriate. Making every manufacturer action and failure mode **fully identical** is not a sensible default requirement for a small undergraduate nursing teaching simulator: exact software/hardware variation, high verification burden, possible licensing and manufacturer branding considerations, and risk of mistaking the app for an approved training emulator outweigh benefits. Seek permission for copyrighted original interface assets or trademarks if publication requires their reproduction.

## References (APA 7)
Medtronic. (n.d.). *Puritan Bennett™ 980 ventilator operator's manual*. https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf

Medtronic. (n.d.). *Puritan Bennett™ 980 series ventilator: In-service videos*. https://www.medtronic.com/en-us/healthcare-professionals/products/respiratory/mechanical-ventilation/ventilators/puritan-bennett-980-series-ventilator/in-service-videos.html

Taipei Veterans General Hospital. (n.d.). *Introduction to intensive care unit equipment* [Nursing education webpage]. https://ihealth.vghtpe.gov.tw/media/1162
