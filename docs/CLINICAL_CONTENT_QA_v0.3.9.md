# Clinical content traceability & instructor-review protocol — v0.3.9
> 2026-10-12 · content quality baseline, **NOT** a signed clinical safety review or valid course certification.

## 1. Scope and release identity
- Audience: nursing students before bedside clinical placements.
- Content version for both pilot cases: `0.3.9`; independent of simulator widget implementation version.
- Current state: `review.status = "pending"`, `approved = false`; all answer explanations remain **expert-unreviewed educational drafts**.
- INACSL [current official Healthcare Simulation Standards](https://www.inacsl.org/healthcare-simulation-standards) report that some standards, notably Prebriefing, Debriefing Process and Facilitation, were revised in **2025**. Historical 2021 papers may be cited as development background but should not supersede current standards when adapting a curriculum.
- [AARC Clinical Practice Guideline: Patient-Ventilator Assessment (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11298231/) supports patient-centered assessment categories; it does not certify nursing student scope-of-practice or precise answers to this app's fictional case questions.

## 2. What v0.3.9 automated checks establish
`src/case-quality.js` checks structure at application runtime and through Node tests:
- Unique case, learning objective and question IDs.
- Required case version, explicit `review: {status:"pending", approved:false}`, objectives, fictional context, prebrief and >=3 reflection questions.
- Exactly one matching answer per question; at least three readable answer options with tailored feedback.
- Every question has linked valid objective IDs, referenced `https:` primary/consensus source IDs, a labeled evidence **kind** and substantive rationale note.
- Case sources have nonempty descriptions and HTTPS URLs; broken citations and invalid objective mappings cause CASE lesson to **fail closed** with error messages.
- Case metadata is independent of `src/sim-model.js`, waveforms, fixed monitor values and staged editor state.

A **passing** schema audit only confirms that references and fields are present/consistent. It does **not** certify that a sentence is medically correct, that an external web resource remains live, that one publication directly entails a particular choice, that the student has learned a skill, or that staff signed off.

## 3. Traceability matrix of currently shipped draft items
| Case | Item | Learning objective IDs | Source | Evidence character | Clinical signoff |
|---|---|---|---|---|---|
| Orientation | source | o1, o2 | AARC 2024 + **app implementation contract** | Simulator fixed-screen behavior is app-specific; AARC defines bedside assessment | Pending |
| Orientation | fio2 | o1 | AARC 2024 | Recommendation on FiO₂ assessment + student inference about unknown oxygenation | Pending |
| Orientation | assessment | o2, o3 | AARC 2024 | General PVA, airway/humidification and securement assessment | Pending |
| Desaturation | first | o1, o2 | AARC 2024 | **Educational inference** from direct patient assessment principles; not an emergency protocol | Pending |
| Desaturation | verify | o1, o3 | AARC 2024 | General PVA includes patient, ventilator, airway, humidification | Pending |
| Desaturation | handoff | o2, o3 | AARC 2024 | **Educational inference** on structured observation reporting, not a validated SBAR rubric | Pending |

The `src/preclinical-cases.js` data is the canonical source; this table is an audit snapshot. Item notes explain where clinical inferences, app-implementation facts or guideline principles were used.

## 4. Instructor-preview UX behavior
- CASE list → “교수자 검토 미리보기 · 정답 공개” button (toggle).
- Clearly discloses **all answers** and the lack of permissions/access control: it is useful for self-review/development but **not a secure instructor-only mode**. An instructor who wants a summative pretest should not show this before the assessment.
- Displays case review gap, per-item answer, rationales, objectives, source-kind label and reference URL.
- Does NOT contain an `Approve` button or silently flip pending status; no server, log-in, review signatures or credential issuance.
- A real educator approval workflow should have independently authenticated reviewers, external review records and evidence version pinning. These are planned after local educational stakeholders establish policy.

## 5. Review checklist for subject matter experts (v0.3.9: blank template)
The following checklist is **not completed** and cannot be inferred from green CI.
1. [ ] Each concept and correct answer is clinically accurate and understandable for the undergraduate level.
2. [ ] Every explanation indicates whether it is direct guideline evidence, teaching inference, or simulator implementation.
3. [ ] Wrong answers are unambiguously inappropriate and not misleadingly plausible due to omitted patient facts.
4. [ ] Urgent deterioration scenarios do not imply unsupervised student interventions.
5. [ ] All proposed assessments and escalation steps are compatible with local ICU protocol and supervising nurse instructions.
6. [ ] The current 2025-revised INACSL prebrief/debrief process is reflected in facilitator materials.
7. [ ] Fictional SpO₂/respiratory rate values are visibly distinct from static PB980-style monitor examples.
8. [ ] The 3 reflection prompts support a facilitated debrief and do not imply objective skills assessment.
9. [ ] Source URLs and guideline revisions are independently checked; any hospital-specific knowledge is flagged.
10. [ ] Date, reviewer role, case+question revision SHA, issues/corrections, and final sign-off are recorded outside the public-facing student app.

## 6. Minimal review log entry to collect in future
```
case_id:
case_content_version:
question_id_or_scope:
reviewer_role: ICU RN educator / ventilator specialist / nursing faculty
review_date:
reviewed_evidence_version:
finding: pass / correction required / not applicable
finding_details:
student_scope_or_policy_variation:
followup_commit:
signature_or_institutional_approval_reference:
```
**No reviewer has signed this log as of v0.3.9.** Do not backfill names, dates or endorsements.

## 7. Student formative reflection / privacy
- After 3 questions, the results screen provides correct/incorrect comparison and a set of 3 prompts about observations, information gaps and reporting.
- Student text input is held **in current-page JavaScript memory only**; switching to CIRCUIT then back preserves it. Replaying the same case clears the previous reflection; refreshing the browser closes the lesson and clears notes. There is **no storage, account, analytics or network transmission** in this component.
- Avoid writing real patient identifiers in this educational app even when the page is running locally.
- There is no automated semantic scoring of free-text reflections; faculty facilitation should guide reflection.

## 8. Remaining v1.0 education gates
Formal clinical review and source verification, instructor sign-off, anonymized learner usability pilot, reliability of an item bank (after size and evaluation design justify it), mobile hardware testing, and site-specific policies must all be completed. Code validation is not educational/clinical approval.

Related: [v0.3.8→v1.0 roadmap](CLINICAL_PRECLINICAL_ROADMAP_v0.3.8.md).
