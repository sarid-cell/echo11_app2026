// ─────────────────────────────────────────────────────────────
// echo.11 · App.js  — ECHO.11-branded dashboard
//
// Replaces the basic proof-of-concept with the full brand UI:
//   · live signal clock (the 00:00:00 motif)
//   · featured "Tonight's Signal" hero with a large play button
//   · mode filter chips (Sleep / Healing / Focus / Abundance)
//   · the full frequency catalog as editorial rows
//   · a floating Now-Playing bar
//
// All audio still runs through the native ToneEngine (on-device synthesis).
// All visual tokens come from src/Styles.js.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, Pressable, StatusBar, ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { Newsreader_400Regular, Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader';

import { S, C, MODES } from './src/Styles';
import { FREQS, byId } from './src/audio/frequencies';
import * as ToneEngine from './src/audio/ToneEngine';

const FEATURED_ID = 'hz528'; // The Love · 528 Hz

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
    SpaceMono_400Regular, SpaceMono_700Bold,
    Newsreader_400Regular, Newsreader_400Regular_Italic,
  });

  const [mode, setMode] = useState('all');
  const [currentId, setCurrentId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [clock, setClock] = useState(0);

  // live signal clock
  useEffect(() => {
    const t = setInterval(() => setClock((c) => c + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // stop audio on unmount
  useEffect(() => () => { ToneEngine.stop(); }, []);

  const featured = byId(FEATURED_ID);
  const list = useMemo(
    () => (mode === 'all' ? FREQS : FREQS.filter((f) => f.mode === mode)),
    [mode]
  );

  const toggle = useCallback(async (freq) => {
    if (currentId === freq.id) {
      setCurrentId(null);
      await ToneEngine.stop();
      return;
    }
    setLoadingId(freq.id);
    try {
      await ToneEngine.play(freq);
      setCurrentId(freq.id);
    } catch (e) {
      console.warn('echo.11 play failed:', e);
    } finally {
      setLoadingId(null);
    }
  }, [currentId]);

  if (!fontsLoaded) {
    return (
      <View style={S.loading}><ActivityIndicator color={C.accent} /></View>
    );
  }

  const fmt = (n) => String(Math.floor(n)).padStart(2, '0');
  const clockStr = `${fmt(clock / 3600)}:${fmt((clock % 3600) / 60)}:${fmt(clock % 60)}`;
  const nowFreq = currentId ? byId(currentId) : null;
  const featOn = currentId === featured.id;
  const featLoading = loadingId === featured.id;

  return (
    <SafeAreaView style={S.root}>
      <StatusBar barStyle="light-content" />

      {/* top bar */}
      <View style={S.topbar}>
        <Text style={S.wordmark}>ECHO<Text style={S.wordmarkDot}>.11</Text></Text>
        <View style={S.clockWrap}>
          <View style={S.clockDot} />
          <Text style={S.clock}>{clockStr}</Text>
        </View>
      </View>

      <ScrollView style={S.scroll} contentContainerStyle={S.scrollBody} showsVerticalScrollIndicator={false}>
        {/* hero */}
        <View style={S.hero}>
          <View style={S.heroGlow} />
          <View style={S.kickerRow}>
            <View style={S.kickerBar} />
            <Text style={S.kicker}>Tonight's Signal</Text>
          </View>
          <Text style={S.heroName}>{featured.name}</Text>
          <Text style={S.heroSub}>{featured.desc}</Text>
          <View style={S.heroBottom}>
            <View>
              <Text style={S.heroHz}>{featured.hz}.000 Hz</Text>
              <Text style={S.heroHzLabel}>{featured.type === 'binaural' ? `Binaural · ${featured.beat} Hz beat` : 'Pure tone'}</Text>
            </View>
            <Pressable
              onPress={() => toggle(featured)}
              disabled={featLoading}
              style={({ pressed }) => [S.heroPlay, featOn && S.heroPlayOn, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityLabel={`${featOn ? 'Stop' : 'Play'} ${featured.name}`}
            >
              {featLoading
                ? <ActivityIndicator color={C.accentInk} />
                : <Text style={[S.heroPlayIcon, featOn && S.heroPlayIconOn]}>{featOn ? '■' : '▶'}</Text>}
            </Pressable>
          </View>
        </View>

        {/* mode chips */}
        <View style={{ marginTop: 34 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.chipsRow}>
            {MODES.map((m) => {
              const on = mode === m.id;
              return (
                <Pressable key={m.id} onPress={() => setMode(m.id)} style={[S.chip, on && S.chipOn]}>
                  <Text style={[S.chipText, on && S.chipTextOn]}>{m.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* frequency list */}
        <View style={S.section}>
          <View style={S.kickerRow}>
            <View style={S.kickerBar} />
            <Text style={S.kicker}>{list.length} Frequencies</Text>
          </View>
          {list.map((f) => {
            const on = currentId === f.id;
            const loading = loadingId === f.id;
            return (
              <Pressable key={f.id} onPress={() => toggle(f)} style={S.card}>
                <Text style={[S.cardNum, on && S.cardNumOn]}>{f.num}</Text>
                <View style={S.cardMid}>
                  <Text style={[S.cardName, on && S.cardNameOn]}>{f.name}</Text>
                  <Text style={S.cardSub}>{f.sub}</Text>
                  <Text style={S.cardHz}>
                    {f.hz} Hz{f.type === 'binaural' ? ` · ${f.beat} Hz beat` : ' · pure'}
                  </Text>
                </View>
                <View style={[S.cardBtn, on && S.cardBtnOn]}>
                  {loading
                    ? <ActivityIndicator color={on ? C.accentInk : C.ink} size="small" />
                    : <Text style={[S.cardBtnIcon, on && S.cardBtnIconOn]}>{on ? '■' : '▶'}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={S.foot}>echo.11 · native synthesis · not a medical device</Text>
      </ScrollView>

      {/* now playing bar */}
      {nowFreq ? (
        <View style={S.npBar}>
          <View style={S.npEq}><Text style={S.npEqIcon}>♒</Text></View>
          <View style={S.npMid}>
            <Text style={S.npName}>{nowFreq.name}</Text>
            <Text style={S.npMeta}>Playing · {nowFreq.hz} Hz</Text>
          </View>
          <Pressable onPress={() => toggle(nowFreq)} style={S.npStop}>
            <Text style={S.npStopText}>Stop</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
