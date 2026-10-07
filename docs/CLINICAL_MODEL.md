# Clinical Model Notes

초기 모델은 교육 목적의 단순화 모델로 시작한다.

## Core relationships to model
- FiO2 ↔ oxygenation
- PEEP ↔ end-expiratory pressure / oxygenation
- RR ↔ minute ventilation / CO2
- VT ↔ minute ventilation / CO2
- Pi + PEEP ↔ pressure-controlled airway pressure representation
- PS ↔ spontaneous breath support
- compliance ↔ VT response to pressure
- resistance ↔ flow/pressure behavior

## Important
실제 ventilator의 계산식은 제조사, mode, 설정 및 측정 위치에 따라 달라질 수 있다.
따라서 simulator 내부의 교육용 모델은 실제 장비의 측정값을 그대로 복제한다고 주장하지 않는다.
