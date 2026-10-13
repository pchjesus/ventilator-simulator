# Project Specification

## v0.5.0 FINAL — 승인된 현재 교육용 제품 범위

- 초급 간호학생의 화면 이해 → 6개 개념 → 10문항 형성평가 → CASE 01/02 각 3문항 → 읽기 전용 이전 응답·목표별 복습의 통합 경로.
- 모바일에서는 학습 우선으로 패널 순서가 바뀌며 장비를 펼쳐 접근한다. 기존 3개 화면 배치 프리셋과 2개 프레젠테이션 방식은 복제 없이 동일 DOM에 적용하며 메모리 학습 상태를 보존한다.
- 7개 설정/조작/Pending/Accept/Cancel/퀵스터디/3개 파형/고정 모니터 7개/Help/ALARM/CIRCUIT 및 기존 사례·정답 유지.
- 설명은 쉬운 정의, 원리/의미, 실제 간호 관찰, 오개념, 예시, 앱 자료 성격, 선택적 심화/참고문헌 순서.
- 4개 정보 범주(설정·독립 고정 모니터·모의 파형·별도 가상 CASE)를 명시. 환자 생리 모델/SpO₂·PaO₂·VTE 자동 계산/실제 임상 알람/무감독 실습학생 조작 기능은 금지.
- 교수자 수업 자료는 배포용 별도 MD 초안(정답 포함). 접근 인증/보안 기능 아님. 미실시 사용자 연구, 전문가 감수를 완료라고 표시하지 않는다.
- 완료 내용과 검증 계약은 `docs/V0.5.0_APPROVED_STUDENT_UX_IMPLEMENTATION.md`, 향후 파일럿은 `docs/V0.5.0_USABILITY_PILOT_PROTOCOL.md` 참조. 하단 구버전의 “future” 항목은 해당 당시 이력을 뜻하며 v0.5.0 현재의 구현 여부는 이 항목을 우선한다.

---

## 1. Product concept
학생이 실제 ventilator를 보고 조작하는 것처럼 학습할 수 있는 인터랙티브 교육용 simulator.

## 2. Main screen
실제 ventilator의 화면을 기준으로 한 single-screen 중심 구조.

### Monitoring
- Ppeak
- Pmean
- PEEP
- I:E
- fTOT
- VTE
- VE

### Waveforms
- Pressure-Time
- Flow-Time
- 향후 Volume-Time

### Settings
- Mode
- Pi
- PS
- Frequency
- FiO2
- PEEP
- V-TRIG
- Ti
- 향후 E-sens, rise time 등

각 parameter는 장비 화면과 어울리는 작은 +/- controls와 `?` help를 갖는다.

## 3. Right-side tabs
### CIRCUIT
- Components
- Assembly
- Completed circuit
- Gas-flow animation

### PATIENT (future)
- Respiratory effort
- SpO2
- HR/BP
- Lung mechanics

### ABGA (future)
- pH
- PaCO2
- PaO2
- HCO3-
- SaO2

### ALARM (future)
- High airway pressure
- Low minute ventilation
- Apnea
- 기타 장비별 alarm

### CASE (future)
- COPD
- ARDS
- Pneumonia
- Weaning
- 기타 교육용 case

## 4. Simulation chain
Vent settings
→ lung/respiratory model
→ patient response
→ waveforms
→ monitoring values
→ ABGA / SpO2
→ alarm
→ learner intervention
→ outcome

## 5. First milestone
사진의 SIMV(PC)+PS 화면을 최대한 정확하게 재현하고, parameter controls와 help popup을 동작시키는 것.

## v0.3.5 study-control UX
- Default PB980-inspired one-parameter adjustment: user selects tile, edits pending study value, commits with Accept or discards with Cancel/Escape. The modal shows original/modified values separately.
- Optional Quick Study mode restores immediate plus/minus controls and original study increments exactly.
- Switching modes does not change values. The only waveform input is the confirmed setting state; Help, CIRCUIT, reset and keyboard access remain.
- No assertion of manufacturer-certified dial resolution, interlocking limits or real ventilation changes. The top monitored data are still fixed instructional references.

## v0.3.6 help, manual and categorized release history
- Single-screen layout adds **top explanatory manual icon** and **patch history icon**; both launch native modal overlays dismissible using X, outside click/touch, or Esc. Screen-reader dialog title and keyboard focus return required.
- Parameter ? remains the entry point to per-setting reference and expanded clinical/nursing interpretation. The right panel additionally offers 13 topical study selectors.
- Clinical text must separate established general principles from specific PB980 manual facts and from the unmodeled simulator behavior. Every topic has explicit sources.
- Release notes are grouped by version, with five category filters. The categories refer to changes actually shipped.
- None of the popups may change committed settings, pending edits, control-mode switching, waveform state, reset or CIRCUIT navigation.

## v0.3.7 internal-GUI readability and interactive waveform analysis
- Retain PB980 reference **information hierarchy**, not exterior-brand color fidelity. Use high contrast, larger readouts, readable parameter controls and narrow viewport balance.
- Waveform toolbar adds grid toggle and Analysis toggle. Both affect visualization only, not ventilator settings, monitoring banner or CIRCUIT.
- Analysis pauses the **illustrative** waveform, adds synchronized cursors for Pressure/Flow/Volume and offers keyboard-accessible time slider plus direct pointer/touch seeking. The values shown must be sourced from the exact curve samples, not independently synthesized as patient measurements.
- Leaving analysis restores prior pause; dedicated Resume leaves analysis and starts playback. Pending Accept state remains unaffected.
- Scope excludes patient prediction, alarm simulation, OEM fidelity, loop modes and real captured breath data.

