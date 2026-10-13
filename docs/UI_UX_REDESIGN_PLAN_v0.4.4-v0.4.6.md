# v0.4.4–v0.4.6 UI/UX redesign — implemented feature plan and release verification

Decision date: 2026-10-13 (KST)
Base: Private main at 56e120b6ad4c192cfde7064a4997e42fb582d6e0 (v0.4.3 FINAL)
Status: **Implemented on the v0.4.4–v0.4.6 feature branch; clinical educator review remains pending. Final integrated validation and merged-main CI are tracked separately in TEST_REPORT.md.**

## 1. Product objective and explicit user decisions

Student and faculty-friendly ventilator learning, preserving the PB980-inspired reference display while reducing interface load and providing goal-oriented guided learning.

Five approved user-visible choices:
1. Press-and-hold +/- controls plus direct numeric entry. Remove decorative TURN from the setting dialog.
2. In the setting dialog, replace "전체 초기화" with "이 항목 기본값" affecting **only** the selected parameter; keep separate global reset in page header.
3. Three screen-layout presets: **학습 집중 / 나란히 / 장비 집중**.
4. Two UI presentation modes: **기본 학습 UI / 장비 탐색 UI**.
5. **Goal-oriented guided CASE**, clearly signposted objectives and stages, and independent per-CASE progress/resume.

This approval is for the above UX choices, not unreviewed medical correctness or a change to physiology.

### Non-negotiable invariants
- Settings remain seven parameters; a confirmed setting state is the *sole* input to illustrative waveform calculations. Pending changes never affect waveforms or fixed monitor examples.
- Original 7 fixed monitor readouts are *static fictional examples*; no calculated SpO2/PaO2/VTE or genuine alarm detection.
- Pressure/flow/volume example waveforms, pause/resume, inspection seek, grid, reduced-motion behavior, settings modes, Help, CIRCUIT, ALARM, six CORE cards and their ten-question check, CASE 01/02 (three questions each) and debrief, keyboard navigation remain.
- PB980-inspired visual reference is not a clinically validated OEM emulator; existing study ranges and steps are not manufacturer limits. Do not silently replace educational limits with vendor values.
- Separate state domains: committed settings, pending edit draft, UI presentation mode, layout preset, control mode (staged/quick), waveform state, quiz, independent CASE sessions, debrief notes, alarms/circuit.
- The app stays client-only, static, private-repository; no patient data, login, API, storage or telemetry added.
- Educator approval remains pending and non-authenticated preview is not secure faculty access. No clinician signoff/student piloting is inferred from tests.

## 2. Actual v0.4.3 implementation inspected

- src/app.js: state committed through initialSettings; controlMode device/quick; editState original/pending; accept and cancel; reset currently in global toolbar AND setting dialog.
- src/setting-editor.js: beginSettingEdit, preferredEditStep, stepSettingEdit, acceptSettingEdit. The acceptance function checks only finite/range and stale original; **arbitrary in-range extra decimal places would be accepted without numeric-entry-specific validation**.
- src/sim-model.js: educational PARAMETERS values and precision; DEVICE_REFERENCE is distinct, with different manufacturer reference ranges/resolutions.
- index.html: disabled-looking rotary TURN is only an aria-hidden decorative element; physical key placeholders/inert access icons also exist.
- styles.css: multiple historical rules, desktop study sidebar around 315px; <=1100px stacks, while 320/360px requires separate geometry verification. Quiz currently has desktop-only sticky/scroll styling.
- src/case-engine.js: deterministic immutable start/choose/advance/score state, currently one active case in src/app.js.
- src/app.js CASE: clicking "← 사례 목록" sets caseState=null, hence the current progress is lost. Reflection notes are held in a separate in-memory Map keyed by case ID. CASE objectives and prebrief already exist but are inside a details area which closes after first step.

Do not restructure these domain models as part of a cosmetic patch.

## 3. UX interaction contract

### 3.1 Controls and state transaction (v0.4.5)

