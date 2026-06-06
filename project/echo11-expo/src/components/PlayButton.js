// ─────────────────────────────────────────────────────────────
// echo.11 · PlayButton  — the proof-of-concept component
//
// The simplest possible surface: ONE button that plays / stops a frequency.
// Pass a `freq` from the catalog (synthesized on-device), or pass `remoteUrl`
// to stream a file from echo11.app instead.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import * as ToneEngine from '../audio/ToneEngine';

export default function PlayButton({ freq, remoteUrl }) {
  const [state, setState] = useState('idle'); // idle | loading | playing
  const label = freq?.name ?? 'Tone';

  // stop audio if the component unmounts
  useEffect(() => () => { ToneEngine.stop(); }, []);

  const toggle = useCallback(async () => {
    if (state === 'playing') {
      setState('idle');
      await ToneEngine.stop();
      return;
    }
    setState('loading');
    try {
      if (remoteUrl) await ToneEngine.playRemote(remoteUrl);
      else await ToneEngine.play(freq);
      setState('playing');
    } catch (e) {
      console.warn('echo.11 play failed:', e);
      setState('idle');
    }
  }, [state, freq, remoteUrl]);

  const playing = state === 'playing';

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={toggle}
        disabled={state === 'loading'}
        style={({ pressed }) => [
          styles.btn,
          playing && styles.btnOn,
          pressed && styles.btnPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${playing ? 'Stop' : 'Play'} ${label}`}
      >
        {state === 'loading'
          ? <ActivityIndicator color="#0A0A0B" />
          : <Text style={[styles.icon, playing && styles.iconOn]}>{playing ? '■' : '▶'}</Text>}
      </Pressable>

      <Text style={styles.name}>{label}</Text>
      {freq ? <Text style={styles.sub}>{freq.hz} Hz · {freq.sub}</Text> : null}
      <Text style={styles.state}>{playing ? 'PLAYING' : 'TAP TO PLAY'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14 },
  btn: {
    width: 108, height: 108, borderRadius: 54,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#8FB6FF',
    shadowColor: '#8FB6FF', shadowOpacity: 0.5, shadowRadius: 28, shadowOffset: { width: 0, height: 0 },
  },
  btnOn: { backgroundColor: '#F2EFE9' },
  btnPressed: { transform: [{ scale: 0.95 }] },
  icon: { fontSize: 40, color: '#0A0A0B', marginLeft: 4 },
  iconOn: { marginLeft: 0 },
  name: { color: '#F2EFE9', fontSize: 22, fontWeight: '600', letterSpacing: -0.3, marginTop: 6 },
  sub: { color: 'rgba(242,239,233,0.6)', fontSize: 14 },
  state: { color: 'rgba(242,239,233,0.4)', fontSize: 11, letterSpacing: 2, marginTop: 4, fontVariant: ['tabular-nums'] },
});
