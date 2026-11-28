# Resto.az — customer app

Mobile-only Flutter app for restaurant guests in Baku.

## Setup scope

- Android application ID / iOS bundle ID: `az.resto.customer`
- Display name: `Resto.az`
- Platforms: Android and iOS only (no web or desktop project)
- SDK used for initial setup: Flutter 3.50.1 stable / Dart 3.14.0
- Current screen: startup placeholder, with a widget smoke test

## Run locally

Install Flutter stable and Android Studio, then run from this directory:

```sh
flutter doctor -v
flutter pub get
flutter analyze
flutter test
flutter devices
flutter run -d <android-device-id>
```

Start an Android emulator in Android Studio's Device Manager before `flutter run`.
This machine has a `Resto_API_36` AVD (Pixel 7 / Android 36 / Google APIs).
Its initial launch failed with `WHPX: Failed to setup partition, hr=80070005`.
Updating the official Android Emulator package to 37.3.10 resolved the issue on
this machine without changing Windows security settings. Android 16 (API 36)
booted, `flutter run -d emulator-5554 --no-resident` succeeded, and the Resto.az
startup screen was visually verified. Use `flutter devices` for the current ID.

Flutter 3.50.1 requests NDK `28.2.13676358`. If the first build reports that
`sdkmanager` cannot install it, select that version under Android Studio >
SDK Manager > SDK Tools > NDK (Side by side) > Show Package Details. The installed
Android CLI also supports `android sdk install ndk/28.2.13676358`.

If Flutter is not found on this Windows machine, add `C:\flutter\bin` to your user
PATH and restart the terminal / VS Code. PowerShell can also run it directly:

```powershell
& C:\flutter\bin\flutter.bat doctor -v
```

Build a debug APK:

```sh
flutter build apk --debug
```

iOS builds and simulator testing require macOS and Xcode; they cannot be validated
on Windows. Store signing and release configuration are not part of this setup.
The generated Android release configuration still uses debug signing and must not
be used for a store release.

## Working rules

- Work on a small `app/<topic>` branch created from `develop`.
- Make changes only under `apps/` and `packages/`.
- Run `flutter analyze`, `flutter test`, and the app before committing changes.
- Open pull requests into `develop`; do not push directly to `develop` or `main`.
- Do not commit local SDK paths, signing keys, tokens, or generated build files.

## Next step: app/foundation

Add Riverpod, go_router, dio, and `flutter_localizations` with AZ/EN/RU ARB files
in a separate feature branch. The generated Material UI dependency comes from the
Flutter 3.50.1 app template; it does not change those planned architecture choices.
Money must always use integer qepik (30 AZN = 3000), never `double`.

## Contract-based mock server

The backend owner maintains `../../docs/api/openapi.yaml` (read-only for app work).
The v0.1.0 contract is now available on `develop`. From `apps/customer/`, start
Prism using Bun (leave this terminal open):

```sh
bun x @stoplight/prism-cli@5.14.2 mock ../../docs/api/openapi.yaml --host 127.0.0.1 --port 4010
```

In another terminal, from the same directory:

```sh
bun tool/mock_smoke_test.mjs
```

This checks all 18 contract operations plus an invalid OTP request, including
integer money fields. It sends only local mock requests, not real orders or SMS.
Prism validates requests and generates responses directly from the unchanged
OpenAPI file. It is stateless: it does not save profile changes, orders, payments,
loyalty progress, or translations, and it cannot test real payment or kitchen flows.

Prism serves contract paths directly, so the **mock** base URL is
`http://127.0.0.1:4010` (no `/api/v1`). For the standard Android Studio emulator,
use `http://10.0.2.2:4010`. The real backend's base URL from the contract is
`http://localhost:8000/api/v1`; do not accidentally use localhost to reach the
computer from an emulator. Local HTTP is for debug only, never production.
No HTTP client or endpoint integration is added in `app/setup`.

Stop Prism with Ctrl+C. No global Node packages are needed. Refresh the contract
from `develop` and restart Prism when Islam publishes a new version.
