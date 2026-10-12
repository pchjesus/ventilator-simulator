# Preclinical Nursing Ventilator Education — Development Roadmap
> v0.3.8 · 2026-10-12 · living implementation/validation plan · educational simulation only

## 0. Final product scope and release terminology
**Audience:** Korean undergraduate nursing students, before observing patients in an ICU/medical-surgical clinical placement. The app teaches *recognition, terminology, structured observation and communication*, not independent ventilator operation or autonomous treatment.

**Target:** a curriculum-aligned **preclinical education support tool**. This is NOT (and should never claim to be) a PB980 manufacturer-certified trainer, licensed patient simulator, certified competence test or bedside decision aid.

**Three distinct states**
1. **Instrument visual demonstration (current):** simulated waveform and educational settings, 7 fixed readout examples. No patient physiology, no oxygenation model.
2. **Scenario vignette (v0.3.8):** independently authored fictional patient signs with discrete question choices, formative feedback and source links. **It must not silently alter the instrument.**
3. **Validated, scenario-coupled physiological patient model (future, optional):** requires explicit, measured, clinically reviewed relationships and provenance before scenario and monitor may be linked.

**Do not merge these states visually or in data models** until domain expert review establishes precisely what is calculated, which monitor values are validated, and which artifacts are fictional.

## 1. Standards/evidence hierarchy
| Source | Allowed use | Not automatically established |
|---|---|---|
| Medtronic Puritan Bennett 980 Operator's Manual | Device-specific GUI semantics, available controls/modes, alarm naming, physical keys | Safe clinical settings for an individual patient; an exact software emulator |
| AARC Clinical Practice Guideline: Patient-Ventilator Assessment (2024) | General assessment priorities: PBW-based Vt, plateau pressure, PEEP/auto-PEEP, oxygenation, airway securement, cuff and humidification | Nursing student scope-of-practice or a detailed emergency procedure |
| INACSL Healthcare Simulation Standards of Best Practice, Simulation Design/Outcomes/Prebriefing/Debriefing (2021; check current revisions before rollout) | Objectives, prebriefing, clinical case design, guided reflection, assessment, piloting and improvement | Endorsement or accreditation from INACSL; validation of this simulator |
| Local hospital policy, nursing faculty, ICU educator/clinician | Scope-of-practice boundaries, emergency response, local device/circuit profile and actual simulation teaching design | Access assumed from current project's generic descriptions |

References:
- PB980 manual: https://asiapac.medtronic.com/content/dam/covidien/library/us/en/product/acute-care-ventilation/PuritanBennett980Ventilator_OperatorsManual_en_US_PT00101843A00.pdf
- AARC 2024: https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/
- INACSL Simulation Design (2021): https://doi.org/10.1016/j.ecns.2021.08.009
- INACSL Outcomes & Objectives (2021): https://doi.org/10.1016/j.ecns.2021.08.013
- INACSL Prebriefing (2021): https://doi.org/10.1016/j.ecns.2021.08.008
- INACSL current official standards (includes 2025 revisions to Prebriefing, Debriefing Process, Facilitation and other standards): https://www.inacsl.org/healthcare-simulation-standards
- INACSL archived/educational simfographics: https://www.inacsl.org/simfographics

## 2. Competency matrix (knowledge ≠ bedside skills)
| Domain | Preclinical measurable learning objective | Learning method | Evidence of learning | Requires instructor validation? |
|---|---|---|---|---|
| Display literacy | Distinguish ventilator **settings**, actual **measured data**, and fictional case values in 3/3 checkpoints | Labeling task and scenario A | Formative feedback + post-test | Yes |
| Respiratory basics | Explain FiO₂, PEEP, SIMV(PC)+PS, fTOT, VTE and three waveform axes accurately | Help topics / plots / glossary | Item bank and instructor crosswalk | Yes |
| Patient safety | Select immediate patient reassessment and escalation over unsupervised setting changes in abnormal findings | Scenario B and future alarm cases | Observation-first branching rubric | Yes, ICU clinician |
| Respiratory monitoring | Identify which trends require review of SpO₂, ABGA and observed work of breathing instead of using static simulator numbers | Case vignettes | Knowledge checklist | Yes |
| Airway/circuit overview | Describe inspiratory/expiratory limbs, Y-piece, artificial airway, securement and humidification assessment | CIRCUIT and case | Label matching and teach-back | Yes, local hospital profile |
| Communication | Deliver concise change-focused clinical escalation (situation, observations, urgency, request) | Formative multiple choice, later SBAR free text | Educator-reviewed structured rubric | Yes |
| Mechanical ventilation assessment | Interpret respiratory mechanics, time and flow limitations only after reviewed physiology models | Future validated model | Case-based comparison | Yes, expert panel |
| Documentation/debrief | Record observations separately from interpretations and articulate uncertainties | Future reflection exercise | Instructor checklist | Yes |

