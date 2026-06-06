// ─────────────────────────────────────────────────────────────
// echo.11 · Styles.js  — the design system, ported from the ECHO.11 brand
//
// Single source of truth for color, type and spacing across the app.
// Mirrors the web tokens: monochrome cosmic, deep black, ivory ink,
// one signal-blue accent. Fonts are the real brand faces, loaded in App.js.
// ─────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';

// ---- color tokens ----
export const C = {
  bg:        '#0A0A0B',
  bg2:       '#0E0E12',
  surface:   '#131318',
  surface2:  '#1C1C21',
  ink:       '#F2EFE9',
  muted:     'rgba(242,239,233,0.60)',
  faint:     'rgba(242,239,233,0.38)',
  line:      'rgba(242,239,233,0.12)',
  line2:     'rgba(242,239,233,0.06)',
  accent:    '#8FB6FF',
  accentInk: '#0A0A0B',
};

// ---- font family names (must match the keys loaded by useFonts in App.js) ----
export const F = {
  ui:        'SpaceGrotesk_500Medium',
  uiSemi:    'SpaceGrotesk_600SemiBold',
  uiBold:    'SpaceGrotesk_700Bold',
  mono:      'SpaceMono_400Regular',
  monoBold:  'SpaceMono_700Bold',
  serif:     'Newsreader_400Regular',
  serifIt:   'Newsreader_400Regular_Italic',
};

// modes → accent tint label (kept neutral; brand is monochrome)
export const MODES = [
  { id: 'all',       label: 'All' },
  { id: 'sleep',     label: 'Sleep' },
  { id: 'healing',   label: 'Healing' },
  { id: 'focus',     label: 'Focus' },
  { id: 'abundance', label: 'Abundance' },
];

export const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollBody: { paddingBottom: 150 },

  // ---- top bar ----
  topbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingTop: 6, paddingBottom: 14,
  },
  wordmark: { fontFamily: F.uiBold, fontSize: 17, letterSpacing: 3, color: C.ink },
  wordmarkDot: { color: C.accent },
  clockWrap: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  clockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  clock: { fontFamily: F.mono, fontSize: 12, letterSpacing: 1, color: C.muted },

  // ---- kicker ----
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  kickerBar: { width: 18, height: 1, backgroundColor: C.accent },
  kicker: { fontFamily: F.mono, fontSize: 10.5, letterSpacing: 2.5, color: C.faint, textTransform: 'uppercase' },

  // ---- hero / featured ----
  hero: {
    marginHorizontal: 18, borderRadius: 24, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.line, padding: 24, overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: -90, right: -60, width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.accent, opacity: 0.10,
  },
  heroName: { fontFamily: F.uiSemi, fontSize: 34, letterSpacing: -0.6, color: C.ink, marginTop: 4 },
  heroSub: { fontFamily: F.serifIt, fontSize: 16, color: C.muted, marginTop: 6 },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 },
  heroHz: { fontFamily: F.mono, fontSize: 13, letterSpacing: 1, color: C.accent },
  heroHzLabel: { fontFamily: F.mono, fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: 'uppercase', marginTop: 4 },

  heroPlay: {
    width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.accent,
    shadowColor: C.accent, shadowOpacity: 0.5, shadowRadius: 26, shadowOffset: { width: 0, height: 0 },
  },
  heroPlayOn: { backgroundColor: C.ink },
  heroPlayIcon: { fontSize: 30, color: C.accentInk, marginLeft: 3 },
  heroPlayIconOn: { marginLeft: 0 },

  // ---- section ----
  section: { marginTop: 38, paddingHorizontal: 22 },
  sectionTitle: { fontFamily: F.uiSemi, fontSize: 20, letterSpacing: -0.3, color: C.ink },

  // ---- mode chips ----
  chipsRow: { paddingHorizontal: 18, paddingTop: 4, gap: 8, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99,
    borderWidth: 1, borderColor: C.line, backgroundColor: 'transparent',
  },
  chipOn: { backgroundColor: C.accent, borderColor: C.accent },
  chipText: { fontFamily: F.mono, fontSize: 11, letterSpacing: 1, color: C.muted, textTransform: 'uppercase' },
  chipTextOn: { color: C.accentInk },

  // ---- frequency row card ----
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.line2,
  },
  cardNum: { fontFamily: F.mono, fontSize: 12, color: C.faint, width: 30 },
  cardNumOn: { color: C.accent },
  cardMid: { flex: 1 },
  cardName: { fontFamily: F.uiSemi, fontSize: 16.5, letterSpacing: -0.2, color: C.ink },
  cardNameOn: { color: C.accent },
  cardSub: { fontFamily: F.serif, fontSize: 13, color: C.muted, marginTop: 3 },
  cardHz: { fontFamily: F.mono, fontSize: 11, color: C.faint, marginTop: 4, letterSpacing: 0.5 },
  cardBtn: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.line,
  },
  cardBtnOn: { backgroundColor: C.accent, borderColor: C.accent },
  cardBtnIcon: { fontSize: 16, color: C.ink, marginLeft: 2 },
  cardBtnIconOn: { color: C.accentInk, marginLeft: 0 },

  // ---- now playing bar ----
  npBar: {
    position: 'absolute', left: 14, right: 14, bottom: 26,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.line,
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 14,
    shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 30, shadowOffset: { width: 0, height: 12 },
  },
  npEq: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  npEqIcon: { fontSize: 13, color: C.accentInk },
  npMid: { flex: 1 },
  npName: { fontFamily: F.uiSemi, fontSize: 14.5, color: C.ink },
  npMeta: { fontFamily: F.mono, fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: 'uppercase', marginTop: 2 },
  npStop: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: C.line },
  npStopText: { fontFamily: F.mono, fontSize: 11, letterSpacing: 1, color: C.ink, textTransform: 'uppercase' },

  // ---- foot ----
  foot: { fontFamily: F.mono, fontSize: 9.5, letterSpacing: 1.5, color: C.faint, textAlign: 'center', textTransform: 'uppercase', marginTop: 30 },

  // ---- loading ----
  loading: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});
