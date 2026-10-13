# Ventilator Simulator — v0.5.1 구현 시작 / v0.6.0 연속 개발 인수인계

이 채팅에서는 GitHub Private 저장소 **`pchjesus/ventilator-simulator`**의 개발을 이어간다. **기존 프로젝트를 재생성·초기화하지 말고 실제 GitHub 최신 `main`에서 시작하라.** 단순히 계획을 다시 작성하지 말고, 가능한 GitHub·코드 변경·테스트·커밋·PR·병합을 직접 수행하라.

## 기준과 요구사항
- 저장소: https://github.com/pchjesus/ventilator-simulator (Private 유지), 기본 브랜치 `main`. 현재 실행 안정 버전은 **v0.5.0 FINAL**이며, v0.6.0은 **설계만 확정**됐다. 시작 전 **현재 main SHA 및 CI를 반드시 다시 확인**하라.
- 승인된 설계: `docs/V0.6.0_APPROVED_UX_IMPLEMENTATION_SPEC.md` — **D1=A** PB980 원형 유지+읽기 확대, **D2=A** 요약+상세/심화, **D3=A** 동일 축 기준 점선/실험 실선 파형 비교, **D4=A** CORE 내부 선택형 LAB, **D5=A** LAB마다 예상/결과 확인 문항. 이 선택은 다시 묻지 마라.
- **실행 인수인계(필독): `docs/V0.5.1_TO_V0.6.0_IMPLEMENTATION_PLAYBOOK.md`**. `AGENTS.md`, `PROJECT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `README.md`, `DEVLOG.md`, `TEST_REPORT.md`, `docs/V0.5.0_USABILITY_PILOT_PROTOCOL.md`, 관련 `src/`, `tests/`, `.github/workflows/ci.yml`을 확인하라. 프로젝트의 AI-Assisted Software Development Skill v1.4 및 '구현 및 위험 검토' 지침을 준수한다.

## 이번 채팅의 첫 개발 목표: **v0.5.1 가독성·접근성 개선을 실제 구현하고 검증**
1. 기존 코드/동작과 현재 CI 상태 확인 → 변경 영향·회귀·focus·모달·DOM 재배치·CSS 미디어쿼리 위험 분석 → 필요한 최소 패치 설계. 승인된 D1-A를 다시 질문하지 말 것.
2. `feat/v0.5.1-readability` 같은 **별도 작업 브랜치**에서 작은 패치로 구현한다.
   - **P1:** 기존 7 모니터·7 설정·3 파형/화면 2보기×3배치/설정 모달/CORE·CASE의 baseline 브라우저 회귀와 스크린샷 확보.
   - **P2:** 원래 PB980 참고형 화면 구조·7개 고정 모니터를 그대로 유지하면서 **'큰 글씨로 보기'** 읽기 전용 접근 UI 구현. 모니터 7개 값·순서·단위·한국어 의미·독립 고정 예시 경고 표시. 7열 카드마다 버튼을 억지로 끼우지 말고 최소한의 공용 진입 경로를 우선 검토.
   - **P3:** 같은 읽기 확대에서 7개 현 설정의 확정값과 단위, Pressure/Flow/Volume 3개 곡선의 명칭·단위·'생성 예시/실측 아님' 안내 제공. 기존 설정 타일=편집, `?`=설명, Pending/Accept/Cancel 및 파형 조작은 그대로 보존.
   - **P4:** 320/360/700/960/1100/1280/1440 CSS px·모바일 장비 접기/펼치기·가로 넘침·모달 중 resize·Tab/Enter/Escape·포커스 복귀·200%/400% 확대·reduced-motion 확인, 발견한 문제만 원인 기반으로 수정.
   - **P5:** 새 기능과 영향을 받는 이전 기능 전체 회귀; 스크린샷 육안 검토 가능한 범위 기록; `src/sim-model.js`/`package.json`/`index.html` 등 버전 표시를 실제 **v0.5.1**로 맞추고 `README`/`DEVLOG`/`TEST_REPORT`/`docs/ROADMAP` 갱신.
3. **보호조건:** 기존 7 설정값, 개별 고정 모니터 7개, 3개 파형, 설정 조작/Pending/Cancel, 6개 핵심 개념·10문항의 정답, CASE 01/02 각각 3문항·기존 정답·RAM 재개·디브리핑, Help/CIRCUIT/ALARM, 2보기×3배치, 교수자 문서 분리, Private 유지. **실제 SpO₂/ABGA/VTE/알람 환자 반응을 새로 계산하지 마라.** 클릭/보기 전환으로 CORE/CASE state가 초기화되면 안 된다.
4. `npm run check`, `npm test`, **실제 Chromium 브라우저 테스트**, 스크린샷/반응형 및 이전 기능 영향 테스트를 실행하라. 자동 CI 통과와 물리 스마트폰·인간 육안·임상 전문가 검토는 별개로 기록하라. 신규 소스 모듈을 만들면 `package.json` 구문 검사와 `.github/workflows/ci.yml`의 **`dist/src` 정적 화이트리스트 복사**도 동시에 갱신하라.
5. 기능 브랜치 PR 생성 → **브랜치 CI 전 작업 통과** → 안전성/화면/기존 기능 확인 → Private `main` 병합 → **병합된 main SHA의 Actions test/browser/package 전부 PASS** 확인. 실패 시 본질 원인을 고치고 재시험하며, 모호한 문제를 패치로 쌓지 마라.
6. 최종 보고: 변경 UX, 실제 코드 파일, 주요 위험 및 해결, 신규/기존 테스트 결과, 버그 원인, 스크린샷/웹 ZIP, PR·main SHA·CI 링크, 임상/실사용 미검증, **다음 v0.5.2 전제**를 구분한다.

## 다음 버전(이번 목표 이후)
v0.5.2 D2-A 카드 핵심/심화 및 네 자료 구분 → v0.5.3 D3-A 독립 순수 파형 비교 및 D4-A CORE LAB → v0.5.4 D5-A PEEP/f/FiO₂ 3 LAB·신규 6문항 → v0.5.5 학생/교수자 자료·QA → v0.6.0 통합 검증/교육용 베타 출시. **각 버전은 앞 버전의 main CI가 확인된 다음 착수하고, 기존 답안/환자 모델 한계를 그대로 지켜라.** LAB은 현재 장비 설정을 기준으로 복사하는 방식이 아니라 `initialSettings()`의 교육용 고정 사본(PEEP 5→8, f 15→18, FiO₂ 40→60)을 사용한다.

**지금은 v0.5.1을 실제 구현하는 것부터 시작하라.** 한 버전이 끝나면 사실에 근거한 결과를 보고하고 다음 단계를 이어갈지 판단할 수 있도록 하라.