Pending editor actions:
- Open the selected setting and copy committed value to {original,pending}. Display setting name, unit, allowed **educational** bounds, and original/current pending values.
- Single +/- activation changes pending exactly one preferred study step, with clamp to educational min/max.
- Pointer hold: immediate first step, ~400ms delay then repeat around ~120ms. These are implementation starting parameters for browser testing, NOT PB980 motor behavior. Stop repeat on pointerup, pointercancel, lostpointercapture, pointer leaving target, window blur, dialog close, tab/window hidden, mode switch, and reaching a bound. Prevent pointer release's click from causing an unintended duplicate increment. Keyboard Enter/Space still produce a single accessible activation, unless separately and explicitly tested otherwise. Never leave a running timer.
- Direct text entry: hold raw editable string separately from accepted numeric pending; allow temporary intermediate editing without rewriting every keystroke. On deliberate apply within dialog, validate nonempty finite decimal, inclusive educational bound and supported parameter precision/increment grid. Invalid input has an inline descriptive error, does not alter pending committed numeric value, and disables/rejects Accept. No silent rounding: reject incompatible decimals (e.g., PEEP 5.06 while 0.1 display precision); avoid display/model mismatch.
- Existing numeric precision: FiO2, f integers; PEEP, Pi, Ti, PS, V-TRIG currently display 1 decimal, **but** rotary simulation increments are chosen by preferredEditStep (1 for Pi/PS, 0.1 for PEEP/Ti/V-TRIG). Technical design must reconcile validation with existing permissible study steps and starting values; do not silently reconfigure clinical ranges.
- Dialog +/- or select-default acts on Pending only. For "이 항목 기본값", use PARAMETERS[id].initial as the selected pending number. Accept commits only the chosen parameter; Cancel/Escape/discard leave all committed settings unchanged. Header "설정 초기화" retains existing 7-setting reset semantics.
- Preserve stale-edit protection (original committed value must match current committed setting on Accept). Keyboard arrows on a focused numeric input must not trigger the dialog-wide +/- shortcut; consider Enter versus submit and IME composition.
- Keep the previous quick-study control mode supported. If hold behavior is implemented there, its direct-commit loop must not create excessive waveform repaints; throttle and verify. Control mode and presentation/layout mode are independent.

Key regressions:
- Cancel and dialog dismissal must never commit either numeric draft or reset-to-default.
- Confirmed same-value edit causes no setting change.
- Repeated touch/mouse down/up must not accidentally double-count; no auto-repeat after hidden page, blur or close.
- Decimal boundary/min/max, paste, empty, invalid format/NaN/Infinity and mismatched precision must be rejected or clamped only as explicitly specified. No implicit clamping of an invalid typed entry.
- One-setting default must not reset other six parameters or CASE/quiz state.

### 3.2 Presentation vs layout vs control mode (v0.4.4)

There are **three separate UI concepts**, not one combined settings switch:

| State | Values | Default | Can it change learning/simulation state? |
|---|---|---|---|
| presentationMode | basic-learning / device-explore | basic-learning | NO |
| layoutPreset | learning-focus / balanced / device-focus | learning-focus | NO |
| controlMode (existing) | staged-confirm / quick-study | preserve existing device/staged default | ONLY through existing explicit user setting action |

Suggested toolbar:
- "보기": [기본 학습] [장비 탐색]
- "화면": [학습 집중] [나란히] [장비 집중]
- Existing staged/quick toggle stays within settings-related controls; do not present all switches as peers competing for attention.

Desktop: use CSS grid presets with sensible learning-pane widths (provisional ratios 45/55, 60/40, 75/25, not frozen pixel promises). Minimum readable study region ~360px where the viewport permits; the actual device tile and graph minimum widths are evaluated in Chromium. The browser may use a stacked layout when side by side is infeasible rather than clip.
Mobile 320/360: keep **DOM and keyboard focus order**, stack panels, and include direct "학습으로 이동"/"장비로 이동" anchors. In basic-learning mode a compact/expandable device summary can avoid a huge scroll before study content; all existing functional controls and three waveforms must remain reachable when expanded. Do not use CSS visual order in a way that disagrees with keyboard/screen-reader order. Do not simply transform:scale the whole PB980 display, as it shrinks touch targets and text. Layout/presentation transitions must not recreate waveform/setting/CASE DOM unnecessarily or reset focus without replacement.
Maintain existing quiz sticky/scroll logic only when it makes sense within desktop breakpoints; do not create nested scroll traps.

Device-explore presentation preserves visual reference geometry and access to the full simulator. Basic-learning de-emphasizes decorative inert hardware placeholders, harmonizes terminology and shows plain labels for functions. Keep visible distinction among educational setting, static example monitor and synthetic waveform, plus non-clinical warning.
Typography targets: functional controls >=44 CSS px where feasible, reading text >=14px where practical, small device labels can remain compact but supplementary. Test real text overflow rather than blanket font scaling. Labels should explain action instead of relying only on "?" icons.

