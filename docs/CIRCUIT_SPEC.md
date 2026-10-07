# Circuit Module Specification

## Components
1. Ventilator outlet
2. Inspiratory limb
3. Humidifier 또는 HME/F 구조
4. Inspiratory filter
5. Y-piece
6. Expiratory limb
7. Expiratory filter
8. Water trap
9. ETT / patient connection

실제 장비/기관에서 사용하는 구성은 기종과 세팅에 따라 다를 수 있으므로 최종 구성은 reference 장비 자료를 기준으로 확정한다.

## Views
### Components
개별 부품을 선택하면 이름, 기능, 연결 위치, 주의점을 설명.

### Assembly
단계별로 부품이 연결되는 animation.

### Completed
전체 circuit을 한눈에 보여주고 gas-flow direction을 animation.

## Future interaction
- 잘못된 연결을 선택하면 오류 표시
- leak/disconnection/kink 상황을 simulation state와 연동
- circuit problem → waveform/pressure/flow/alarm 변화
