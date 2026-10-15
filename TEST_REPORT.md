## v0.6.0 B+ 통합 RC — QA 추적 (2026-10-15)

- **Baseline main:** `704e6401eb35aad9aabdbb726d8d8d5f1455f8c5` / 기능 `v0.5.4`, [Draft PR #35](https://github.com/pchjesus/ventilator-simulator/pull/35).
- 신규 `tests/content-integrity-v060.test.mjs`: 교육 설정 7·독립 고정 모니터 7·CORE 6/10·LAB 3/6·CASE 4/12·간호 행동 2 ID/정답/검토 보류 감사. 콘텐츠 변경 없이 검증만 추가.
- 신규 `tests/learning-path-browser-check.mjs`: 320·360·390·700·960·1100·1440px 안내 UI/가로 스크롤과 CORE/LAB/CASE 독립 RAM/이동 회귀. 원래 네 개 Chromium 스크립트 및 Node 테스트 유지.
- **증거 (정확한 SHA):** 최초 PR head `22a5606f13087298313fcf8cbdb352c6fcf0fc35`의 [Actions #38731422389](https://github.com/pchjesus/ventilator-simulator/actions/runs/38731422389) = scope/test/browser/package **ALL SUCCESS**. 통합 UI+신규 브라우저 테스트 head `d71ab8a1f667ccfe495cd2da48a713a2c0c029ec`의 [Actions #38732129347](https://github.com/pchjesus/ventilator-simulator/actions/runs/38732129347) = **ALL SUCCESS**. **후속 커밋의 PASS는 각 해당 커밋 Actions에서 별도 확인**.
- 학생 출력 형식과 학습실 이동 UX는 미승인; 답안 없는 활동지 형식 중립 문서만 개발 브랜치에서 보관. 최종 학생 ZIP에 정답 포함 `docs/` 파일이 없어야 하고 실제 패키지 HTTP 실행 검사 필요.
- **남은 게이트:** 최신 PR HEAD FULL CI · 최종 산출물 압축/HTTP 읽기 검증 · UX 결정 · 리뷰 및 main 병합 · 병합된 정확한 main SHA FULL CI · 실제 화면/실물 모바일/스크린리더/임상 전문가/학습자 평가 구분. **RC, FINAL 아님**.

## v0.5.4 D5-A — verification scope (2026-10-15)

**Implementation:** Branch `feat/v0.5.4-d5-guided-labs`, [PR #28](https://github.com/pchjesus/ventilator-simulator/pull/28). Starts from v0.5.3.3 verified main `a1ef752cf7ded86436c0b071032585a27cd5322d`.

**Added gates:** `tests/lab-engine.test.mjs` validates question schema/count, source/evidence/review pending, stage transitions, invalid answers and re-submission. `tests/lab-guided-browser-check.mjs` checks blank graph/result/ARIA before prediction, staged observation and interpretation, per-LAB RAM and only-selected restart, CORE/CASE/device isolation and 1440/700/360/320 mobile viewports. Previous unit tests, `browser-check.mjs`, `lab-browser-check.mjs` and `study-focus-browser-check.mjs` remain (older LAB tests adapted for explicit observation phase). Packaging verifies both new modules in dist and imports them.

**Verified PR HEAD `f037a0424fa4b8ba46e1a25499fff17699c81a33`:** [PR CI #38673809032](https://github.com/pchjesus/ventilator-simulator/actions/runs/38673809032) **test PASS (88/88 Node), browser PASS (original Chromium + LAB + A1/B1 + D5 at 1440/700/360/320), package PASS**. New `dist/src/lab-engine.js` and `dist/src/lab-lessons.js` loaded by actual Node ESM import; module audit returned `valid=true, count=6`. The downloaded student ZIP was independently extracted and smoke-imported. Chromium screenshots were downloaded and visually reviewed at 1440/700/320px for prediction gated view, PEEP observation and FiO₂ overlapping waveforms; no horizontal clipping detected by automated tests at the stated viewport sizes. [PR screenshot artifact](https://github.com/pchjesus/ventilator-simulator/actions/runs/38673809032/artifacts/11945870277), [PR web ZIP artifact](https://github.com/pchjesus/ventilator-simulator/actions/runs/38673809032/artifacts/11945690382). **Merged main SHA/its separate CI run pending at PR time**. No clinical, physical smartphone, screen reader or participant study validation has been performed. Original 82/82 PASS applies only to v0.5.3.3.

# TEST_REPORT — v0.5.3.3 (교육용 베타)

## v0.5.3.3 — A1/B1 학습 집중형 화면 회귀 (2026-10-15)
- v0.5.3 `main` 기준 SHA `3356ff938c2a4842689271313ab39ced40266d8c`. A1 900px 본문/1120px LAB, B1 모바일 기존 도구 접기 및 3단계 패치.
- 신규 Chromium `tests/study-focus-browser-check.mjs`: 1440px 기본 레이아웃/장비+학습 전환, 기존 3배치 설정 보존, CORE 퀴즈 답안/CASE 4개/LAB 실험·그래프/7설정·7고정 모니터 및 읽기창 Escape, FiO₂ 생성곡선 일치 안내; 1100/700/360/320px 접힘 도구/학습 바로가기/가로 넘침/스크린샷.
- 기존 Node 모델/원형 장비/CORE/CASE/`lab-browser-check.mjs` 테스트 삭제 없이 사용. 최종 PASS/FAIL은 실행된 GitHub Actions `test`·`browser`·`package` 결과로 확인해야 하며 **이 문서는 통과를 사전 선언하지 않음**.
- 실제 200%/400% OS 확대·실물 모바일·사용자 학습 효율·의료 전문가 감수는 별도 미실시.

## v0.5.3 — D3/D4 LAB verification (2026-10-14)

- 기준: `main` SHA `92737e197c1cb8fd1fee16b3c9161b32930c89cc` (v0.5.2.3 / Node 75/75, Chromium & package PASS). 기능 브랜치 `feat/v0.5.3-core-waveform-compare-lab`, [PR #26](https://github.com/pchjesus/ventilator-simulator/pull/26).
- 순수 엔진 7개 Node 테스트: 0→16초/320표본, 동일 X축·유형별 동일 Y축/finite/Flow 0, 설정 동일 파형 완전 일치, PEEP 5→8 기준압 변화, f 15→18 생성 간격 변화, FiO₂ 40→60 및 V-TRIG 변화에도 생성 파형 무변화, 기준/시험 사본의 원본 불변, 무효한 값 예외 처리.
- 별도 Chromium `tests/lab-browser-check.mjs`: 3개 최상위 탭/6개 CORE 카드, 랩 진입·실험/파형 전환·겹침 path 2개·Flow 0·LAB 종료/재진입 포커스, 기존 장비 설정/모니터/일시정지 경로, Pending Cancel, CORE 응답, CASE 4개, 학습↔임상 적용 전환에서 LAB 상태 유지. 700/360/320px 그래프 선택/resize/가로 넘침 및 4개 스크린샷. 기존 `tests/browser-check.mjs`의 7설정·7모니터·3파형/격자/커서/미리보기/퀴즈/CASE/보기 모드 회귀 테스트를 그대로 유지.
- CI package: whitelist에 `src/waveform-compare.js` 명시, `test -s` + **실제 dist 모듈 import 후 비교 데이터 수 검사**, 기존 4 CASE 의존성 동적 import 검사 유지. ZIP에 Node 테스트/임상 검토 자료를 넣지 않음.
- [최초 PR CI #38554643099](https://github.com/pchjesus/ventilator-simulator/actions/runs/38554643099): **Node 81/82 PASS · 1 FAIL**(기존 `tests/release-notes.test.mjs`의 고정 최신 릴리스 기대치가 0.5.2.3이던 문제). Chromium **PASS**, package **SKIPPED**. 버전 기대값 패치 후 다음 CI에서 재확인해야 함. 이 첫 CI는 릴리스 승인 결과가 아님.
- **스크린샷 수동 검토:** 초기 320px 실습 파형이 종횡비 letterbox로 과도하게 작아 보이는 문제 확인(자동 기능 검사는 기존 PASS). 550px 이하 SVG viewBox/축 좌표를 모바일에 맞추고 resize 시 순수 투영만 갱신하도록 개선. 새 Chromium 테스트는 320px 실제 curve bounding height가 75px 이상인지 검사하고, 비교 그래프가 보이는 focused desktop PNG를 별도 저장.
- 임상 감수, 사용자 파일럿, 물리 모바일/스크린리더/실제 PB980 검증, 산소화·VTE·fTOT 예측은 미실시/비구현. PASS인 자동 검사만 완료로 표현할 것.



## v0.5.1 — Readability P1–P5 evidence (2026-10-14)

- 기준: Private `main` SHA `a884a44ba3f4a7d3103013113691bdcae4188bee`, 최종 v0.5.0 CI [38419036280](https://github.com/pchjesus/ventilator-simulator/actions/runs/38419036280) SUCCESS.
- 개발: `feat/v0.5.1-reading-accessibility`, [PR #19](https://github.com/pchjesus/ventilator-simulator/pull/19).
- **첫 신규 구현 PR CI [38420856416](https://github.com/pchjesus/ventilator-simulator/actions/runs/38420856416) = test + browser + package 전체 SUCCESS.** 후속 버전·문서 변경은 별도의 최종 CI에서 재검증한다.
- 신규 Chromium 051-A01: `MONITOR_REFERENCE` 7개 순서/이름/숫자/단위와 확대 대화상자 정확 일치, 원본 그대로.
- 051-A02: `PARAMETERS` 7개 설정과 `committed state` 화면 일치, 확대창 입력요소 없음. 기존 Accept/Cancel/모달 재진입 기존 테스트 유지.
- 051-A03: 압력·유량·용적 파형 3개 명칭·단위 및 생성곡선/실측 아님 문구 확인, 원래 일시정지 파형 경로 변형 없음.
- 051-A04: Enter 열기, Escape·닫기와 trigger focus return, read-only 설정/고정 모니터/파형 상태 불변 확인. Native `dialog`에 의해 배경 상호작용은 비활성.
- 051-A05: 1440/1280/1100/960/700/360/320px에서 대화상자 표시·가로 넘침·세 범주 접근 확인. 원래 2 보기/3 배치/학습·CASE/팝업/파형 기존 Chromium 검사 모두 보존.
- 051-A06: 1280 기준 200%≈640px, 400%≈320px **CSS viewport reflow 상당 검증**. *실제 브라우저 UI Zoom 200%/400%, 물리 기기, 키보드/화면읽기 보조기기 전수검증은 미실시.*
- 비교 이미지: v0.5.0 [기준 browser-screenshots](https://github.com/pchjesus/ventilator-simulator/actions/runs/38419036280/artifacts/11825626770) vs v0.5.1 [첫 PR browser-screenshots](https://github.com/pchjesus/ventilator-simulator/actions/runs/38420856416/artifacts/11826013141). 데스크톱·320px 주요 이미지 및 1280/700/360/320 확대 이미지를 직접 확인; 새 공용 진입 영역으로 desktop full-page 높이 1600→1676px 증가, 원래 고정 모니터와 학습 화면은 보존.
- [첫 PR 정적 웹 ZIP](https://github.com/pchjesus/ventilator-simulator/actions/runs/38420856416/artifacts/11825679053) 생성 성공. 로컬 HTTP localhost는 환경 제한(`ERR_BLOCKED_BY_ADMINISTRATOR`)으로 접근할 수 없어, 최종 main ZIP은 오프라인 data URL 기반 Chromium 재실행도 수행했다. 정적 HTTP 서버에서의 브라우저 테스트는 GitHub CI에 의존한다.
- **미실시:** 실제 환자·PB980 펌웨어 측정/조작 재현, 임상 SME 감수, 간호학생 사용성/교육효과 평가, 물리적 스마트폰, OS 브라우저 자체 zoom/화면읽기 보조공학 QA. 신규 0.5.2 LAB/콘텐츠는 미구현.
- **실제 PR #19 병합 완료:** 기능 릴리스 main SHA `893476ff19de1db576e87cd5d4e8966c1e3e4e05`. [정확한 main SHA의 Actions #38423564087](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087)에서 `test`, `browser`, `package` 3 job **모두 SUCCESS**. 기존 Node 단위 테스트 **68/68 PASS**.
- **최종 main 산출물:** [Chromium screenshots (#11827916241)](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087/artifacts/11827916241) · [학생용 정적 web ZIP (#11827517172)](https://github.com/pchjesus/ventilator-simulator/actions/runs/38423564087/artifacts/11827517172). ZIP은 `index.html`, `styles.css`, 13개 JS ES module, `.nojekyll`로 구성되며 교수자 전용 `docs/` 및 정답 파일은 미포함.
- **후속 마무리 재검토:** 최종 main ZIP의 13개 JS 모듈을 오프라인 data URL에 연결하여 로컬 Chromium에서 재실행. 7 모니터/7 설정/3 SVG/읽기창/Enter·Escape·focus 동작, 설정 확정 40→55 후 큰 글씨 `55` 반영, Pending `90` 취소 후 `55` 유지, 7개 너비 가로 넘침과 마지막 카드 스크롤, 열린 읽기창 resize, 페이지 JS 오류 0개 확인. 오프라인 data URL 실행은 일반 HTTP 정적 서버 배포를 대체하지 않으며, 서버 호스팅 방식은 GitHub Actions Chromium 테스트로 확인. 후속 `tests/browser-check.mjs`에는 확정값과 Pending 취소 분리를 추가해 재발 방지.
- 문서/테스트 마무리 작업은 기존 기능 main 릴리스와 분리해 별도 PR로 관리하고 그 PR 및 병합 후 CI 결과를 다시 확인한다.

## v0.5.0 FINAL — 최종 기능 브랜치 실행 결과 (2026-10-13)

- 브랜치: `feat/v0.5.0-student-learning-final`, Draft PR [#16](https://github.com/pchjesus/ventilator-simulator/pull/16).
- [GitHub Actions #38344179977](https://github.com/pchjesus/ventilator-simulator/actions/runs/38344179977): **SUCCESS**.
- Job test: Node.js 22 JavaScript syntax + Node unit tests **PASS**.
- Job browser: 실제 headless Chromium 기반 종합 브라우저 테스트 **PASS**.
- Job package: 정적 웹사이트 실행 ZIP 업로드 **PASS**.
- 스크린샷: 자동 Chromium 캡처가 포함된 `browser-screenshots` artifact [#11788630762](https://github.com/pchjesus/ventilator-simulator/actions/runs/38344179977/artifacts/11788630762).
- 웹 실행본: `pb980-web-only` 정적 앱 artifact [#11788660655](https://github.com/pchjesus/ventilator-simulator/actions/runs/38344179977/artifacts/11788660655).
- 추가된 검사: 7 화면 너비(1440,1280,1100,960,700,360,320), 네 가지 데이터 출처 안내, 키보드 Enter 장비 펼치기/학습 복귀, 3개 파형 유지, 7개 고정 값 유지, 기존 설정과 CASE 흐름 회귀.
- 이 결과는 CI **실행/자동 브라우저 검증**을 뜻하며 실제 학생/교수자 대상 연구, 전문가 검증, 실물 PB980 동일성, 보조기기 전수 검사 완료가 아님.
- `main` 병합 후 발생할 최종 커밋과 CI는 해당 머지 SHA와 Actions 실행 ID로 별도 재확인한다.


## v0.5.0 FINAL 통합 검증 기록 — 자동과 수동 검증 구별

**테스트 대상:** v0.4.6 FINAL `f884383...`을 기준으로 v0.4.7→v0.4.8→v0.4.9→v0.5.0 순차 개발. 최종 `main` SHA/CI 결과는 병합 검증 후 별도로 추가한다.

| 단계 | 자동 CI | 범위 |
|---|---|---|
| v0.4.7 | [38343016130 · SUCCESS](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343016130) | 문구 및 I:E·V̇E 자리 잘림, 1440/1280/1100/960/700/360/320 브라우저 값 표시 |
| v0.4.8 | [38343423745 · SUCCESS](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343423745) | 모바일 학습 우선/펼치기, 학습 내용, 기존 설정·파형·CASE·퀴즈 회귀 |
| v0.4.9 | [38343729579 · SUCCESS](https://github.com/pchjesus/ventilator-simulator/actions/runs/38343729579) | CASE 읽기 전용 역사/진행/학습목표 복습, 두 영역으로 구분한 퀴즈 결과 및 기존 동작 |

**v0.5.0 추가 브라우저 범위:** 네 자료 출처 구분, 모바일 펼치기/복귀 키보드 Enter, 3개 파형/고정 7개 값의 상태 보존, 기본/장비 탐색, 1440/1280/1100/960/700/360/320 폭과 스크린샷, 가로 오버플로. 기존 CI 단위·구문·브라우저·웹 정적 ZIP 워크플로 모두 재실행한다.

**검증 완료로 주장할 수 없는 것:** 실제 스마트폰 및 사람의 육안 UX 검사, 화면읽기 도구 전체 호환성, 200% 확대 전문 QA, 초보 간호학생 대상 실제 사용성/효과 연구, 임상전문가 감수, 실제 PB980 정확성/환자 생리 예측 검증. 모두 별도 계획만 마련했으며 미실시.

**되돌리기:** Private main의 v0.4.6 FINAL `f884383a54563fdb75ed6ca14b4b1db987e92856`을 기준으로 복귀할 수 있다. 기능 브랜치에서 CI 실패 시 main 병합 보류.

---

## Scope
Implementation introduces first web entrypoint, educational settings and CIRCUIT conceptual views.

## Automated checks
- `npm run check`: JavaScript syntax checks for model and UI.
- `npm test`: Node built-in unit tests of settings initial values, increments, bounds, rounding, invalid operations and immutability.

## Expected manual acceptance checklist (pending actual execution)
- [ ] Open http://localhost:8077/ and confirm all assets load without console errors
- [ ] Observe monitoring/waveform as clearly tagged static examples
- [ ] Increment and decrement each setting; clamp at bounds
- [ ] Reset after adjusting several settings
- [ ] Open ? explanations and return to CIRCUIT tab
- [ ] Switch parts/assembly overview/complete schematic and use prev/next
- [ ] Verify keyboard focus, desktop and narrow-mobile layout

## Explicitly not tested
Actual PB980 fidelity and range correctness, physiologic model (not implemented), clinical use, actual Android/iOS hardware, GitHub Pages URL availability.

Do not interpret source-code presence as browser acceptance evidence.

## GitHub Actions verification (2026-10-09)
- Workflow: [Ventilator simulator checks](https://github.com/pchjesus/ventilator-simulator/actions/runs/37880435097)
- JavaScript syntax check: **passed**
- Node model tests: **5 passed / 0 failed** (initial state, bounds, decimal arithmetic, invalid operations, immutability)
- Actual browser execution, manual screen/interaction review and real-device checks: **not yet verified**
- CI proves the tested source paths, not PB980 clinical fidelity or public URL deployment.

## Browser acceptance and screenshot review (2026-10-09)
GitHub Actions run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37883088395

- Chromium headless desktop (1440×900 viewport): PASS; initial UI, seven settings, seven static monitor values, increment, help, circuit tabs and assembly steps, reset.
- Chromium headless mobile (360×780 viewport): PASS; no horizontal overflow, PEEP +0.1, help tab interaction.
- Script/page console errors observed: none.
- Browser screenshot artifacts: `desktop.png` and `mobile.png` attached to the run.
- Screenshot visual inspection: two-column desktop composition and stacked mobile controls are legible; this is **not** a pixel-match test against PB980.
- Real phone, touch comfort and manufacturer clinical parameter confirmation: **not verified**.

## v0.2.2 — CI result (2026-10-09)
- [GitHub Actions 37885689471](https://github.com/pchjesus/ventilator-simulator/actions/runs/37885689471): **SUCCESS** across `test`, `browser`, and `package`.
- Syntax verification and the five existing unit tests: passed.
- Chromium desktop: 1440px main screen, help, circuit steps, reset, example monitor isolation: passed.
- Chromium mobile: 360px + PEEP 0.1 and help: passed.
- Chromium narrow mobile: 320px no horizontal page overflow, setting interaction: passed.
- Keyboard: FiO₂ increment button retains focus after click; Enter increments again: passed.
- Screenshot artifacts uploaded, including 320px output.
- Not covered: actual Android/iOS hardware, PB980 manufacturer setting bounds, clinical model fidelity, a public website URL.

## v0.3.0 GitHub Actions verified
- Run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37932826738
- Outcome: `test`, `browser`, and `package` **success**.
- Numerical waveform tests: **8**; preexisting setting tests: **5**; syntax checks passed.
- Browser: all three traces, Pi/PS/PEEP changes, pause/resume, focus, reset, CIRCUIT, help, 1440/360/320px layouts, JS error capture.
- Visual evidence: `browser-screenshots` artifact with desktop/mobile/narrow captures; inspected for layout readability. Not pixel-level OEM fidelity or physical-device test.
- First browser run had ambiguous +1 vs +10 selector. Second surfaced an actual freeze-frame repaint race. Both were fixed and CI rerun successfully.
- Clinical validation, parameter bounds and OEM waveform equivalence **not tested**.

## v0.3.1 — Actual GitHub Actions verification (2026-10-09)
- Run [37942300189](https://github.com/pchjesus/ventilator-simulator/actions/runs/37942300189): **SUCCESS** (`test`, `browser`, `package`).
- Node unit tests: **16 passed, 0 failed**. Includes previous 13 and three additional numerical/safety cases.
- Browser: desktop 1440px; mobile 360px/320px; settings, help, CIRCUIT, reset, keyboard focus, waveform response, pause/resume and reduced-motion preference passed.
- Console/page script error capture: no errors observed in tested flows.
- Initial run [37942154751](https://github.com/pchjesus/ventilator-simulator/actions/runs/37942154751) failed **only** because a new test requested 2,001 samples when the implementation allows at most 2,000. Corrected the test input, reran successfully.
- Physical Android/iOS hardware, OEM GUI/pixel fidelity, manufacturer parameter bounds and clinical validity remain **unverified**.


## v0.3.2 — Visual patch CI acceptance
- Run: https://github.com/pchjesus/ventilator-simulator/actions/runs/37944924891 — SUCCESS for test, browser and package.
- Unit tests: 16 passed, 0 failed.
- Desktop Chromium 1440px: seven readouts, three waveforms, seven controls; focus, reset, help, circuit, pause and setting-driven trace changes work.
- Additional UI: curved bezel, left MENU strip, new Home/Help shortcuts work.
- Mobile Chromium 360/320px: settings and Circuit controls work; no page-wide horizontal overflow.
- Reduced-motion preference and playback remain functional; no JS page/console errors captured in tested flows.
- Screenshots retained in Actions browser-screenshots artifact; desktop/320px visually inspected.
- Manufacturer limits, pixel-perfect matching, physical phone touch experience and clinical accuracy: NOT validated.

## v0.3.3 — PB980 reference GUI patch (2026-10-10)
- Starting remote main head: `69aff76fd34cc2424acc35d410f7fb1a9cbc20de` (v0.3.2).
- Added three new manufacturer-reference consistency tests alongside 16 existing pure tests; extended browser checks for visual region geography, left graph labels, reference help and original controls.
- **Execution pending**: Do not report a CI success until the actual workflow run and screenshot evidence have been checked.
- Outside scope / still unverified: device-specific firmware pixel comparison, physical smartphone, true clinical parameter interlocks, actual ventilator waveform or clinical use.

### Actual implementation verification and visual regression (2026-10-10)
- First GUI implementation run [37962118564](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962118564): SUCCESS test/browser/package; 19/19 Node tests.
- Visual inspection of the three screenshot artifacts exposed a **real regression not caught by the then-current test**: mobile settings fell into four thin columns because late global CSS overrode the existing narrow breakpoint.
- Patched CSS to restore two-column settings at widths ≤550px. Added explicit 320/360px computed grid-column assertions to browser regression checks.
- Patched **application code** was verified in [37962366798](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962366798): SUCCESS test/browser/package; 19/19 units. Inspected desktop (1440), mobile (360), narrow (320) screenshots, confirmed readable two-column controls and no obvious overlap.
- The later test-only commit introducing explicit two-column assertions is covered by separate CI run [37962394683](https://github.com/pchjesus/ventilator-simulator/actions/runs/37962394683); final outcome should be checked before main merge. Latest report should not treat an in-progress run as passed.
- Browser tests cover focus, settings, waveform/pause/reduced motion, circuit/help, layout, reset and JS errors. No actual PB980 pixel overlay or physical phone verified.

## v0.3.4 — Public reference GUI checks (2026-10-10)
- Base: v0.3.3 main e9a2ed4ca3ffb03b24781110a3c8841a6ee780a5 (private).
- No change to simulation domain, value adjustment or waveform computation.
- Added expected browser checks: green fixed C badge inside top patient data, nine physical visual key representations, narrow-screen element visibility, previous keyboard/settings/waveform/help/circuit/reset/motion/overflow checks.
- **Branch CI PASS**: [GitHub Actions 38052371541](https://github.com/pchjesus/ventilator-simulator/actions/runs/38052371541) — syntax OK, 19 unit tests passed, 0 failed; Chromium desktop/360/320, button, pause, keyboard, help, CIRCUIT, reset and no-overflow checks passed; package succeeded. Desktop and narrow 320px images inspected, source markers/9 keys as expected. Separate post-merge main checks remain to be observed; no actual PB980 fidelity or physical phone test.
- Unverified: device firmware/patient parameter parity and true clinical functions.

## v0.3.5 — Dual-control verification (2026-10-10)
- Base `main` v0.3.4: `54d21a404e743955d06f1e0adbf2ffddfbf643ba`.
- Initial branch run [38054608709](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054608709): **SUCCESS** across syntax, 24/24 Node tests, Chromium browser and static package. No failures reported.
- Pure tests cover separate pending/committed values, bounds, decimal steps, immutable Accept, unchanged Cancel, unknown setting and stale-edit protection.
- Browser checks cover device mode default, independent pending value, Cancel/Esc, ArrowUp+Enter Accept, modal reset, restored focus, Quick Study control parity, keyboard and responsive 1440/360/320, original waveform/Pi/PS/PEEP/rate/Ti behavior, reduced motion, help, CIRCUIT, reset, browser JS errors and package.
- Separate dialog-open screenshots were added to browser CI *after the initial successful run*. Inspect the latest run and screenshots before claiming final visual verification.
- Real device/physical smartphone, true PB980 knob/menu/conditional limits, firmware-identical UI and physiological validity remain UNVERIFIED.

### Final expanded visual verification — v0.3.5 branch (2026-10-10)
- [GitHub Actions 38054960790](https://github.com/pchjesus/ventilator-simulator/actions/runs/38054960790): SUCCESS; unit, Chromium browser and static package all passed with additional screenshots.
- Chromium screenshots generated for each layout and workflow: `desktop.png`, `desktop-quick.png`, `desktop-editor.png`, `mobile.png`, `mobile-quick.png`, `mobile-editor.png`, `narrow-320.png`, `narrow-quick-320.png`, `narrow-editor-320.png`.
- Examined desktop editor, 320px device view, 320px open sheet and 320px quick view. Pending highlighted in yellow; Accept/Cancel and reset visible; no obvious clipping, Quick Study buttons remain independently shown in two-column settings tiles.
- No capture is a pixel comparison to verified PB980 firmware. Post-merge main CI remains a separate gate.

### Merged-main integration verification (v0.3.5)
- Merge PR [#3](https://github.com/pchjesus/ventilator-simulator/pull/3), squash SHA `762fea2cb03c747f6a6e1c9e94676436b8b4b71e`.
- Actual main-branch Actions [38055192585](https://github.com/pchjesus/ventilator-simulator/actions/runs/38055192585): **SUCCESS**, all `test`, `browser` and `package` jobs green; verified remote `main` and repository Private visibility.
- This subsequent report-only commit does not modify application code; CI should still be checked against its final commit before closing the patch.

## v0.3.6 — Clinical info and modal UX regression (2026-10-12)
- Base `main`: `41d1b80b97ec8de2f7d913836a83eb277f786bba`.
- Added 5 unit-schema tests covering seven per-setting topics, source links, 13-topic navigation, seven-part manual, release category definitions and filter immutability.
- New Chromium checks: desktop manual sections, linked references, release list & category filter, X, Escape, outside click, inside click stays open, focus restoration; 360px modal geometry and X; 320px native touch/backdrop close, filters and overflow. All existing editor/quick settings/CIRCUIT/waveform/reduced-motion assertions retained.
- Initial PR #4 run 38187105272 failed 1 content assertion (PS summary too short) and browser focus restoration on backdrop; corrections made and CI rerun required. These are test-caught defects, not a passing release.
- Manufacturer-certified clinical algorithms, patient-specific settings, actual ABGA/spO2, true ventilator alarms and physical mobile testing remain outside verification.

### Final v0.3.6 PR regression result (2026-10-12)
- After correcting the initially detected PS summary completeness and backdrop focus errors, [GitHub Actions #38187368353](https://github.com/pchjesus/ventilator-simulator/actions/runs/38187368353): **SUCCESS** for `test`, `browser`, and `package`.
- Node built-in suite: **29/29 passing, 0 failures**. No changes to waveform engine or educational parameter calculation.
- Chromium: native manual and version dialogs, 5-category filter, Escape/X/outside touch/click, focus handling, 13 evidence-linked learning topics, desktop 1440px, mobile 360px and 320px checks; original quick/device setting mode, waveform pause/reset/CIRCUIT still pass.
- Examined 15 browser screenshots from latest branch workflow, including the corrected narrow 320px `사용 설명서` heading, 320px patch filtering and desktop clinical help.
- PR merge + post-merge main CI is a **separate required gate**.


### Integrated Private main release verification — v0.3.6
- PR [#4](https://github.com/pchjesus/ventilator-simulator/pull/4) successfully squash merged as `c7cd912eff51665eda2a24e6ef801ccf7630aa7b`.
- Exact merge commit passed main push GitHub Actions [38187571168](https://github.com/pchjesus/ventilator-simulator/actions/runs/38187571168): `test` (29/29), `browser` (desktop/360/320 + new dialogs), and `package` all **SUCCESS**.
- Main remained `Private` and GitHub Pages was not published; downloadable workflow artifacts contain verified static browser assets and 15 Chromium screenshots.
- This report-only follow-up commit does not alter app logic. Its CI is verified separately, if/when available.

## v0.3.7 — readability and waveform inspector acceptance plan
- Baseline private main `cdec71a3ab43a279b4f66b9d1009a6da737b48f6`.
- Pure cursor unit tests: clamp/invalid numeric positions, pointer normalization, sampler deterministic mapping and finite values, validation of untrusted samples.
- Chromium tests added: default moving graph, analysis freezes, three shared cursor lines, slider Home/End, direct plot click, sample values finite, fixed patient monitor unchanged, grid button independent, exit playback restoration.
- Existing complete browser suite preserved (modal management, Accept/Cancel/pending, Quick Study, waveform mode effects, CIRCUIT, reduced-motion, desktop/360/320 responsive viewport, keyboard focus).
- Source-code presence is not verification. Required green PR and **exact final main SHA** test/browser/package jobs; visual PNG inspection; no PB980 device/smartphone hardware validation or clinical physiology claims.


### v0.3.7 integrated browser review and Private main release (2026-10-12)
- PR [#5](https://github.com/pchjesus/ventilator-simulator/pull/5) merged into private `main` as `9370cf6797886f7e7af3e9cb55f51e8927904675`.
- Exact merge commit verified by GitHub Actions [38192764211](https://github.com/pchjesus/ventilator-simulator/actions/runs/38192764211): `test`, `browser` and `package` all **SUCCESS**.
- Node regression count **34 passed / 0 failed** (prior 29 + five pure cursor tests). Chromium browser acceptance generated 18 screenshots (including desktop/mobile/narrow analysis captures). Existing Accept/Cancel, quick study, CIRCUIT, 7 fixed monitor values, 3 graph phases, Pause/Resume, Manual/Changelog retained.
- Screenshots inspected: `desktop.png`, `desktop-analysis.png`, `narrow-320.png`, `narrow-analysis-320.png`; neutral device body, legible settings and monitored readouts, mobile 2-column settings with no width overflow. Inspection cursor 3 graphs and generated values visible.
- Limitations: no real PB980 UI pixel match, no direct real smartphone or physical device test, no clinical patient simulation or waveform physiological validation.
- Subsequent documentation-only release-status commit (if any) is rechecked with the exact resulting main SHA separately.

## v0.3.8 — Preclinical CASE pilot test plan
- Base: `c5371ea86df003add7d7907aee4899966713f84c` (v0.3.7 Private main).
- New Node tests: two case IDs, 3-step case schemas, rationale/sources, immutable answers, correct/incorrect scoring, start/advance/finish/restart, invalid inputs.
- New Chromium checks: select a case, answer/rationale, advance to final grade and restart, tab switch retains state, ventilator reset does not change case, monitor and setting text invariant, switch to second scenario, 360/320px CASE layout without horizontal overflow.
- Preserve all v0.3.7 graph inspection, grid, staged Accept/Cancel, Quick Study, help and manual, CIRCUIT, reduced motion and responsiveness.
- **Explicit boundary:** automated test passing is not evidence of clinical accuracy or nurse student competency. SME content audit, institution alignment and facilitator pilot are not performed yet.


### v0.3.8 PR gate and visual review (2026-10-12)
- Initial workflow [38198193594](https://github.com/pchjesus/ventilator-simulator/actions/runs/38198193594): 37/38 unit tests (release-note category completeness failed) and browser check passed. Added missing UI/UX category; no scenario/clinical model mutation.
- Corrected PR-branch workflow [38198237425](https://github.com/pchjesus/ventilator-simulator/actions/runs/38198237425): **38/38 Node tests, Chromium browser, static web package all SUCCESS**.
- Chromium captured 22 PNG screenshots, including `desktop-case-question.png`, `desktop-case-complete.png`, `mobile-case.png`, `narrow-case-320.png`. Inspected desktop and 320px scenarios; question choices and fictional-case warnings legible and inside viewport.
- Existing simulated ventilator settings/waveform, help/manual, quick/device mode and simulator reset verified unaffected by case choices. Case progress survives tab switch and simulator reset.
- Remaining before closing: merge PR #6, verify Private `main`, ensure exact final main SHA independently passes test/browser/package.
- Not completed: external clinical SME sign-off, hospital-policy alignment, nursing education effectiveness pilot and physical-phone field study.


### v0.3.8 merged-main integration verification (2026-10-12)
- PR [#6](https://github.com/pchjesus/ventilator-simulator/pull/6) merged as `0942cc1b4138695474b0a92141bfb7a454697b6e`.
- Exact app commit GitHub Actions [38198481423](https://github.com/pchjesus/ventilator-simulator/actions/runs/38198481423): `test` (38/38), `browser` and `package` all **SUCCESS**.
- Repository remained **Private** and no Pages deployment was activated.
- Documentation-only status update does not alter runnable simulator or clinical case files; latest final SHA is rechecked via CI separately.

## v0.3.9 — planned clinical-content integrity and browser regression
- New `tests/case-quality.test.mjs` verifies mapped objectives/sources and rejects missing rationale, duplicate options, invalid answer keys, expired-ish malformed URLs, review metadata implying false approval, and incomplete debrief.
- Existing case engine / waveform / staged editor / help/circuit tests remain enabled.
- Chromium extensions: show 3-item instructor preview with pending status and secure links, dismiss and launch; show evidence after answer, complete 3 steps, compare answers, enter/retrieve reflection note after tab switch, device reset doesn't touch CASE, 320px review panel stays within viewport.
- Separate quality claims: schema checks do not check clinical correctness, links resolving to current contents, local ICU procedures, or actual professional signatures.
- Final gate: green PR and final Private main code SHA test/browser/package, screenshots manually inspected; no clinical expert validation.


### v0.3.9 corrected PR regression and screenshot inspection — 2026-10-12
- The first browser CI caught a strict-locator conflict between the answer-review outer summary and nested evidence details. Updated browser test to explicitly select only direct child `> summary`; no simulation or content grading change was needed.
- Latest full PR-branch CI [38203543362](https://github.com/pchjesus/ventilator-simulator/actions/runs/38203543362): `test`, `browser`, `package` all **SUCCESS**.
- Node: **45/45 pass** (previous 38 + 7 case-quality audits). Chromium: 1440 desktop, 360 and 320px mobile including instructor open answer preview, 3 item evidence links, answer accordion, reflection notes surviving tab switch and existing simulator regression suite.
- 24 screenshots reviewed/generated: manually inspected `desktop-case-instructor.png` and `narrow-case-instructor-320.png`, with clear warning that the mode is open to anyone, **pending clinical review**, and no visible horizontal overflow.
- Source URLs are structural HTTPS links only; live links and content wording still require instructor review. No patient data / memory storage.
- Next integration gate is exact Private `main` merged commit CI.


### v0.3.9 Private main integrated release (2026-10-12)
- PR [#7](https://github.com/pchjesus/ventilator-simulator/pull/7) squash merged as `85bf91a82f48d5cc2956a501d4ce34510aaffd41`.
- Exact application code merge CI [38203800899](https://github.com/pchjesus/ventilator-simulator/actions/runs/38203800899): `test`, `browser`, `package` all **SUCCESS**, **45/45 Node tests**.
- The main branch remained **Private**. No GitHub Pages deployment or clinical publication.
- GitHub Actions generated static web and 24 Chromium screenshots for source-matched application build.
- Report-only follow-up commit makes no app-code or clinical-content changes; its exact final SHA CI should be separately verified before closure.

## v0.4.0 — planned alarm learning & baseline regressions
- Existing 45 unit assertions, browser staged settings, fixed monitors, waveform inspection/pause, modal Help, CIRCUIT, case/debrief and instructor preview retained.
- New unit tests for 15 display terms, 4 lessons, coverage, unique IDs, source metadata, 3-choice answer grading, immutability and invalid action rejection.
- Browser: choose each tab, 4 alarm cards, instructor-independent page-only quiz and retry, return to list, setting/monitor/mode filter counts of 7/7/1; ensure text and waveform structures unchanged; 360 and 320px cases and no horizontal overflow.
- Clarify not tested: **real PB980 alarm trigger thresholds, priority conditions, sensor analysis, patient ventilatory outcome, clinician approval and physical handset tests**.
- Gate: green PR unit/browser/package and exact merged Private main CI, with browser screenshots visually reviewed.


### v0.4.0 successful PR integration and screenshot review (2026-10-12)
- Initial PR workflow [38208445072](https://github.com/pchjesus/ventilator-simulator/actions/runs/38208445072) passed **52/52 unit tests** but browser never started because of a misquoted CSS locator in the newly added test. Fixed test selector and added `node --check tests/browser-check.mjs` to preflight syntax checks.
- Corrected PR workflow [38208572810](https://github.com/pchjesus/ventilator-simulator/actions/runs/38208572810): **test 52/52, browser, package all SUCCESS**.
- Chromium generated **28 PNG captures**, covering existing desktop/360px/320px workflows plus new `desktop-alarm-feedback.png`, `desktop-alarm-terms.png`, `mobile-alarm.png`, `narrow-alarm-320.png`.
- Inspected actual `desktop-alarm-feedback`, `desktop-alarm-terms` and `narrow-alarm-320` screenshots. Right study panel remains usable with 4 tabs, alarm quiz/feedback display, terms filters and narrow text wrap; narrow viewport browser assertions detect horizontal overflow.
- No patient alarm triggers, acoustic alerts, physiology, device firmware or actual field training is validated.
- Required release gate still ahead: merge PR #8 to Private main and verify exact final main commit CI (test/browser/package).

## v0.4.1 student-first acceptance
- Existing 52 unit checks + 5 new core-curriculum validations = 57 total.
- Initial CI caught old topic-array ordering assumption and an overlong teaching mnemonic requirement. Updated tests to preserve full topic coverage while intentionally changing priority.
- Initial Chromium test had a hidden advanced waveforms topic click. Adjusted to explicitly expand additional Help before selecting; no underlying app error.
- Browser assertions now cover default six-card core, advanced disclosure closed, setting tiers 3/4, preserve old settings/CASE/CIRCUIT/ALARM/waveforms, safe advanced collapse, mobile 320/360, and browser screenshot captures.
- Green CI is not clinical validation of PEEP response, local PB980 alarm firmware, or learning effectiveness.


## v0.4.2 coverage added (2026-10-12)
- tests/core-quiz.test.mjs: 10-item/six-concept structure, all-option explanations, invalid data, source trace, immutable gated state, reset/retry, final score, original case/monitor/settings nonmutation.
- tests/browser-check.mjs: 1440px start/feedback/review, tab/device-reset persistence, complete ten questions, instructor preview, retry and unchanged CASE; 360/320px touch control, overflow and screenshots.
- Existing tests are retained; npm syntax check and CI packaged-site file set now include src/core-quiz.js.
- CI execution outcome and screenshot inspection are not implied by source changes. Passing automation is not clinical expert approval. See docs/CORE_LEARNING_CHECK_v0.4.2.md.

### v0.4.2 PR #11 verified execution
- Last verified candidate run before documentation-only update: https://github.com/pchjesus/ventilator-simulator/actions/runs/38220997638, head `24f8ef564baf0f0e37b410feec935146dbbd21d3`. Jobs: `test`, `browser`, `package` SUCCESS.
- Node.js 22 CI: syntax check PASS, **63/63** unit tests PASS (0 failed; 6 new quiz tests).
- Playwright Chromium: **21 logged PASS checkpoints**. Tested 1440px desktop, touch 360px/320px, 10-item knowledge check, answer gating, all-option explanations, retaining quiz state after tab navigation/device reset, complete/retry, CASE handoff, device/graph/monitor independence, existing ALARM/CIRCUIT/manual/editor/waveform/CASE/reduced-motion behavior. Browser console/page errors none captured.
- Screenshot artifact reviewed: desktop-core-quiz-feedback.png, desktop-core-quiz-complete.png, mobile-core-quiz-360.png, narrow-core-quiz-320.png plus existing UI screens. **35 screenshots captured**. Desktop quiz scroller applied only during active quiz; other pages remain unchanged. Hardware-device testing was not performed.
- Early PR runs detected one obsolete version expectation in tests/release-notes.test.mjs and a false CASE text mismatch comparing innerText while hidden versus visible; corrected version assertion and used textContent for stable CASE DOM comparison, then full regression re-run passed. A separate screenshot-observed desktop scroll-context usability issue was corrected with a bounded study-panel scroll and desktop workspace alignment.
- *Clinical validation is outstanding*: passing tests only establish program behavior and schema, not expert approval, examination validity or physiological correctness. Re-check the final merged main CI separately.


## v0.4.3 QA / traceability extension
- New `tests/core-quiz.test.mjs` assertions: 10/10 reviewer prompts and source-interpretation notes, approved=false, app-contract is internal/no private GitHub URL, rejection of clinical claims citing only internal app code.
- Extended `tests/browser-check.mjs`: concept revisit → return-to-quiz focus and progress intact; instructor preview displays ten evidence notes and ten unanswered review prompts; no private GitHub source link; 1440/360/320px button checks.
- Original tests retained; waveform/monitor/CASE source files unchanged. No actual instructor/student testing or mobile physical device test.
- Final release CI results and screenshots must be recorded from the exact merged main SHA, not inferred from source code.


### v0.4.3 PR #12 executed acceptance — 2026-10-12
- Successful PR CI run: https://github.com/pchjesus/ventilator-simulator/actions/runs/38242016756 (head `887869442b14d0072a2e55425d05b4954e2a4371`); syntax, unit, Chromium and static package jobs all passed.
- Node unit **66/66 passed**, no failures; Chromium **21 PASS checkpoints**, page/console errors none; coverage includes 1440 desktop and 360/320 touch emulation. CI screenshot artifact includes **35 PNG** images.
- Inspected core-quiz feedback/completion and 320px screenshot evidence. Device panel remains visible on desktop during quiz, and mobile quiz buttons remain inside page width. Physical smartphone tests were not conducted.
- An initial PR browser check failed due to a faulty **test expectation** that buttons inside all collapsed <details> cards should be visible. The test now checks existence of all six buttons and visibility after explicitly opening a card; no app logic changed for this fix. Subsequent full run succeeded.
- Expert clinical content signoff / clinical simulation validity / actual student usability pilot: **NOT performed**.
- Post-merge CI on exact final main SHA must be verified separately before release completion.


## v0.4.4–v0.4.6 integrated UX regression plan and PR evidence (2026-10-13)

### Confirmed features implemented on feature branch
- v0.4.4: layout 3 presets and UI 2 presentations; switching only affects CSS/layout attributes and does not reset model/CASE/quiz/waveform.
- v0.4.5: modal numeric draft with exact range/precision validation, bounded pointer long-hold +/- in modal and quick-study mode, removed inert TURN, per-item pending default; header reset remains global.
- v0.4.6: CASE stage goals/roadmap, re-openable fictional context and independent RAM-only session resume/restart for two cases.

### Automated regression coverage
- tests/setting-editor.test.mjs: existing staged, Cancel, stale-edit, range tests plus strict parsing for all 7 settings, malformed input, per-item default/pending/Accept.
- tests/browser-check.mjs: three layout presets and two UI presentations, stable settings/monitor values, modal numeric invalid entry/validation and long-hold, quick-mode hold, CASE per-case list/resume and answer persistence; original 7 settings, 7 fixed monitor examples, pressure/flow/volume waveforms, CASE 2×3, CORE 10, Help, CIRCUIT, ALARM and reset/tab/keyboard/breakpoint regressions retained.
- Screenshots: CI Chromium 1440px desktop plus 360px and 320px emulation; desktop device exploration, modal editor and CASE roadmap images among captures.
- A v0.4.4 responsive regression revealed narrow card's tier badge overlaying the absolutely positioned ? button. Root-cause fix: at <=550px move the help control into normal card flow rather than adding merely more badge margin. Re-run proved Chromium browser pass on PR head c0c6b0af5e242b757d713aa6b3d21ad2904dd4e3 (CI run 38336931392).
- Superseded PR runs on earlier commits were failing and **must not** be represented as passing. Final build/main run only establishes release acceptance if its exact SHA reports successful test, browser and package jobs.

### Safety and remaining verification
- All numbers and setting increments are educational rather than clinically validated PB980 operating constraints. Static patient-readout reference never becomes measured data, no actual alarm, case to device signal, or ABGA/SpO2 calculation was added.
- No patient/learner identifying data storage, login, analytics or network API.
- Actual clinical faculty signoff, manufacturer exact firmware match, student usability trial and physical phone testing are **not performed**. Browser emulation and automated correctness tests do not replace these.



## v0.5.2.1 acceptance targets
- Case bank 4 fictional scenarios/12 questions; four pending clinical-review warnings, original adult CASE content and answer IDs unchanged.
- New individual MAS/RSV browser launch, answer, list return and resume; preserve existing 7 static readouts, 7 settings, 3 waveforms and CORE 10 answers.
- Code QA and CI are NOT clinical review, physical PB980, infant physiology or actual student usability validation.


### v0.5.2.1 final UI regression
- Device presentation toggled while clinical CASE is active reveals the original reference equipment; reverting learning presentation closes it without changing CASE session.


## v0.5.2.2 test plan and boundaries
- Static data: 2 pediatric clinical chart examples with four total panels; check sample type, lab units, time context, source trace, non-patient-model policy, pH/CO₂/HCO₃⁻ coherence, no capillary PO₂ surrogate.
- Chromium checks MAS stage-gated X-ray→ABGA, RSV assessment→CBG, answer-gated interpretations, disclosure on rerender, original adult case answers, original CORE, fixed seven adult references and waveforms.
- Browser automation and static calculations do NOT certify clinical appropriateness or real pediatric physiology. No data storage or identity tracking.


## v0.5.2.3 acceptance and regression
- Node: optional action fields and source trace, valid choice, linked CORE review concepts and unchanged 3-question scoring per CASE.
- Chromium: both pediatric action exercises, answer/recommended feedback, case→blood-gas learning→CASE round-trip, stage/answer preservation, 7 readouts, original adult CASE, CORE 10, waveform/settings/edit/circuit/alarm and accessible mobile tests.
- Clinical content remains pending expert review, not equivalent to protocol-level validation. No identities, patient data or remote score persistence.


### Additional release artifact gate (v0.5.2.3)
- CI packaging copies both new JS dependencies and imports the staged `dist/src/preclinical-cases.js`, asserting both pediatric clinical-data/action objects are present.
- The previous v0.5.2.2 ZIP packaging job lacked new module files; its passing CI did not establish offline artifact completeness. Final v0.5.2.3 artifact must replace it.