### 3.3 Guided CASE with independent in-page session map (v0.4.6)

Current two CASEs and six questions/answer keys remain unchanged unless subsequently authorized after SME review. Existing prebrief, objectiveIds, evidence links and debrief prompts are reused.
- On CASE selection, show title, purpose, concise objectives, step roadmap **before** the first question.
- Case stages: prebrief/context -> question 1 -> question 2 -> question 3 -> debrief/result. The prebrief and debrief are explicit stages; question items retain existing ordered scoring.
- During every question, keep visible "현재 목표", progress ("2/3 questions" and semantic stage label), "가상 상황 자료 다시 보기" and link to associated core learning. Once-answered questions may be viewed for learning, but cannot be silently reanswered/regraded mid-attempt. A new attempt is a clearly labeled action.
- Use a Map keyed by caseId of separate immutable case-engine snapshots, plus activeCaseId nullable. Back to list must **not** delete session. List displays not-started/in-progress/completed and "이어 하기"/"다시 시작" appropriately. Reflective notes remain keyed by case ID; restarting only that CASE clears its notes after an explicit restart action.
- Switching tabs or changing presentation/layout preserves CASE progress, feedback and reflection. CASE progress remains RAM-only; full refresh intentionally clears it, as in v0.4.3. Any persistence across refresh needs separate user approval and privacy review.
- Progress/objective indicators must not imply objective mastery simply because a question was attempted or correctly answered. Use "진행/확인한 항목", not clinical competence/pass/fail.
- Keep faculty preview non-authenticated with clearly visible "정답 공개 / 전문가 미감수" and do not expose it unexpectedly inside the normal study sequence.
- The CASE fictional SpO2 values are **not** linked to the static LCD sample, committed device settings, or computed waveforms.

### 3.4 Risk register

| Risk | Cause | Severity | Mitigation/owner |
|---|---|---|---|
| numeric displayed and model value disagree | accept arbitrary precision despite formatSetting rounding | HIGH | pure input-validation helper and exhaustive param tests; v0.4.5 |
| long-press runaway/double step | pointer + click interplay; lifecycle events | HIGH | one gesture state, cleanup all paths, pointer/keyboard E2E; v0.4.5 |
| unexpected global reset | setting dialog default mislabeled/handled globally | HIGH | pending-only selected default; global reset separate; v0.4.5 |
| hidden/unreachable controls | compact learning layout hides controls but lacks reveal | HIGH | reachability matrix across modes/breakpoints; v0.4.4 |
| clipped graphs and UI | width-specific CSS assumes full viewport even in narrow grid child | HIGH | component/container responsive strategy, min widths and geometry E2E; v0.4.4 |
| loss of case attempts or reflection | single caseState reset on list navigation | HIGH | per-case immutable Map, explicit restart, session tests; v0.4.6 |
| mode transition resets quiz/waveform | re-render recreates handlers or mutates unrelated state | HIGH | separate presentation variables; no domain writes on view change; v0.4.4 |
| mistaken clinical interpretation | fictional case and static top banner adjacent | HIGH | visibly different source labels, no physiologic linkage; all versions |
| excessive options worsen complexity | 2 display modes x 3 layout presets x 2 control modes | MEDIUM | grouped controls, default optimized, test combination matrix; v0.4.4–45 |
| mobile keyboard/scroll/focus errors | layout changes, text input + key handlers | MEDIUM | focus and touch E2E, physical device user check pending; all versions |
| accumulated CSS override conflicts | ~600-line layered stylesheet with repeated breakpoint rules | MEDIUM | scoped additions; deduplicate only touched rules after screenshot regression; v0.4.4 |

## 4. Implementation milestones and release gates

### v0.4.4 — readable dual presentation and 3 layout presets
Incremental patches:
1. Add presentation and layout state only; keep existing UI visible; cross-mode nonmutation tests.
2. Implement desktop ratios and responsive component min-width/stack fallback; screenshot 1440, 1280, 1100, 960, 700, 360, 320.
3. Basic-learning simplified visual hierarchy/terminology/accessible real buttons; hide only inert decorative UI, retain exploration view.
4. Fix jump navigation, focus and scrolling; assess sticky study panel and reduced-motion interactions.
5. Document design decisions and manual screenshot observations.

