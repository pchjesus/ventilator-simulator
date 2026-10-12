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
