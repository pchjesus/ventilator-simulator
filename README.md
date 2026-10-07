# Ventilator Simulator

교육용 Ventilator Simulator 프로젝트 초기 구조.

## 핵심 방향
- 실제 ventilator 화면을 메인 UI로 재현
- 각 설정값 옆에 작은 증감 버튼(+10/+1/+0.1/-0.1/-1/-10)과 `?` 설명 버튼 제공
- 설정 변경 → monitoring parameter → waveform → 환자 생리 → ABGA → alarm으로 확장
- 우측 `CIRCUIT` 패널에서 호흡회로 구성품, 조립 과정, 완성 회로를 시각화/애니메이션
- 실제 장비의 화면 구조를 참고하되 교육용 시뮬레이션 모델과 명확히 분리

## 현재 기준 화면
- Mode: SIMV (PC) + PS
- Monitoring: Ppeak, Pmean, PEEP, I:E, fTOT, VTE, VE
- Waveform: Pressure / Flow
- Controls: Pi, PS, Frequency, FiO2, PEEP, V-TRIG, Ti
- Circuit: 추후 우측 탭으로 통합

## 개발 원칙
1. UI와 생리학 모델을 분리한다.
2. 실제 장비의 표시/조작 감각은 최대한 유지한다.
3. 임상적으로 단순화한 모델은 문서화한다.
4. 수치 관계가 맞지 않는 경우 임의로 보정하지 않고 모델의 가정을 확인한다.
5. 교육용 시뮬레이터이므로 실제 환자 처치 지침과 구분한다.
