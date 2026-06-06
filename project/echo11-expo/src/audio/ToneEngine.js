// ─────────────────────────────────────────────────────────────
// echo.11 · ToneEngine  (native translation of the Web Audio engine)
//
// WHY THIS EXISTS
// The web app (app.js) used the Web Audio API: createOscillator() per channel,
// StereoPanner L/R, a GainNode ramp. None of that exists in React Native / Expo.
//
// THE TRANSLATION
// We synthesize the exact same tone on-device by generating a 16-bit stereo PCM
// WAV in pure JS — left channel = sine(cL), right channel = sine(cR) — write it
// to the cache as a .wav, and play it on an infinite loop with expo-av.
//   • solfeggio  → cL === cR  → identical sine in both ears (pure tone)
//   • binaural   → cL ≠ cR    → the brain perceives the (cR − cL) beat, exactly
//                                like the two-oscillator + panner setup on web.
//
// SEAMLESS LOOP
// We make the buffer an integer number of cycles of gcd(cL,cR), so the end of the
// file lines up perfectly with the start — no click at the loop point. For integer
// carriers (all of them in the catalog) this is mathematically exact.
//
// FADES  (matching the web engine)
//   fade-in  : volume 0 → target over 0.30 s   (web: ramp to .35 over .3 s)
//   fade-out : volume → 0 over 1.30 s on stop  (web: ramp to 0 over 1.3 s)
//
// BACKGROUND AUDIO  (the #1 launch risk — handled here + in app.json)
//   setAudioModeAsync staysActiveInBackground:true + playsInSilentModeIOS:true,
//   paired with UIBackgroundModes:["audio"] in app.json, keeps the tone alive when
//   the screen locks or the app backgrounds — the core promise of the app.
// ─────────────────────────────────────────────────────────────

import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const SAMPLE_RATE = 44100;
const AMPLITUDE = 0.5;          // headroom; master volume rides on top via setVolumeAsync
const TARGET_VOL = 0.7;         // play volume (0..1) after fade-in
const FADE_IN_MS = 300;
const FADE_OUT_MS = 1300;
const MIN_LOOP_SECONDS = 1.0;   // repeat the seamless period until at least this long

let _current = null;            // { sound, id }
let _audioModeReady = false;

// ---- audio session: call once before the first play ----------
async function ensureAudioMode() {
  if (_audioModeReady) return;
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,      // keep playing when locked/backgrounded
    playsInSilentModeIOS: true,         // ignore the hardware silent switch
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });
  _audioModeReady = true;
}

// ---- math helpers --------------------------------------------
function gcd(a, b) { a = Math.round(a); b = Math.round(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }

// Number of samples for a seamless loop of carriers cL & cR.
function loopSamples(cL, cR) {
  const g = gcd(cL, cR);                       // fundamental that both share
  const periodSec = 1 / g;                     // shortest seamless period
  const reps = Math.max(1, Math.ceil(MIN_LOOP_SECONDS / periodSec));
  return Math.round(SAMPLE_RATE * periodSec * reps);
}

// ---- WAV (PCM16 stereo) builder ------------------------------
function buildWavBase64(cL, cR) {
  const n = loopSamples(cL, cR);
  const bytesPerSample = 2, channels = 2;
  const dataLen = n * channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buffer);

  const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

  // RIFF header
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataLen, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);                 // PCM chunk size
  view.setUint16(20, 1, true);                  // format = PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * channels * bytesPerSample, true); // byte rate
  view.setUint16(32, channels * bytesPerSample, true);               // block align
  view.setUint16(34, 8 * bytesPerSample, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataLen, true);

  // PCM samples: interleaved L,R
  const wL = (2 * Math.PI * cL) / SAMPLE_RATE;
  const wR = (2 * Math.PI * cR) / SAMPLE_RATE;
  let off = 44;
  for (let i = 0; i < n; i++) {
    const l = Math.sin(wL * i) * AMPLITUDE;
    const r = Math.sin(wR * i) * AMPLITUDE;
    view.setInt16(off, Math.max(-1, Math.min(1, l)) * 0x7fff, true); off += 2;
    view.setInt16(off, Math.max(-1, Math.min(1, r)) * 0x7fff, true); off += 2;
  }
  return base64FromBytes(new Uint8Array(buffer));
}

// Hermes has no Buffer/btoa — encode base64 ourselves.
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64FromBytes(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i], b1 = bytes[i + 1], b2 = bytes[i + 2];
    out += B64[b0 >> 2];
    out += B64[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < bytes.length ? B64[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    out += i + 2 < bytes.length ? B64[b2 & 63] : '=';
  }
  return out;
}

async function writeWavFile(freq) {
  const path = `${FileSystem.cacheDirectory}echo11-${freq.id}.wav`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    const b64 = buildWavBase64(freq.cL, freq.cR);
    await FileSystem.writeAsStringAsync(path, b64, { encoding: FileSystem.EncodingType.Base64 });
  }
  return path;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/** Synthesize + play a frequency from the catalog. Loops until stop(). */
export async function play(freq) {
  await ensureAudioMode();
  await stop();                                  // fade out anything already playing

  const uri = await writeWavFile(freq);
  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { isLooping: true, shouldPlay: true, volume: 0 }
  );
  _current = { sound, id: freq.id };

  // fade in (matches web 0 → .35 over .3s)
  const steps = 12, dt = FADE_IN_MS / steps;
  for (let i = 1; i <= steps; i++) {
    if (!_current || _current.sound !== sound) break;
    await sound.setVolumeAsync((i / steps) * TARGET_VOL);
    await wait(dt);
  }
  return sound;
}

/** Fade out and release the current tone. */
export async function stop() {
  const cur = _current;
  if (!cur) return;
  _current = null;
  const { sound } = cur;
  try {
    const status = await sound.getStatusAsync();
    const v0 = status.isLoaded ? status.volume : TARGET_VOL;
    const steps = 16, dt = FADE_OUT_MS / steps;
    for (let i = steps - 1; i >= 0; i--) {
      await sound.setVolumeAsync((i / steps) * v0);
      await wait(dt);
    }
  } catch (_) {}
  try { await sound.stopAsync(); } catch (_) {}
  try { await sound.unloadAsync(); } catch (_) {}
}

/** Live master volume, 0..100 (matches web audioVol: (v/100)*.5). */
export async function setVolume(v) {
  if (!_current) return;
  try { await _current.sound.setVolumeAsync(Math.max(0, Math.min(1, (v / 100) * TARGET_VOL))); } catch (_) {}
}

export function currentId() { return _current?.id ?? null; }

// ─────────────────────────────────────────────────────────────
// REMOTE FILE PLAYER  (what you literally asked for: a file from echo11.app)
// Use ONLY if you upload audio files to the domain. Most of the catalog is
// synthesized above and needs no files — keep this for guided tracks / podcast.
// ─────────────────────────────────────────────────────────────
export async function playRemote(url) {
  await ensureAudioMode();
  await stop();
  const { sound } = await Audio.Sound.createAsync(
    { uri: url },
    { isLooping: true, shouldPlay: true, volume: TARGET_VOL }
  );
  _current = { sound, id: url };
  return sound;
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
