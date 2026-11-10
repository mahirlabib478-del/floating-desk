# Floating Desk — Cookie Inspector

A small Android-first Expo app that checks whether an `auth_token` cookie field is present.

## Privacy and security
- All parsing happens locally on the device.
- No network requests, analytics, or backend.
- The app intentionally does not reveal, copy, store, or transmit session-token values.
- Avoid pasting live session cookies into untrusted apps. If a session cookie has been exposed, revoke active sessions and sign in again.

## Run locally
1. Install Node.js LTS.
2. Run `npm install`.
3. Run `npx expo start`.
4. Open the project using Expo Go on an Android phone, or press `a` with an Android emulator running.

## Build an Android APK
Install EAS CLI and sign in:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

For a directly installable APK, use an EAS preview profile with `android.buildType: "apk"` in `eas.json`.
