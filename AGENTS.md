## Development B+ / CI operating policy (approved 2026-10-15)

Before planning a release-size change, read [docs/AI_ASSISTED_DEVELOPMENT_BPLUS_v1.0.md](docs/AI_ASSISTED_DEVELOPMENT_BPLUS_v1.0.md). Prefer one coherent version-level design and PR over repeated user-facing micro-releases; keep small reversible internal commits and repeated targeted verification. Use FAST + risk-selected FOCUSED PR validation and FULL on high-impact changes/release; retain all project-specific safety, simulation, persistence, clinical and historical regression contracts. No user-visible feature or CI PASS is implied by policy-only changes. This section is subordinate to previously user-approved project-specific technical protections.

## 공통 교육용 UI/UX 설계 지침 (2026-10-15, 앞으로의 설계에 적용)

**새 학습자 대상 UI/UX 기획 및 변경 전에 [Educational UI Design Standard v1.1](docs/EDUCATIONAL_UI_DESIGN_STANDARD_v1.1.md)을 읽는다.** Boyacto 별도 학습실의 A 시작/B 탐색/C 조작 흐름을 새로운 학습 화면의 기본 참조로 삼되, **기존 PB980 참고 장비 화면 원형**에는 본 AGENTS의 장비 충실도/엔진 분리 규칙을 적용한다. 기존 `index.html`과 `learn.html`은 비교를 위해 보존하며 사용자의 별도 승인 없이는 강제 병합·대체하지 않는다. 이번 등록은 문서만 변경하며 즉시 UI 구현을 지시하지 않는다.

# Ventilator Simulator Agents

프로젝트의 역할별 작업 규칙.

## 01 UI Agent
책임:
- 실제 ventilator 화면 레이아웃 분석
- 화면 요소 위치/크기/타이포그래피 재현
- parameter controls
- tab/panel interaction

원칙:
- 실제 장비 화면을 참고하되 학습용 조작 요소는 작은 overlay로 통합
- 화면을 불필요하게 현대적인 dashboard 형태로 바꾸지 않는다.

## 02 Waveform Agent
책임:
- Pressure/Flow/Volume waveform 생성
- Mode와 setting에 따른 waveform 변화
- mandatory/spontaneous breath 구분

원칙:
- 그림처럼 고정된 파형이 아니라 simulation state에서 계산되도록 설계
- 시각적 정확도와 교육적 해석 가능성을 함께 고려

## 03 Physiology Agent
책임:
- lung mechanics
- compliance
- airway resistance
- respiratory drive
- gas exchange
- 설정값과 환자 반응 연결

원칙:
- 모델의 가정과 단순화를 문서화
- 임상적으로 중요한 관계를 우선 구현

## 04 Circuit Agent
책임:
- inspiratory/expiratory limb
- humidifier/HME
- filters
- Y-piece
- water trap
- ETT 연결
- assembly animation
- gas-flow direction

원칙:
- 구성품을 개별적으로 학습할 수 있게 한다.
- 완성 회로에서는 흡기/호기 흐름 방향이 명확해야 한다.

## 05 Clinical Education Agent
책임:
- parameter `?` 설명
- mode 설명
- waveform interpretation
- ABGA interpretation
- case/question design

원칙:
- 정의 → 임상적 의미 → 높거나 낮을 때의 변화 순서
- 교육용 단순화와 실제 임상 적용을 구분

## 06 Validation Agent
책임:
- 수치 관계 검증
- mode별 설정 가능 범위 검증
- waveform과 monitoring 값의 일관성 검증
- alarm logic 검증

원칙:
- 근거 없는 숫자를 사실처럼 고정하지 않는다.
- 장비별 차이는 별도 profile로 관리

## 07 Architecture Agent
책임:
- simulation state
- UI state
- component boundaries
- data schema
- versioning

원칙:
- UI 코드에 생리학 계산을 직접 섞지 않는다.
- 장비 profile과 physiology model을 분리한다.
