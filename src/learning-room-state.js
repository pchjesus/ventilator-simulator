import {initialSettings} from './sim-model.js';
import {beginSettingEdit, stepSettingEdit, acceptSettingEdit} from './setting-editor.js';

// Independent teaching sessions. Nothing reads or writes the legacy app's state.
export const PRACTICE_LESSONS = Object.freeze([
  {id: 'find', title: '설정 항목 위치 익히기', summary: '화면에서 PEEP 설정값 찾기',
    question: 'PEEP 설정값을\n찾을 수 있나요?',
    description: '화면 아래쪽에서 PEEP라고 적힌 설정 항목을 찾아 선택해 보세요.',
    objective: 'PEEP 설정값을 찾아보세요.',
    success: 'PEEP 설정값을 찾았습니다.',
    steps: ['화면 아래 PEEP 설정 선택']},
  {id: 'cancel', title: '변경한 값 취소하기', summary: '현재 설정과 변경 중인 값 구분하기',
    question: '바꾼 값을\n취소할 수 있나요?',
    description: 'PEEP 항목을 선택하고 값을 한 번 바꾼 뒤, 확정하지 않고 취소해 보세요.',
    objective: 'PEEP를 바꾼 뒤 취소하세요.',
    success: '변경을 취소했습니다.',
    steps: ['PEEP 설정 선택', '변경 중인 값 조절', '취소 후 원래 값 확인']},
  {id: 'apply', title: '확정된 설정 확인하기', summary: '변경 확정 후 표시값 다시 확인하기',
    question: '확정된 값을\n확인할 수 있나요?',
    description: 'PEEP 값을 바꾸고 변경 적용을 눌러 보세요. 화면 아래 확정된 설정값이 바뀌는지 확인합니다.',
    objective: 'PEEP를 바꾸고 적용하세요.',
    success: '변경한 설정을 적용했습니다.',
    steps: ['PEEP 설정 선택', '변경 중인 값 조절', '적용 후 설정값 확인']}
]);

export function createPracticeSession(id = 'cancel') {
  if (!PRACTICE_LESSONS.some(lesson => lesson.id === id)) throw new Error('Unknown practice lesson');
  return {id, settings: initialSettings(), edit: null, step: 0, completed: false, feedback: ''};
}

export function selectPracticeSetting(session, id) {
  if (session.completed) return session;
  if (id !== 'peep') return {...session, feedback: '이번에는 화면 아래 PEEP 항목을 찾아보세요.'};
  if (session.id === 'find') return {...session, completed: true, step: 1, feedback: ''};
  return {...session, edit: beginSettingEdit(session.settings, id), step: 1, feedback: ''};
}

export function adjustPracticeValue(session, delta) {
  if (!session.edit || session.completed) return session;
  const edit = stepSettingEdit(session.edit, delta);
  return {...session, edit, step: edit.pending === edit.original ? 1 : 2, feedback: ''};
}

export function cancelPracticeEdit(session) {
  if (!session.edit) return session;
  const completed = session.id === 'cancel' && session.edit.pending !== session.edit.original;
  return {...session, edit: null, completed, step: completed ? 3 : 0,
    feedback: completed ? '' : '값을 한 번 바꾼 뒤 다시 진행해 보세요.'};
}

export function applyPracticeEdit(session) {
  if (!session.edit || session.id !== 'apply') return session;
  const settings = acceptSettingEdit(session.settings, session.edit);
  if (settings === session.settings) return {...session, feedback: '값을 먼저 바꾼 다음 적용해 보세요.'};
  return {...session, settings, edit: null, step: 3, completed: true, feedback: ''};
}
