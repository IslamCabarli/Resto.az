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
Its initial launch failed with `WHPX: Failed to setup partition, hr=80070005`;
no Android device was available for a runtime smoke test. Resolve the Windows
hypervisor/access issue with the machine owner, or connect a physical Android
phone with USB debugging enabled. No Windows security settings were changed.

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

The backend owner maintains `../../docs/api/openapi.yaml`. It was not present
when this setup was created. Do not invent endpoints or start a mock server until
the contract has been supplied.
