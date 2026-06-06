# echo.11 — Expo (iOS) app

Native React Native / Expo wrapper of the echo.11 frequency engine, ready for
App Store submission. **The audio engine is translated from Web Audio to
on-device PCM synthesis** — no audio files required.

---

## What's here

```
echo11-expo/
├── App.js                      # entry — ECHO.11 wordmark + one Play button (POC)
├── app.json                    # Expo config — iOS bundle id + BACKGROUND AUDIO
├── eas.json                    # EAS Build / Submit profiles
├── package.json                # expo-av + expo-file-system
├── babel.config.js
└── src/
    ├── audio/
    │   ├── frequencies.js      # the 21-frequency catalog, ported 1:1 from app.js
    │   └── ToneEngine.js       # ← the real translation: Web Audio → native WAV synth
    └── components/
        └── PlayButton.js       # the proof-of-concept Play button
```

---

## How the engine was translated

| Web (app.js) | Native (ToneEngine.js) |
|---|---|
| `createOscillator()` × 2, sine | sine samples written into a **16-bit stereo PCM WAV** |
| `StereoPanner` L = −1 / R = +1 | left channel = `sin(cL)`, right channel = `sin(cR)` |
| binaural beat = `cR − cL` | identical math — the beat is preserved exactly |
| `GainNode` ramp 0 → .35 / → 0 | `setVolumeAsync` fade-in 0.3 s / fade-out 1.3 s |
| browser autoplay | `expo-av` loop + **background audio session** |

The WAV is an integer number of cycles of `gcd(cL, cR)`, so the loop point is
click-free for every (integer) carrier in the catalog.

---

## Run it on the iPhone simulator (from your Mac)

**One-time setup**
1. Install **Xcode** from the Mac App Store, open it once, and accept the license.
2. Xcode → Settings → Components → install an **iOS Simulator** runtime.
3. Install **Node.js** (LTS) from nodejs.org if you don't have it.

**Run the app**
```bash
cd echo11-expo
npm install            # pulls expo-av, expo-file-system + the brand fonts
npx expo start         # then press  i  to open the iOS simulator
```
That's it — the ECHO.11 dashboard launches in the simulator and tones play
through your Mac's speakers. Editing `App.js` or `src/Styles.js` hot-reloads live.

> **Note on background audio:** the simulator and Expo Go are fine for the UI and
> for hearing tones, but **locked-screen / background playback only works in a real
> dev build**. To test that:
> ```bash
> npx expo run:ios      # compiles the native project (needs Xcode + CocoaPods)
> ```

---

## Build structure

```
echo11-expo/
├── App.js                      # ECHO.11 dashboard (brand UI)
├── src/
│   ├── Styles.js               # the design system — color, type, spacing tokens
│   ├── audio/
│   │   ├── frequencies.js      # the 21-frequency catalog, ported 1:1 from app.js
│   │   └── ToneEngine.js       # Web Audio → native WAV synthesis
│   └── components/
│       └── PlayButton.js       # standalone single-button POC (optional)
```

---

## Ship it (App Store)

```bash
npm i -g eas-cli
eas login
eas build:configure
eas build -p ios --profile production      # cloud build → .ipa
eas submit -p ios --profile production     # upload to App Store Connect
```

Before submitting, fill in `eas.json → submit.production.ios` with your Apple ID,
App Store Connect app id, and Team id. Bundle id is `app.echo11.ios`.

### Assets you still need to add (`assets/`)
- `icon.png` — 1024×1024, **no alpha, no rounded corners**
- `splash.png` — centered logo on `#0A0A0B`
- `adaptive-icon.png` — Android foreground

---

## Background audio — why it works

This is the #1 technical risk for a frequencies app, handled in two places:

1. **`app.json`** → `ios.infoPlist.UIBackgroundModes: ["audio"]`
2. **`ToneEngine.js`** → `Audio.setAudioModeAsync({ staysActiveInBackground: true, playsInSilentModeIOS: true })`

Together they keep the tone alive when the screen locks — verify on a **real
device**, never the simulator alone.

---

## Playing a file from echo11.app (the literal request)

The catalog is synthesized, so it needs no files. If you upload guided tracks or
podcast audio to the domain, stream them with:

```jsx
<PlayButton remoteUrl="https://echo11.app/tones/528.mp3" />
```

`ToneEngine.playRemote(url)` uses the same background-audio session.

---

## Next steps toward parity with the web app
- Port the session timer, mode filter, and the 30-day streak (localStorage → `expo-secure-store` / AsyncStorage).
- Bridge lock-screen controls via the Now Playing info center (native module or `expo-av` + a media-session shim).
- Wire the AI analysis feature to `https://echo11.app/api/ai-analysis` (lock its CORS origin first).

© 2026 Shira Sarid / echo.11 · Not a medical device.