Exit: no horizontal overflow or clipped controls, every original learning tab/setting/graph reachable, 3 presets × 2 presentation modes and existing control modes have stable settings, CASE, quiz and waveform behavior. Node syntax/unit/browser+package all green on exact release main.

### v0.4.5 — staged numeric editing and per-setting reset
Incremental patches:
1. Pure helper for exact decimal parsing, educational range and valid precision/grid; unit tests for all seven parameters.
2. Add a raw input draft in the current modal. Preserve original/pending/committed distinction; validate before Accept.
3. Replace decorative TURN with accessible numeric editor and +/- gesture; pointer hold lifecycle, click-suppression and keyboard verification.
4. "이 항목 기본값" changes only pending; header-only global reset remains.
5. Restore focus on close; test quick mode, stale guard, unchanged commit, and rendering without full waveform reinit.

Exit: no incorrect commit, hidden-repeat timer, keyboard collision, accidental double increment or out-of-range accepted value. Settings and waveform regression pass across both presentation modes and all layout presets. Keep all 7 educational ranges unchanged.

### v0.4.6 — guided CASE pathway and per-CASE resume
Incremental patches:
1. CASE plan/prebrief/context roadmap presentation using existing case metadata; no answer-key changes.
2. In-memory Map per CASE and active selection; revisit/resume/list/restart flows; focused navigation.
3. Context/goal accessible while answering, answer read-only review and semantic progress; protect exposure timing and reviewer-preview warnings.
4. Post-result debrief and links back to relevant core lessons; protect independent reflection notes.
5. Test switching between CASE 01/02, quiz, extra learning and view/layout modes, plus reset and reload.

Exit: CASE 01 and 02 can be separately paused/resumed, no cross-case data overwrite, restart affects one case only, refresh clears in-page data, 6 original questions/answers/evidence stay unchanged and no real patient or device simulation linkage introduced. Node syntax/unit/browser+package all green on merged SHA.

## 5. Test/acceptance matrix across releases

| Dimension | Examples of required verifications |
|---|---|
| Domain state | setting value invariant during layout/presentation change; pending never changes waveform; fixed readouts always fixed |
| Controls | modal Accept/Cancel/Escape; per-item vs global reset; long mouse/touch hold; keyboard arrows on input; upper/lower limits |
| Focus and navigation | dialog focus trap and return, tab navigation, jump anchors, panel hidden/display, browser back? no unsupported SPA history claim |
| Educational UX | six lessons, 10-item quiz and review, 2 cases × 3 questions, feedback timing, progress and debreif |
| Extra learning | Help, CIRCUIT parts/assembly/diagram, ALARM recognition, instructor public preview disclaimers |
| Waveform | pressure/flow/volume, pause/reduced motion, cursor/seek/grid, quick setting changes, performance during hold |
| Accessibility/responsive | desktop 1440/1280/1100/960/700 and narrow 360/320, horizontal overflow 0, no invisible controls, focus order |
| Privacy/safety | no storage/telemetry, no PHI, no live clinical model, private repo unchanged |
| Build/release | syntax + existing and new unit + Chromium actual browser + screenshots + static package; PR review, merge, exact main SHA re-run |

Verification statuses must distinguish: planned/not run, automated-pass, visual inspected, physical-device checked, expert clinical reviewed. NEVER substitute CI for clinical educator approval or an in-person usability pilot.

## 6. Out of scope and future choices

- Direct operational fidelity to a specific hospital PB980 firmware, real alarm generation, gas-exchange/oxygenation calculation, clinical intervention, medically validated VTE/SpO2 response: OUT OF SCOPE.
- User analytics, account system, remote saves, localStorage/sessionStorage, local or hospital patient records: OUT OF SCOPE.
- Draggable splitter is NOT planned; user selected three named presets.
- Functional rotary knob is NOT planned; user selected long-press +/- and direct numeric input.
- Dynamic branching clinical CASE or changing question answers is NOT planned; current goal is guiding existing content.
- In-page CASE resume across navigation is approved; **reload persistence is not approved** and is explicitly deferred.

## 7. Decision trace

2026-10-13 — User explicitly selected all five UX directions above and requested final design/risk analysis before implementation. This document records them as the future roadmap and test gate. The v0.4.3 main baseline was kept unchanged until the user explicitly requested implementation. v0.4.4–v0.4.6 code was then developed on a separate feature branch.
