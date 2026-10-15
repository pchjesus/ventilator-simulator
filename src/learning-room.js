import {PARAMETERS, MONITOR_REFERENCE, initialSettings, formatSetting} from './sim-model.js';
import {generateWaveform, previewScales} from './waveform-model.js';
import {DISPLAY_TERMS} from './device-learning.js';
import {PRACTICE_LESSONS, createPracticeSession, selectPracticeSetting, adjustPracticeValue, cancelPracticeEdit, applyPracticeEdit} from './learning-room-state.js';

const root = document.getElementById('learning-room');
const baseline = initialSettings();
const sessions = Object.fromEntries(PRACTICE_LESSONS.map(lesson => [lesson.id, createPracticeSession(lesson.id)]));
let screen = 'home';
let practiceScene = 'start';
let selectedLesson = 'cancel';
let region = null;
const selectedTerms = {monitor: 0, waves: 0, settings: 0};
const waveIcon = '<svg width="19" height="17" viewBox="0 0 24 20" fill="none" aria-hidden="true"><path d="M1 11h5l3-8 5 15 3-7h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrow = '<span aria-hidden="true">↗</span>';
const legacyLink = '<a class="legacy-link" href="./index.html">기존 시뮬레이터</a>';
function header() {
  return `<header class="product-head"><div class="brand"><span class="brand-icon">${waveIcon}</span><span>PB980 <small>인공호흡기 학습실</small></span></div><div class="head-links">실습 학생과 신규 간호사를 위한 장비 학습</div>${legacyLink}</header>`;
}
function footer() {
  return `<footer class="screen-footer"><span>교육용 시뮬레이터 · 실제 장비 조작과 다르며 환자 치료에 사용할 수 없습니다.</span>${legacyLink}</footer>`;
}
const currentLesson = () => PRACTICE_LESSONS.find(lesson => lesson.id === selectedLesson);
const currentSession = () => sessions[selectedLesson];
const lessonSettings = () => screen === 'practice-task' ? currentSession().settings : baseline;

