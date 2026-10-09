# Ventilator Simulator — v0.3.2 Preview

간호학생을 위한 **PB980(Puritan Bennett 980) 참고형 웹 시뮬레이터** 초기 실행본.
실제 장비의 화면 구성 학습을 목표로 하지만, 임상 사용이나 기계 조작 훈련을 대체하지 않는다.

## 실행
- 파일 전체를 웹 서버에 올려서 `index.html`을 연다.
- 로컬: Python 3 설치 시 `python -m http.server 8077` 후 http://localhost:8077 방문
- 테스트: Node.js 18 이상에서 `npm test`, `npm run check`
- npm 의존성 없음. 브라우저 ES modules 사용. `file://` 직접 실행은 권장하지 않음.

## 현재 구현 (v0.3.1)
- PB980 스타일의 화면 구획: 상단 monitoring, 중앙 pressure/flow/volume 파형, 하단 SIMV(PC)+PS 설정 영역
- 화면 안에서 FiO₂, PEEP, f, Pi, Ti, PS, V-TRIG 값 증감 및 기본값 초기화
- 각 설정 옆 `?` 도움말, 오른쪽 CIRCUIT 개념 학습 탭(부품/조립 개요/완성 개념도)
- 화면이 작은 기기에서 우측 패널이 아래로 이동하는 반응형 레이아웃

## 구현하지 않은 것 (중요)
- monitoring 7종은 **사진을 참고한 고정 예시값**이고, waveform은 **독립된 교육용 시간 모델**로 움직인다. 파형은 환자 측정값이 아니며 실제 생리 반응을 예측하지 않는다.
- 설정 범위/증감 단위는 **UI 검증용 예시**이며 PB980 공식 장비 사양으로 검증된 값이 아니다.
- 완성 회로는 **개념도**이며 PB980의 실제 연결 절차나 부품 구성도 아니다.
- 임상 정확도, 실제 장비의 경보 동작, 모바일 실기기·시각적 일치 검증은 미완료.

## 설계·버전 문서
- [PROJECT_SPEC.md](PROJECT_SPEC.md)
- [AGENTS.md](AGENTS.md)
- [docs/ROADMAP.md](docs/ROADMAP.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [DEVLOG.md](DEVLOG.md)
- [TEST_REPORT.md](TEST_REPORT.md)

## GitHub Pages (optional, currently deferred)
정적 파일이므로 별도 API/DB 없이 GitHub Pages로 배포할 수 있다.
현재 저장소가 **private**이므로 공개 전환 또는 유료 플랜/비공개 Pages 지원 여부 확인은 사용자 결정 사항이다.
저장소를 임의로 public으로 전환하지 않는다. Pages를 활성화하더라도 배포 URL과 접속 권한을 별도 확인해야 한다.

## Optional future public website preparation
GitHub Actions now checks Chromium desktop/mobile behavior and uploads screenshots. After all checks pass, a separate `pb980-web-only` artifact contains only the browser-runnable site files. No lecture image or project working notes are shipped in that bundle.
See [Deployment guide](docs/DEPLOYMENT.md) for the public-repo setup and acceptance steps. The current private repository is **not** itself a verified publicly deployed URL.

## Private GitHub review — current workflow
No public website is being published. Browse the **Code** tab and use **Actions → Ventilator simulator checks** to run tests manually and download desktop/mobile screenshot artifacts.
Read [Private GitHub review](docs/PRIVATE_GITHUB_WORKFLOW.md) for step-by-step instructions and local execution.
See [PB980 reference audit](docs/PB980_REFERENCE_AUDIT.md) for what is and is not manufacturer-verified.
v0.2.2 improves keyboard-focus continuity when adjusting settings and adds a 320px narrow-screen regression check.

## v0.3.0 — 움직이는 교육용 파형
- Pressure/Flow/Volume vs Time 파형을 자동으로 이동시키며 일시정지·재생할 수 있다.
- 강제 흡기/예시 자발 흡기/호기 구간의 색상을 구분한다.
- PEEP, Pi, PS, f, Ti를 바꾸면 파형을 다시 계산한다. FiO2와 V-TRIG는 숫자만 바뀌고 파형에는 연결되지 않는다.
- 파형의 용적·유량은 서로 도함수 관계를 갖도록 구성했지만 가상 순응도와 자발호흡 이벤트는 **설명용으로 임의 설정**한 것이다.
- PB980의 실제 파형 동작·임상 적용을 재현한다는 의미는 아니다.
- [파형 모델 가정](docs/WAVEFORM_MODEL_v0.3.md) 문서를 참고해.

## v0.3.1 — 파형 무결성·접근성 보완
- 호기말 Volume과 Flow가 함께 0으로 수렴하도록 교육용 파형 계산을 수정하고 유량-용적 미분 관계를 단위 테스트로 확인한다.
- 기기 접근성 설정의 **동작 줄이기 (prefers-reduced-motion)** 가 켜져 있으면 파형을 멈춘 채 시작한다. 학생이 Resume으로 재생을 직접 선택할 수 있다.
- Pause 중 화면 재그리기를 줄여 불필요한 연산을 피하며, 설정값을 바꾸면 해당 파형은 여전히 갱신된다.
- 외부 호출에서 비정상 호흡수/흡기시간 등 입력을 전달해도 과도한 반복이나 유효하지 않은 파형 생성을 피하도록 기본 검증을 추가한다.
- 위 변경은 **교육용 모델의 수학적 일관성 개선**일 뿐 환자 생리모델을 임상적으로 검증했다는 의미는 아니다.


## v0.3.2 — PB980 GUI 외형 정밀화
- 공식 매뉴얼의 GUI 영역 구분과 PB980 실물 사진을 참고하여 상단 청색 Vital Patient Data banner, 중앙 검은 waveform area, 좌측 MENU, 하단 청색 settings area, 우하단 고정 메뉴 아이콘을 재배치했어.
- 짙은 청색 베젤, 중앙 회전 조작부와 물리 키를 외형 참고용으로 추가했어(기계 조작 기능은 없음).
- Home/Circuit 및 Help 교육용 단축키 2개를 기존 학습 패널과 연동했어.
- 기존 증감, 도움말, 초기화, 파형, reduced-motion, 반응형 배치를 유지했어.
- [PB980 UI 비교·남은 차이](docs/PB980_UI_COMPARISON_v0.3.2.md) 참조. 실물과 완전 동일한 외형이나 임상 동작이라고 주장하지 않아.