## 3. Milestone plan and explicit release gates
| Target | Ship scope | Exit criteria |
|---|---|---|
| **v0.3.8 — case pilot [NOW]** | CASE panel, 2 original introductory vignettes (handover, desaturation), objectives/prebrief, 3 steps each, immediate explanatory feedback, summary/restart, pure case state, sources, tests | 2 cases display on 1440/360/320; 6/6 correct answers properly graded; no case writes to setting/monitor/waveform; labels clearly fictional/unguided draft; old 34+ tests green |
| **v0.3.9 — content QA + instructor workflow** | Case schema validator, accessible glossary/debrief, evidence reference mapping, instructor preview screen; fix confusing UI | Each case has source, audience, objectives, scenario facts, all option rationales and clinical scope flags; zero unlabeled invented clinical facts |
| **v0.4.x — clinical reference review** | Verified PB980 screen terminology; controls/modes, actual alarm naming and circuit component profiles annotated with manual page/section | Device-specific facts cross-checked to source, firmware/config differences indicated, conceptual diagram explicitly distinct from real assembly |
| **v0.5.x — scenario authoring & assessment** | 6–8 scenario bank, levels, guided prebrief, structured observation and SBAR, case-specific debrief and optional anonymized LOCAL result export | Each scenario maps to measurable objectives; option rationales cite references; formative scores not used as competence certification; no patient-identifying input collected |
| **v0.6.x — validated clinical content pack** | Conditions: stable baseline, desaturation recognition, high-pressure alarm *recognition only*, circuit disconnection recognition, secretion/airway assessment, basic ABGA reading, patient–ventilator asynchrony recognition, handover | At least 2 clinical subject-matter reviewers (e.g., experienced ICU nurse + ventilator specialist/physician) sign off medical facts and expected actions; local policy variations documented |
| **v0.7.x — physiological model (SEPARATE track)** | Explicit parameter→mechanics→tidal volume/flow/ABGA approximations with domain tests; optional patient-response demo | Equations, constants, ranges, errors and limitations documented; no patient monitor coupling until expert-checked benchmarks and controlled synthetic datasets pass; when unvalidated continue to label as teaching estimate |
| **v0.8.x — integrated teaching & usability pilot** | Teacher-mediated 15–30 min session with prebrief, 2–4 cases, debrief, question bank and educator observation checklist | Pilot with consenting students and instructors; task completion, ambiguity/error log, accessibility, mobile/desktop tested; clinical content independently reviewed and critical misunderstandings corrected |
| **v0.9.x — pre-release** | Localization/protocol variants, content versioning/QA, instructor materials, error and privacy/security review | All cases checked against approved references; no high-consequence false advice; zero release-blocking browser regression; observation/checklists ready |
| **v1.0 — preclinical education release (GATED)** | Instructor-ready curated modules, approved cases, traceable citations, structured debrief, evaluated learning objectives | Written education-lead approval, versioned clinical sign-off + review dates, pilot evidence, documented learner/instructor limitations, target school/hospital policy fit, software/mobile regression gate all satisfied. Without these the app stays an educational prototype. |

**Version targets express dependency order, not a guaranteed calendar**. Safety review can pause or reorganize releases.

## 4. Case authoring contract — mandatory for future cases
Each case must carry:
- Immutable case ID, title, level, estimated duration, target audience, medical content review status, case version and review date.
- 2–4 measurable objectives and prerequisites; prebrief about simulation limitations and learner/student role.
- Fictional patient narrative with timeline, case-data provenance, monitoring display labels and exact distinction from current device LCD values.
- Student observable questions (what is seen?) before judgments (what may be going on?) before scope-safe actions (who to contact and what to report?).
- Distractors that reflect plausible student errors without suggesting unsupervised risky interventions as a valid routine.
- Correct/incorrect individualized feedback, uncertainty statements and linked primary/consensus references.
- Debrief prompts, review rubric, instructor note, review log, last validated guideline version and an evidence gap list.
- Instructor-only review approval flag for release promotion. Draft case must show a banner until signed off.