// Reuse the existing educational model. The resting plot is a generated time
// window, not a new patient model or a hand-drawn approximation of its values.
function waveform(kind, samples, scales) {
  const key = ['pressure', 'flow', 'volume'][kind];
  const maximum = [scales.pressureMax, scales.flowMax, scales.volumeMax][kind];
  const minimum = kind === 1 ? -maximum : 0;
  const path = samples.map((sample, index) => {
    const x = index / (samples.length - 1) * 420;
    const y = 53 - (sample[key] - minimum) / (maximum - minimum) * 48;
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
  return `<svg viewBox="0 0 420 58" preserveAspectRatio="none" role="img" aria-label="${['압력', '유량', '용적'][kind]} 교육용 생성 파형, 정지 화면"><path d="M0 14H420M0 29H420M0 45H420M70 0V58M140 0V58M210 0V58M280 0V58M350 0V58" fill="none" stroke="#2a3a47" stroke-width=".6"/><path d="${path}" fill="none" stroke="${['#a4d98a', '#e6cb7c', '#8ecedb'][kind]}" stroke-width="1.65" stroke-linejoin="round"/></svg>`;
}
function spot(id, number, label) {
  return `<button type="button" class="region-select ${region === id ? 'selected' : ''}" data-region="${id}" aria-label="${label}" aria-pressed="${region === id}"><span class="hotspot">${number}</span></button>`;
}
function settingEditor(session) {
  if (!session.edit) return '';
  return `<div class="editor-overlay"><section class="setting-editor" role="dialog" aria-modal="false" aria-labelledby="editor-title">
    <h3 id="editor-title">PEEP 설정</h3><p>확정된 값 ${formatSetting('peep', session.settings.peep)} cmH₂O</p>
    <div class="editor-value" aria-live="polite">${formatSetting('peep', session.edit.pending)}<small> cmH₂O</small></div>
    <p>변경 중인 값 · 아직 적용되지 않았어요</p>
    <div class="editor-controls"><button type="button" data-action="minus" aria-label="연습값 1 줄이기">−</button><button type="button" data-action="plus" aria-label="연습값 1 높이기">+</button></div>
    <p class="edit-step-note">학습용 증감: 1 cmH₂O</p>
    ${session.id === 'apply' ? '<button class="editor-apply" data-action="apply-edit">변경 적용</button>' : ''}
    <button class="editor-cancel" data-action="cancel-edit">변경 취소</button>
    ${session.feedback ? `<p class="edit-feedback" role="status">${session.feedback}</p>` : ''}
  </section></div>`;
}
function device(mode = 'static', mini = false) {
  const explorer = mode === 'explore';
  const session = currentSession();
  const settings = lessonSettings();
  const samples = generateWaveform(settings, 0, 16, 240);
  const scales = previewScales(settings, samples);
  return `<div class="device ${mini ? 'mini' : ''}">
    <div class="device-brand"><b>Puritan Bennett 980</b><span class="device-light"></span><span>교육용 화면</span></div>
    <div class="device-screen" ${mode === 'mission' && session.edit ? 'inert' : ''}><div class="monitor-strip">
      ${MONITOR_REFERENCE.map(m => `<div class="monitor-cell"><span class="metric-name">${m[0]}</span><b>${m[1]}</b><span class="metric-unit">${m[2]}</span></div>`).join('')}
      ${explorer ? spot('monitor', 1, '상단 환자 데이터 살펴보기') : ''}
    </div><div class="mode-line"><span>ADULT · INVASIVE</span><b>SIMV (PC) + PS</b><span>모니터: 고정 예시</span></div>
    <div class="waves">${['Pressure', 'Flow', 'Volume'].map((name, i) => `<div class="wave-row"><div class="wave-label"><b>${name}</b>${['압력 · cmH₂O', '유량 · L/min', '용적 · mL'][i]}</div>${waveform(i, samples, scales)}</div>`).join('')}
      ${explorer ? spot('waves', 2, '파형 영역 살펴보기') : ''}
    </div><div class="device-settings"><div class="setting-title"><span>Current settings</span><span>SIMV / PC / PS</span></div>
      <div class="settings-row">${PARAMETERS.map(param => {
        const interactive = mode === 'mission' && !session.completed;
        const tag = interactive ? 'button' : 'div';
        return `<${tag} class="param ${session.completed && param.id === 'peep' ? 'target' : ''}" ${interactive ? `type="button" data-setting="${param.id}" aria-label="${param.label} 설정값 선택"` : ''}><span>${param.label}</span><b>${formatSetting(param.id, settings[param.id])}</b><small>${param.unit}</small></${tag}>`;
      }).join('')}</div>${explorer ? spot('settings', 3, '설정값 영역 살펴보기') : ''}
    </div></div><div class="bezel-bottom" aria-hidden="true"><i class="bezel-key"></i><i class="bezel-key"></i><i class="knob"></i><i class="bezel-key"></i><i class="bezel-key"></i></div>
    ${mode === 'mission' ? settingEditor(session) : ''}
  </div>`;
}

function aStart(){return `<div class="a-shell">${header()}<section class="a-hero"><div class="a-intro"><p class="intro-label"><span class="tiny-dot"></span>PB980가 처음이라면</p><h2>실습 전에,<br>장비부터 익혀요.</h2><p class="intro-copy">화면의 숫자가 무엇을 뜻하는지 알아보고,<br>인공호흡기의 기본 조작을 연습하세요.</p><button class="primary" data-action="learn">기초 학습 시작 ${arrow}</button><button class="text-button" data-action="explore">이미 익숙해요. 장비 둘러보기</button></div><figure class="a-device-figure">${device('static',true)}<figcaption class="figure-caption">이번에 익힐 장치 · Puritan Bennett 980</figcaption></figure></section><section class="a-route"><div><h3>한 번에 한 가지씩</h3><p>처음부터 차근차근 익힙니다.</p></div><div class="lesson-flow"><div class="lesson-step"><b>1</b><span>화면 알아보기<small>각 영역의 역할</small></span></div><div class="lesson-step"><b>2</b><span>표시값 읽기<small>설정값과 측정값</small></span></div><div class="lesson-step"><b>3</b><span>기본 조작하기<small>선택, 변경, 취소</small></span></div></div></section>${footer()}</div>`}

const regions = {
  monitor: {title: '상단 환자 데이터', term: '1 · 화면 위쪽', copy: '장비가 측정한 값을 읽는 자리입니다. 아래쪽 설정값과 구분해서 살펴보세요.', note: '이 화면의 모니터 숫자는 서로 독립적인 고정 예시이며, 설정이나 생성 파형과 연동되지 않습니다.'},
  waves: {title: '호흡 파형', term: '2 · 화면 가운데', copy: '압력, 유량, 용적이 시간에 따라 어떻게 표시되는지 살펴보는 영역입니다.', note: '현재 학습 설정으로 생성한 정지 파형입니다. 실제 환자의 측정값은 아닙니다.'},
  settings: {title: '현재 설정값', term: '3 · 화면 아래쪽', copy: '장비에 설정한 값을 확인하는 자리입니다. 상단의 측정값과 역할이 다릅니다.', note: '상단의 조작 연습으로 전환하면 항목 선택, 값 변경, 취소와 적용을 연습할 수 있습니다.'}
};
const waveTerms = [
  {symbol: 'Pressure', title: '압력', meaning: '시간에 따른 압력 표시를 살펴봅니다.', value: 'cmH₂O'},
  {symbol: 'Flow', title: '유량', meaning: '시간에 따른 유량 표시를 살펴봅니다.', value: 'L/min'},
  {symbol: 'Volume', title: '용적', meaning: '시간에 따른 용적 표시를 살펴봅니다.', value: 'mL'}
];
function areaTerms(id) {
  if (id === 'waves') return waveTerms;
  return DISPLAY_TERMS.filter(term => term.category === (id === 'monitor' ? 'measured' : 'setting')).map((term, i) => ({
    ...term,
    value: id === 'monitor' ? MONITOR_REFERENCE[i][1] : formatSetting(PARAMETERS[i].id, baseline[PARAMETERS[i].id]),
    unit: id === 'monitor' ? MONITOR_REFERENCE[i][2] : PARAMETERS[i].unit
  }));
}
function exploreDetail() {
  const detail = regions[region];
  const terms = areaTerms(region);
  const term = terms[selectedTerms[region]];
  return `<div class="panel-detail"><p class="term">${detail.term}</p><h3 tabindex="-1">${detail.title}</h3><p>${detail.copy}</p>
    <label class="term-label" for="display-term">표시 항목</label><select id="display-term">${terms.map((item, i) => `<option value="${i}" ${selectedTerms[region] === i ? 'selected' : ''}>${item.symbol}</option>`).join('')}</select>
    <div class="meaning-example"><b>${term.value}</b><span>${term.symbol}${term.unit ? ' · ' + term.unit : ''}<br>${region === 'monitor' ? '고정 표시 예시' : region === 'settings' ? '학습 설정값' : term.title}</span></div>
    <p class="term-meaning">${term.meaning}</p><p class="term-note">${detail.note}</p><button class="text-button" data-action="region-back">‹ 전체 영역 보기</button></div>`;
}
function explore() {
  return `<div class="b-shell">${header()}<section class="b-content"><div class="b-heading"><div><h2>PB980 화면을 직접 살펴보세요.</h2><p>궁금한 영역을 누르면 그 부분의 역할을 설명합니다.</p></div><span class="subtle-label">장비 탐색</span></div>
    <div class="b-grid"><div class="b-stage">${device('explore')}<p class="helper-note">번호가 있는 세 영역을 선택할 수 있습니다.</p></div>
    <aside class="explore-panel" aria-label="장비 영역 설명">${region ? exploreDetail() : `<div class="panel-top"><h3>어디부터 살펴볼까요?</h3><p>장비의 위치와 표시 의미를<br>함께 익힐 수 있습니다.</p></div><div class="region-list">${Object.entries(regions).map(([id, item], i) => `<button class="region-item" data-region="${id}"><i>${i + 1}</i><span>${item.title}<small>${['숫자의 의미 알아보기', '압력·유량·용적 구분하기', '설정 항목 위치 익히기'][i]}</small></span><span aria-hidden="true" class="region-arrow">›</span></button>`).join('')}</div>`}</aside></div></section>${footer()}</div>`;
}
function practiceSidebar() {
  const count = Object.values(sessions).filter(session => session.completed).length;
  return `<aside class="c-sidebar"><div class="brand"><span class="brand-icon">${waveIcon}</span><span>PB980<small>장비 연습실</small></span></div><p class="side-label">학습 과정</p><button class="side-item active" data-action="start">기본 조작 연습</button><button class="side-item" data-mode="b">화면 읽기</button><div class="sidebar-bottom">실습 학생 · 신규 간호사<br>완료한 연습 ${count} / ${PRACTICE_LESSONS.length}</div></aside>`;
}
function practiceStart() {
  const lesson = currentLesson();
  return `<div class="c-shell">${practiceSidebar()}<div class="c-main"><header class="c-head"><span>기본 조작 연습</span>${legacyLink}</header><section class="c-body"><p class="c-greeting">PB980 인공호흡기를 익히는 반복 연습</p><h2>익숙해질 때까지,<br>한 동작씩 연습하세요.</h2><p class="subcopy">설정 항목을 찾고, 값을 조절하고, 변경을 취소하는 과정을 직접 따라 해보세요.</p>
    <div class="practice-overview"><div class="task-list" role="group" aria-label="연습 선택">${PRACTICE_LESSONS.map((item, i) => `<button class="task-row ${selectedLesson === item.id ? 'current' : ''}" data-lesson="${item.id}" aria-pressed="${selectedLesson === item.id}"><span class="lesson-num">0${i + 1}</span><span class="task-description"><strong>${item.title}</strong><small>${item.summary}</small></span><span class="row-mark">${sessions[item.id].completed ? '완료' : selectedLesson === item.id ? '선택됨' : '선택'}</span></button>`).join('')}</div>
    <aside class="mission-card"><p class="mission-type">이번 연습</p><h3>${lesson.question.replace('\n', '<br>')}</h3><p>${lesson.description}</p><button class="primary" data-action="learn">${currentSession().completed ? '연습 결과 보기' : currentSession().edit ? '연습 이어하기' : '조작 연습 시작'} ${arrow}</button></aside></div>
    <p class="c-bottom-note">각 연습은 독립적인 학습 설정으로 시작합니다. 화면을 전환해도 진행 상태가 유지됩니다.</p></section>${footer()}</div></div>`;
}
function completionText(session) {
  if (session.id === 'find') return '화면 아래쪽의 PEEP는 설정값입니다. 상단 모니터의 PEEP 고정 예시와 구분하세요.';
  if (session.id === 'cancel') return `변경 중인 값은 적용되지 않았습니다. 확정된 설정값 ${formatSetting('peep', session.settings.peep)} cmH₂O가 그대로 유지됩니다.`;
  return `화면 아래 PEEP 설정값이 ${formatSetting('peep', session.settings.peep)} cmH₂O로 바뀌었습니다. 위쪽 모니터 숫자는 독립적인 고정 예시입니다.`;
}
function practiceTask() {
  const session = currentSession();
  const lesson = currentLesson();
  return `<div class="c-shell">${practiceSidebar()}<div class="c-main"><header class="c-head"><button class="text-button" data-action="start">‹ 연습 목록</button><span class="head-meta">기본 조작 · ${lesson.title}</span></header><section class="c-practice"><div class="mission-top"><div><h2>${session.completed ? lesson.success : lesson.objective}</h2><p>${session.completed ? '화면 아래 강조된 PEEP 설정값을 확인하세요.' : '화면 아래 PEEP 항목을 선택해 연습을 시작하세요.'}</p></div></div>
    <div class="mission-grid"><div>${device('mission', true)}<p class="helper-note">설정으로 생성한 교육용 정지 파형 · 환자 상태는 계산하지 않습니다.</p></div>
    <aside class="check-panel"><h3>이번에 할 일</h3><ol class="checklist">${lesson.steps.map((label, i) => `<li class="${session.step > i ? 'done' : session.step === i ? 'active' : ''}"><i>${session.step > i ? '✓' : i + 1}</i><span>${label}</span></li>`).join('')}</ol>
    ${session.completed ? `<div class="success" role="status"><strong>연습 완료</strong>${completionText(session)}</div><button class="primary" data-action="reset-practice">한 번 더 연습</button><button class="text-button" data-action="start">다른 연습 선택</button>` : `<p>${lesson.description}</p>${session.feedback && !session.edit ? `<div class="practice-feedback" role="status">${session.feedback}</div>` : ''}`}</aside></div></section>${footer()}</div></div>`;
}
function learningNav() {
  return `<nav class="learning-nav" aria-label="학습 이동"><button class="home-button" data-action="home"><span aria-hidden="true">‹</span> 처음 화면</button><div class="learning-toggle" role="group" aria-label="학습 방식"><button data-mode="b" aria-pressed="${screen === 'explore'}" aria-controls="learning-content">장비 탐색</button><button data-mode="c" aria-pressed="${screen.startsWith('practice')}" aria-controls="learning-content">조작 연습</button></div><span class="learning-nav-note">보고 익히고, 직접 연습하세요</span></nav>`;
}
function render() {
  root.innerHTML = `<div class="review-shell integrated-shell">${screen === 'home' ? '' : learningNav()}<div class="preview" id="learning-content" tabindex="-1">${screen === 'home' ? aStart() : screen === 'explore' ? explore() : screen === 'practice' ? practiceStart() : practiceTask()}</div></div>`;
  const heading = root.querySelector('#learning-content h2');
  if (heading) heading.tabIndex = -1;
  document.title = `${screen === 'home' ? 'PB980 인공호흡기 학습실' : screen === 'explore' ? '장비 탐색' : '조작 연습'} | PB980`;
}
function focusElement(selector) {
  root.querySelector(selector)?.focus({preventScroll: true});
}
function navigate(next, focus = '#learning-content h2') {
  screen = next;
  if (screen.startsWith('practice')) practiceScene = screen;
  if (location.hash !== '#' + screen) history.pushState(null, '', '#' + screen);
  render();
  focusElement(focus);
  if (focus === '#learning-content h2') window.scrollTo({top: 0, behavior: 'instant'});
}
function finishEdit(next) {
  sessions[selectedLesson] = next;
  render();
  focusElement(next.completed ? '[data-action=reset-practice]' : next.edit ? '[data-action=plus]' : '[data-setting=peep]');
}
root.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || !root.contains(button)) return;
  const {mode, region: nextRegion, lesson, setting, action} = button.dataset;
  if (mode) {
    navigate(mode === 'b' ? 'explore' : practiceScene === 'start' ? 'practice' : practiceScene, `.learning-toggle [data-mode=${mode}]`);
    return;
  }
  if (nextRegion && regions[nextRegion]) {
    region = nextRegion;
    render();
    focusElement('.panel-detail h3');
    if (window.innerWidth <= 760) root.querySelector('.explore-panel').scrollIntoView({block: 'nearest'});
    return;
  }
  if (lesson && sessions[lesson]) {
    selectedLesson = lesson;
    render();
    focusElement(`[data-lesson=${lesson}]`);
    return;
  }
  if (setting) {
    sessions[selectedLesson] = selectPracticeSetting(currentSession(), setting);
    render();
    focusElement(currentSession().completed ? '[data-action=reset-practice]' : currentSession().edit ? '[data-action=plus]' : `[data-setting=${setting}]`);
    return;
  }
  if (action === 'home') return navigate('home');
  if (action === 'learn') return navigate(screen === 'home' ? 'explore' : 'practice-task');
  if (action === 'explore') return navigate('explore');
  if (action === 'start') return navigate('practice');
  if (action === 'region-back') {region = null; render(); focusElement('.region-item'); return;}
  if (action === 'plus' || action === 'minus') {
    sessions[selectedLesson] = adjustPracticeValue(currentSession(), action === 'plus' ? 1 : -1);
    render(); focusElement(`[data-action=${action}]`); return;
  }
  if (action === 'cancel-edit') return finishEdit(cancelPracticeEdit(currentSession()));
  if (action === 'apply-edit') return finishEdit(applyPracticeEdit(currentSession()));
  if (action === 'reset-practice') {
    sessions[selectedLesson] = createPracticeSession(selectedLesson);
    render(); focusElement('[data-setting=peep]');
  }
});
root.addEventListener('change', event => {
  if (event.target.id !== 'display-term' || !region) return;
  const index = Number(event.target.value);
  if (!Number.isInteger(index) || !areaTerms(region)[index]) return;
  selectedTerms[region] = index;
  render(); focusElement('#display-term');
});
root.addEventListener('keydown', event => {
  if (event.key === 'Escape' && screen === 'practice-task' && currentSession().edit) {
    event.preventDefault();
    finishEdit(cancelPracticeEdit(currentSession()));
  }
});
function loadRoute() {
  const requested = location.hash.slice(1);
  screen = ['home', 'explore', 'practice', 'practice-task'].includes(requested) ? requested : 'home';
  if (screen.startsWith('practice')) practiceScene = screen;
  if (location.hash !== '#' + screen) history.replaceState(null, '', '#' + screen);
  render();
}
window.addEventListener('hashchange', loadRoute);
loadRoute();
