# v0.3.6 Top Overlay UX Contract

## Manual
- Upper ▤ '설명서' button opens modal with 7 sections: overview, device-inspired Accept/Cancel, quick ±, monitor vs waveform limitations, right-side ? learning, CIRCUIT, safety.
- The education content module is authoritative; the modal renders its prose as plain text, with external source links.
- A manual popup can be dismissed using its explicit X, tapping/clicking outside its visual box, or Escape; focus returns to its toolbar trigger after keyboard dismissal.

## Release history
- Upper ◷ '패치 내역' button opens separate modal containing version/date and grouped changes from v0.2.x to v0.3.6.
- '전체' plus UI/UX, 기능 추가, 간호·의학 교육, 안정성·테스트, 문서·근거 filters.
- Filtering changes only the displayed version entries, not the source history or simulator state.

## Modal interaction and accessibility
- Native HTML `<dialog>` with `showModal()`, named heading and aria title.
- Backdrop dismissal is guarded by a bounding-rectangle hit test, and `pointerdown.preventDefault()` to avoid click-through/focus loss.
- Esc is native browser close. Dialog.close listener restores focus to its toolbar button.
- Scrolling is inside modal; both overlays are full-width bottom sheets at <=550px, with height bound to the dynamic viewport.
- The existing PB980 staged setting editor remains a **separate native dialog**. Existing waveform and controls should not move state when opening/dismissing an informational overlay.
- Browser regressions test 1440, 360 and 320px open/dismiss, category filtering, internal clicks, and settings/waveform invariants.

## Non-goals
No alert confirmation, clinical simulation state mutation, router navigation, remote data loading, local-storage persistence or public deployment.
