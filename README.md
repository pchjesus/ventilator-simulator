# Ventilator Simulator — v0.2.0 Preview

간호학생을 위한 **PB980(Puritan Bennett 980) 참고형 웹 시뮬레이터** 초기 실행본.
실제 장비의 화면 구성 학습을 목표로 하지만, 임상 사용이나 기계 조작 훈련을 대체하지 않는다.

## 실행
- 파일 전체를 웹 서버에 올려서 `index.html`을 연다.
- 로컬: Python 3 설치 시 `python -m http.server 8077` 후 http://localhost:8077 방문
- 테스트: Node.js 18 이상에서 `npm test`, `npm run check`
- npm 의존성 없음. 브라우저 ES modules 사용. `file://` 직접 실행은 권장하지 않음.

## 현재 구현 (v0.2.0)
- PB980 스타일의 화면 구획: 상단 monitoring, 중앙 pressure/flow 파형, 하단 SIMV(PC)+PS 설정 영역
- 화면 안에서 FiO₂, PEEP, f, Pi, Ti, PS, V-TRIG 값 증감 및 기본값 초기화
- 각 설정 옆 `?` 도움말, 오른쪽 CIRCUIT 개념 학습 탭(부품/조립 개요/완성 개념도)
- 화면이 작은 기기에서 우측 패널이 아래로 이동하는 반응형 레이아웃

## 구현하지 않은 것 (중요)
- monitoring 7종은 **사진을 참고한 고정 예시값**, waveforms 역시 **고정 데모 파형**이다. 조작한 설정값을 실제 환자 반응이나 측정값으로 계산하지 않는다.
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

## GitHub Pages 공개 결정
정적 파일이므로 별도 API/DB 없이 GitHub Pages로 배포할 수 있다.
현재 저장소가 **private**이므로 공개 전환 또는 유료 플랜/비공개 Pages 지원 여부 확인은 사용자 결정 사항이다.
저장소를 임의로 public으로 전환하지 않는다. Pages를 활성화하더라도 배포 URL과 접속 권한을 별도 확인해야 한다.
