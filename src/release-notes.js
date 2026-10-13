// Release notes are curated from this repository's DEVLOG / TEST_REPORT history.
// Categories denote a user-facing change, not a claim of validated clinical fidelity.
export const RELEASE_CATEGORIES=Object.freeze([
  {id:"ui",label:"UI/UX"},
  {id:"feature",label:"기능 추가"},
  {id:"clinical",label:"간호·의학 교육"},
  {id:"stability",label:"안정성·테스트"},
  {id:"docs",label:"문서·근거"}
]);
export const RELEASE_NOTES=Object.freeze([
 {version:"0.5.0",date:"2026-10-13",changes:[
 {category:"ui",text:"용어 학습에서 개념·퀴즈·CASE·복습까지 이어지는 학생 학습 진입 흐름 통합"},
 {category:"feature",text:"모바일에서 장비 펼치기·접기와 CASE 이전 답 읽기 전용 기능 통합"},
 {category:"clinical",text:"고정 모니터·생성 파형·설정값·가상 CASE 수치의 구분과 감수 미완료를 지속 명시"},
 {category:"stability",text:"기존 설정 편집·고정 모니터·독립 학습 세션의 회귀 검증 유지"},
 {category:"docs",text:"수업 자료와 교육·사용성 파일럿 준비 문서 제공, 실제 사용성 검증은 미실시"}]},
 {version:"0.4.9",date:"2026-10-13",changes:[
 {category:"feature",text:"CASE 진행 중 이전 완료 문항의 선택과 해설을 읽기 전용으로 복습"},
 {category:"ui",text:"현재 학습목표를 강조하고 중복된 전체 목표는 요청 시만 펼치기"},
 {category:"clinical",text:"CASE 종료 시 목표별 복습과 피드백 이유를 함께 표시"},
 {category:"stability",text:"기존 CASE 정답·문항 순서·세션 재개·중복 제출 제한 유지"},
 {category:"docs",text:"형성평가 결과에 앱 작동 이해와 간호 기초 개념을 분리"}]},
 {version:"0.4.8",date:"2026-10-13",changes:[
 {category:"ui",text:"좁은 화면에서 핵심 학습 우선·장비 펼치기 및 학습 돌아가기"},
 {category:"feature",text:"핵심 6개 개념의 정의·원리·간호 관찰·오개념·예시·심화 설명"},
 {category:"clinical",text:"PBW·Pplat·auto-PEEP·ABGA·V-TRIG 입문용 용어 설명"},
 {category:"stability",text:"단일 장비와 학습 패널 DOM 재배치로 기존 상태 복제 없이 유지"},
 {category:"docs",text:"모바일 학습과 장비 탐색의 사용 경로·자료 성격을 분리 안내"}]},
 {version:"0.4.7",date:"2026-10-13",changes:[
  {category:"ui",text:"7개 고정 모니터 카드의 I:E 긴 숫자 읽기 오류를 보정"},
  {category:"stability",text:"1440px 장비 컬럼의 모니터 표시 회귀 검사를 추가"},
  {category:"feature",text:"기존 설정 팝업의 개별 기본값과 전체 초기화 기능은 그대로 유지"},
  {category:"clinical",text:"고정 모니터 예시를 실제 환자 측정값으로 해석하지 않는 범위 유지"},
  {category:"docs",text:"설명서의 잘못된 전체 초기화 문구와 직접입력/홀드 안내 수정"}]},
 {version:"0.4.6",date:"2026-10-13",changes:[
  {category:"feature",text:"CASE 01·02의 단계별 목표·진행 경로 표시와 개별 이어 하기/다시 시작"},
  {category:"ui",text:"실습 전 목표·현재 단계 및 사전 상황 자료를 CASE 진행 중 언제든 열람"},
  {category:"stability",text:"사례별 메모리 상태를 분리하고 목록·학습 탭 전환에도 답안과 복습 메모 유지"},
  {category:"clinical",text:"기존 사례·정답·근거 유지, 별도 임상전문가 검토 미완료 명시"},
  {category:"docs",text:"기본 기능 회귀 및 0.4.4·0.4.5·0.4.6 연속 개발 이력"}]},
 {version:"0.4.5",date:"2026-10-13",changes:[
  {category:"feature",text:"설정 팝업에서 숫자 직접 입력과 ± 버튼 길게 누르기, TURN 장식 제거"},
  {category:"ui",text:"이 항목 기본값을 Pending에만 반영하고 Accept 후 해당 설정만 확정"},
  {category:"stability",text:"미확정 설정과 기존 파형을 분리하고 입력 범위·소수 정밀도 엄격 검증"},
  {category:"stability",text:"포인터 해제·취소·창 이탈·포커스 상실 시 자동 증감 중단"},
  {category:"docs",text:"기존 PB980 참고값과 교육용 설정 범위의 차이를 유지"}]},

 {version:"0.4.4",date:"2026-10-13",changes:[
  {category:"ui",text:"학습 집중·나란히·장비 집중 3개 배치, 기본 학습·장비 탐색 2개 보기 전환"},
  {category:"stability",text:"레이아웃과 UI 표시 상태는 설정·파형·CASE·형성 퀴즈 상태와 분리"},
  {category:"ui",text:"모바일 학습/장비 바로가기와 반응형 설정 카드, 학습 UI의 읽기 쉬운 본문 및 장식 비노출"},
  {category:"feature",text:"설정 편집기·퀴즈·CASE 상태를 변경하지 않는 학습/장비 화면 전환"},
  {category:"docs",text:"v0.4.4~v0.4.6 UI 위험 및 회귀 검증 기준"}]},

 {version:"0.4.3",date:"2026-10-12",changes:[
  {category:"clinical",text:"핵심 문제은행 10문항별 근거 적용 범위·임상 검토 질문을 명시하고 학생 형성학습과 교수자 승인 영역을 분리"},
  {category:"feature",text:"비공개 저장소 링크 대신 앱 자체 동작 근거 표시를 제공하여 정적 웹 실행본에서도 설명 유지"},
  {category:"ui",text:"오개념 카드 복습 후 현재 문제풀이로 쉽게 돌아가는 버튼과 교수자 미리보기의 근거 해석 표시 추가"},
  {category:"stability",text:"문항별 검토 추적/출처 유형 무결성 검사 강화 및 1440px·360px·320px 회귀 테스트"},
  {category:"docs",text:"임상 교수자 검토용 문항별 확인 매트릭스·실습 전 사용성 파일럿 계획과 검증 한계 기록"}]},
 {version:"0.4.2",date:"2026-10-12",changes:[
  {category:"feature",text:"6개 핵심 개념에 연결된 10문항 학습 확인, 선택지 전체 해설·근거, 오개념 복습과 CASE 이동"},
  {category:"clinical",text:"PEEP·FiO₂/SpO₂/PaO₂·VTE·f/fTOT·Ppeak/Pᵢ·환자 우선 사정의 입문 형성평가; 전문가 미감수"},
  {category:"ui",text:"기존 핵심 개념 패널에 단계형 문제풀이를 추가하고 모바일 320/360px 접근성·상태 유지를 고려"},
  {category:"stability",text:"형성학습을 페이지 메모리에만 보관하고 CASE·설정 초기화·고정 모니터·파형 상태와 분리"},
  {category:"docs",text:"문항별 학습목표·오개념·원문 근거와 교수자 검토 미리보기·구조 검사 추가"}]},
 {version:"0.4.1",date:"2026-10-12",changes:[
  {category:"ui",text:"실습 전 핵심 개념 탭을 기본 화면으로 지정, 핵심 설정 강조, 회로·PB980 알람과 전문 설정 설명을 추가 학습으로 분리"},
  {category:"feature",text:"PEEP·FiO₂·VTE·설정/총 호흡수·Ppeak·환자 사정을 설명하는 여섯 개 읽기 쉬운 교육 카드와 원문 근거 연결"},
  {category:"clinical",text:"학생에게 중요한 환자 관찰·설정/측정값 구분 강조; 장비 소프트웨어·알람 세부 차이는 추가 학습으로 배치"},
  {category:"stability",text:"기존 7개 설정 조작·파형·CASE·회로·알람 보존, 기본 패널/접기·펼치기·모바일 회귀 테스트"},
  {category:"docs",text:"제조사 공식 버전별 매뉴얼 7.6.1/8.0.9/8.1.0/8.2.0 계열과 8.4.4.3 이상 High PEEP 옵션 관련 차이 조사, 현장 설치 버전 미확인 명시"}]},
 {version:"0.4.0",date:"2026-10-12",changes:[
  {category:"ui",text:"네 번째 ALARM 학습 탭과 반응형 알람 카드·설정값/측정값 구분 용어 화면 추가"},
  {category:"feature",text:"PB980 제조사 문서에 등장하는 경보 명칭 4종의 교육용 선택·즉시 해설·다시 풀기 기능"},
  {category:"clinical",text:"회로 이탈·높은 기도압·낮은 호기 분당환기량·무호흡 알람의 원문 의미, 학생 관찰·보고 원칙, AARC 근거 설명"},
  {category:"stability",text:"환자·회로·파형에 경보를 실제 발생시키지 않는 독립 상태, 설정값 7/고정 모니터 7 커버리지 검사와 회귀검증"},
  {category:"docs",text:"PB980 Operator Manual 6장 Table 6-5와 AARC 2024를 구분한 알람 교육 계약 및 미구현 범위 명시"}]},
 {version:"0.3.9",date:"2026-10-12",changes:[
  {category:"ui",text:"CASE 목록에 정답 공개 경고가 있는 교수자 검토 미리보기, 문항별 근거 접기·펼치기, 구조화 복습 입력창 제공"},
  {category:"feature",text:"학습목표·근거 ID 자동 연결 검사와 오류 시 CASE 학습 중단, 문항 선택 후 근거 추적 및 결과별 오답 복습 추가"},
  {category:"clinical",text:"입문 2개 사례의 6개 문항에 출처 성격·근거 해석 메모를 추가하고 임상 전문가 미감수 상태 유지"},
  {category:"stability",text:"답안·디브리핑 메모는 세션 메모리에만 유지, 기존 설정·파형과 분리하며 자동 회귀검증 확대"},
  {category:"docs",text:"2025년 INACSL 표준 개정 정보 반영, 교수자 검토 규칙과 임상 내용 승인 이전의 제한 문서화"}]},
 {version:"0.3.8",date:"2026-10-12",changes:[
  {category:"ui",text:"세 번째 CASE 학습 탭과 가상 상황·문항·근거를 실제 장비 화면과 명확히 분리한 학습 카드 UI 추가"},
  {category:"clinical",text:"실습 전 입문 형성학습 2종: 기계환기 환자 인수인계 및 산소포화도 변화 인지(가상 상황, 전문가 미감수)"},
  {category:"feature",text:"CASE 학습 탭에 사례 선택·사전 안내·단계별 판단·선택 이유·근거·디브리핑·재시도 기능 추가"},
  {category:"stability",text:"사례학습 상태를 실제 기기 설정과 파형·고정 모니터에서 분리하고 전환/초기화 회귀검증"},
  {category:"docs",text:"학생 임상실습 전 교육 수준 달성을 위한 임상 감수·시나리오·평가 체계 로드맵과 승인 기준 설계"}]},
 {version:"0.3.7",date:"2026-10-12",changes:[
  {category:"ui",text:"PB980 내부 정보 구조를 유지하며 외형 장식을 절제한 중립 색상·고대비 환자 데이터 및 설정 UI로 가독성 개선"},
  {category:"feature",text:"파형 분석 모드에서 정지된 교육용 Pressure/Flow/Volume 곡선의 시점·수치·호흡 단계 확인; 슬라이더/터치/키보드 지원"},
  {category:"feature",text:"파형 격자 켜기/끄기와 Pause/Resume 간 상태 전환 보강"},
  {category:"stability",text:"이중 설정·회로·설명서·고정 모니터 및 기존 파형의 회귀검증"},
  {category:"docs",text:"PB980 매뉴얼의 pause/cursor/grid 개념과 시뮬레이터의 차이 명시"}]},
 {version:"0.3.6",date:"2026-10-12",changes:[
  {category:"clinical",text:"FiO₂·PEEP·f·Pᵢ·Tᵢ·PS·V-TRIG를 포함한 13개 학습 주제에 기본 개념·간호 관찰·제한·출처 보강"},
  {category:"feature",text:"상단 설명서 팝업과 버전별 패치 내역 팝업, 패치 카테고리 필터 추가"},
  {category:"ui",text:"X·바깥 터치·Esc로 닫히는 반응형 대화상자 및 오른쪽 학습 주제 탐색"},
  {category:"stability",text:"두 기존 조작 방식과 회로·파형 유지, 모달·필터·모바일 회귀검증 추가"},
  {category:"docs",text:"제조사 매뉴얼·AARC 환기 사정 지침·Merck Manual 근거 연결"}]},
 {version:"0.3.5",date:"2026-10-10",changes:[
  {category:"feature",text:"PB980 참고형 선택→조절→Accept와 선택형 빠른 학습 ± 조작 방식 구현"},
  {category:"ui",text:"미확정값/확정값을 분리한 조작 대화상자와 모바일 하단 시트"},
  {category:"stability",text:"미확정값이 파형에 반영되지 않도록 분리하고 Cancel/Escape·키보드·모바일 검증"}]},
 {version:"0.3.4",date:"2026-10-10",changes:[
  {category:"ui",text:"상단 C 호흡 예시 표시 위치와 9번째 장식용 Audio Pause 조작부 수정"},
  {category:"docs",text:"공개된 PB980 제조사 자료·교육용 사진 기준 근거 감사 및 조작 UI 대안 정리"}]},
 {version:"0.3.3",date:"2026-10-10",changes:[
  {category:"ui",text:"환자 데이터·파형·프롬프트·하단 설정 영역 배치 정리 및 화면 축 표시 개선"},
  {category:"clinical",text:"성인 PB980 매뉴얼 설정 범위·해상도 참고를 각 ? 도움말에 추가(교육용 조작 범위와 분리)"},
  {category:"stability",text:"320px에서 발생했던 4열 설정 배치 회귀를 2열로 수정하고 검증"}]},
 {version:"0.3.2",date:"2026-10-09",changes:[
  {category:"ui",text:"공개 PB980 장비 화면을 참고한 파란 외형·상단 데이터·검은 파형·물리 버튼 시각화"},
  {category:"feature",text:"교육용 Home/CIRCUIT, Help 바로가기 추가"}]},
 {version:"0.3.1",date:"2026-10-09",changes:[
  {category:"stability",text:"호기 파형 수학적 연결과 입력 검증 개선, reduced-motion 환경 대응"}]},
 {version:"0.3.0",date:"2026-10-09",changes:[
  {category:"feature",text:"Pressure·Flow·Volume 시간 파형, 강제·예시 자발호흡 구분, Pause/Resume 구현"},
  {category:"docs",text:"파형이 임상적으로 검증된 생리 모델이 아니라는 한계 문서화"}]},
 {version:"0.2.x",date:"2026-10-09",changes:[
  {category:"feature",text:"교육용 설정 증감·? 설명·CIRCUIT 구성도와 초기 브라우저 시뮬레이터 제작"},
  {category:"stability",text:"Node 테스트·Chromium 데스크톱/모바일 자동 검사·키보드 포커스 개선"},
  {category:"docs",text:"프로젝트 명세·개발 노트·Private GitHub 실행 및 검증 절차 수립"}]}
]);
export function notesForCategory(category="all"){
  if(category==="all")return RELEASE_NOTES;
  if(!RELEASE_CATEGORIES.some(x=>x.id===category))return [];
  return RELEASE_NOTES.map(note=>({...note,changes:note.changes.filter(change=>change.category===category)}))
    .filter(note=>note.changes.length>0);
}
