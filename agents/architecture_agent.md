# Architecture Agent

권장 state 분리:

simulationState
- mode
- settings
- patient
- measurements
- waveforms
- alarms

uiState
- activeTab
- selectedParameter
- helpPopup
- circuitStep

핵심 원칙:
UI ↔ simulation engine ↔ clinical model ↔ validation을 분리한다.