**Do not:** create an emergency algorithm solely from these choices, replace a supervising clinician, infer SpO₂ or PaO₂ from FiO₂ in this simulator, or claim scoring is clinical competency validation.

## 5. Assessment and validation plans
**Unit tests:** case IDs, 100% step IDs unique, exactly one keyed correct option, valid citations, prebrief/scope banner, pure state transitions, invalid-choice guard, feedback presence and immutability.

**Browser regression:** every case selectable and answerable with mouse/keyboard/touch at 1440, 360 and 320px; switching tabs preserves case; simulator reset leaves cases unchanged; updating a scenario cannot mutate committed settings, pending edits, monitoring values, generated waveforms or pause state; focus and source links accessible.

**Clinical review (separate from code CI):** independently judge factual accuracy, patient-safety advice, whether a distractor is genuinely wrong, hospital protocol dependencies, false certainty and student scope. Keep signed reviewer checklist and item-level corrections. Code passing does not imply reviewed/approved content.

**Education pilot:** faculty-facilitated voluntary 15–30 minute introductory session (prebrief→case→debrief), 5–10 learner usability dry-run then controlled broader pilot, pre/post knowledge checks matched to objectives, user-perceived clarity and critical misunderstanding tracking; no real patient data.

**Privacy:** work offline/static; do not collect patient information, student identity or clinical records. Any future persistent export must be optional, anonymized and reviewed before addition.

## 6. Architectural partition and suggested files
```
src/sim-model.js + src/waveform-model.js      fixed educational device simulation
src/app.js                                     presentation and existing machine interactions
src/preclinical-cases.js                      authored FICTIONAL vignette data + sources
src/case-engine.js                            pure, deterministic formative assessment state
docs/CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md  requirements/gates (this document)
future: docs/CLINICAL_CONTENT_REVIEW_LOG.md   reviewer sign-off log
future: src/validated-lung-model.js           physiological modeling (only after separate tests)
```
All case content is independent of the PB980 configuration and top fixed readout examples. Optional genuine coupling becomes a **major-version clinical/UX choice** requiring explicit user approval and expert safety review.

## 7. Key risk decisions
1. **Case display versus live patient model:** Current decision is self-contained fictional case cards; safe because clinical vignettes cannot be interpreted as authentic device readings. Advantage: rapid educational pilot. Disadvantage: less realistic interaction. Do not auto-link without explicit review.
2. **Score handling:** 3-option formative quizzes + debrief only. Avoid pass/fail badges, diagnosis labels and competency certificates until validated rubric and faculty agreement.
3. **Local bedside rules:** general recognition and report priorities may be taught, but final operational checklists and alarm responses require local instructor/policy approval.
4. **Medication/airway interventions:** observe/escalate rather than prescribing ventilation/medication/airway manipulation. Scope changes need evidence and clinician review.
5. **Visual fidelity:** maintain PB980-inspired internal information hierarchy, not decorative exterior imitation. All fictional case data use distinct visual containers.

## 8. Next sprint recommendation
Implement **v0.3.9 content QA and evidence traceability** before more simulated physiology. Highest leverage: validators against missing citations and ambiguous explanations, instructor comment/review checklist, and a small prebrief/reflective-question view. Only once clinical educators review the first two scenarios should more complex desaturation/alarm branches be drafted.

## v0.3.9 implementation & currency note (2026-10-12)
- [x] Added a **structure-only** content integrity gate and question-by-question source/objective traceability for the first two fictional pilot cases.
- [x] Added a clearly disclosed open instructor-preview (shows correct answers; no login), optional learner evidence accordions and 3 RAM-only debrief text prompts per case.
- [x] New [clinical content QA protocol](CLINICAL_CONTENT_QA_v0.3.9.md) lists six item mappings, review blockers, and a blank SME signoff record.
- The existing 2021 INACSL articles above are historical references; check the **2025-revised** official standards, especially prebriefing/debriefing, before a faculty-led teaching pilot.
- [ ] Do not promote content review status beyond `pending/approved=false` until independent clinical review and formal instructor signoff, which are not provided by this repository's code tests.