## v0.3.8 preclinical student case pilot
- Add a CASE tab to the separate study panel. Show fictional case data with a prominent expert-not-reviewed label and a warning that case values are not reflected in the PB980-inspired monitor/graphics.
- Each case needs a measurable learning objective list, prebrief, context, 3 student choice stages, individual answer feedback, rationale, score/debrief and restart.
- Persistent navigation within the *current page session only*: switching CIRCUIT/Help/CASE does not discard case progress; case reset is independent of simulator reset. No student identity or scores stored or transmitted.
- Source-linked educational recognition and escalation only; no dynamic SpO₂, actual alarm, independently prescribed ventilator settings or certification.
- Future expansions and validation exit criteria in `docs/CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md`.

## v0.3.9 content schema / instructor review
- Case data must have `contentVersion`, `review.status=pending`, `approved=false`, and at least 3 structured debrief prompts, plus ID-tagged objectives.
- Each question must link to objective IDs and source IDs and carry an explicit `evidenceKind` / `evidenceNote` distinguishing simulator implementation from clinical guidelines and inference. A pure audit blocks CASE lessons with broken fields or reference URLs; this does **not** make content clinically approved.
- Student UI retains in-page progress across tabs and simulator reset. After each question, optionally show its evidence; after completion offer answer-by-answer comparison and RAM-only reflection text fields that survive tab switches but not browser reloads or case replay.
- Instructor preview is openly accessible (not authenticated); the button prominently warns that answers are revealed. It contains no approval controls or clinical signoff.
- Reference the INACSL official standards page updated in 2025, not solely 2021 articles.

## v0.4.0 PB980 ALARM teaching contract
- Add fourth right-side `ALARM 학습` tab, independent from Help/CIRCUIT/CASE and from any virtual ventilator physiological or measurement state.
- Provide exactly 4 manufacturer-grounded **non-live, educational** alarm cards (disconnect, high pressure, low minute ventilation, apnea), each with source context, student role-safe observation/report, one formative 3-option question and replay.
- Provide an independent glossary filter for 7 educational configurable settings, 7 fixed sample monitor values, and example SIMV(PC)+PS mode with conspicuous value-source distinction.
- Never generate alarm colors, priority countdowns, beeps, fake measurements, circuit effects, diagnosis or treatment instructions via learner cards.
- Remain visible and usable at 1440/360/320. Keep original device editor, quick settings, waveform, manual, CASE, CIRCUIT and reset behavior intact.

## v0.4.1 student-priority UI
- Default tab CORE with 6 explanatory concepts and sources. Keep old CASE and Help primary.
- Circuit/ALARM retained under '추가 학습' disclosure, deep Help parameters and alarm technical details optionally expanded. Collapse while advanced is active returns CORE.
- Highlight FiO₂/PEEP/f as primary controls. Pi/Ti/PS/V-TRIG remain fully operable with unchanged numeric semantics.
- Explicit that sample VTE/Ppeak/fTOT are fixed, not dynamically measured. Keep no patient/alarm engineering and no patient data.
- Reference software variant facts only as references; hospital firmware/option values must remain unconfirmed.


## v0.4.2 core learning contract
- Reuse existing core panel; 10 three-choice questions across six lesson cards, not a new tab.
- Per question: objective, exact one answer, all-choice feedback, misconceptions on distractors, source and evidence category.
- No correct-answer UI exposure until selection; instructor/developer preview shown only after completion. Preview is open, not a secure faculty area.
- Flow: core concepts → formative check → misconception/card revisit → unchanged CASE 01/02 → existing debrief.
- Quiz state in page RAM; tabs and device reset preserve answers; refresh/retry clears as intended. No PHI, tracking, persistence, sensor data, live clinical simulation or competency certification.
- Data/QA: [docs/CORE_LEARNING_CHECK_v0.4.2.md](docs/CORE_LEARNING_CHECK_v0.4.2.md). Clinical expert review pending.


## v0.4.3 clinical review handoff / usability
- Keep 10 formative quiz items, original answer IDs, existing six core cards, two CASE scenarios and device simulation untouched.
- Each quiz item has an auditable separate source-interpretation note and pending faculty review question. App-specific claims are internal implementation evidence and have no invented public source link.
- Existing response gate and post-completion open instructor preview retained; the preview adds review prompt and evidence limits. No instructor role, signoff feature, credential or assessment validity claim.
- Learners revisiting a concept during an active quiz can return to the current quiz step; no quiz reset, no server/database, no changes to device or CASE state.
- Document real SME-review and anonymized usability pilot as **unperformed future work**. See docs/CLINICAL_REVIEW_HANDOFF_v0.4.3.md.


## UX implemented v0.4.4–v0.4.6 (user-approved; v0.4.3 remained baseline)
2026-10-13 design signoff: (+/− press and hold + direct numeric entry; remove decorative modal TURN); reset only current parameter from its dialog, global reset remains separate; three layout presets; basic learning vs device exploration presentations; guided goal-based CASE with independent in-page progress.
All presentation/layout states must be orthogonal to the existing staged/quick controlMode and to device committed/pending settings, waveform, fixed monitor, CORE quiz, alarm, circuit and CASE state. Pending edits must not mutate waveforms until Accept; typed input requires precise validation before committing.
CASE objectives/prebrief/question sequence/debrief are reused from the existing v0.3.9 two-case/six-question material. A per-case memory map permits resume after returning to list and switching tabs, but never claims persistence across refresh. Clinical signoff and real PB980 fidelity remain explicitly pending.
Full acceptance and risk plan: [docs/UI_UX_REDESIGN_PLAN_v0.4.4-v0.4.6.md](docs/UI_UX_REDESIGN_PLAN_v0.4.4-v0.4.6.md). The v0.4.4–v0.4.6 implementation is tracked in DEVLOG and TEST_REPORT. Clinical signoff remains separately incomplete.
