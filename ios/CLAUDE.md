# iOS App Architecture & Guidelines (`ios/`)

## Key Specifications

- **Main App Target**: `AIGo` (`com.aigo.inky.app`)
- **Keyboard Extension Target**: `AIGoKeyboard` (`com.aigo.inky.app.keyboard`)
- **App Group**: `group.com.aigo.keyboard`
- **Default Server Base URL**: `https://aigo-vert.vercel.app`
- **App Store Connect App ID**: `6801409076`
- **Dev Team ID**: `24QC7XFXVJ`
- **Current Build Version**: `1.0 (2)`

---

## App Icon

- **Source**: Custom Gemini-generated logo (lightning bolt "R" on blue-pink gradient)
- **Asset Catalog**: `AIGoApp/Assets.xcassets/AppIcon.appiconset/`
- **Sizes**: `icon_1024.png` (1024×1024), `icon_180.png`, `icon_152.png`, `icon_120.png`, `icon_76.png`
- **Build Setting**: `ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon` (set in both Debug & Release)

---

## Design & UI Tokens

- **Keyboard Panel Height**: `320pt` with `priority(999)` inside `viewWillLayoutSubviews()`.
- **Background Color**: `Color(UIColor.systemGray5)` (Matches Apple iOS native keyboard background).
- **Typography**: 13pt Apple SF Pro system font (`.system(size: 13, weight: .regular, design: .default)`).
- **Rizz Chat Bubbles**: iMessage Blue (`#007AFB`), `22pt` corner radius, right-aligned.
- **Screenshot Preview**: Left-aligned thumbnail preview inside `ScrollView` (`maxWidth: 220, maxHeight: 160`).
- **Main Action Button**: `re-rizz ↺` (or `rizz` when empty).

---

## Shared Modules (`AIGoApp/Shared/`)

1. `AppGroupManager.swift`: Manages shared `UserDefaults` for Personalization parameters (`gender`, `sexuality`, `age`, `intent`, `platform`, `casingStyle`, `toneStyle`, `flirtLevel`, `apiBaseURL`).
2. `PhotoLibraryMonitor.swift`: Monitors & fetches latest screenshots from `PHPhotoLibrary` / `PHAsset`.
3. `ClipboardMonitor.swift`: Thread-safe `UIPasteboard.general` inspection with `hasFullAccess` guard.
4. `AIAPIClient.swift`: Handles Vision API requests to `/api/ai/rizz` with base64 encoded JPEG screenshots.
5. `UIImage+Utils.swift`: Base64 JPEG conversion, pasteboard copy, and photo saving utilities.
6. `Models.swift`: Data models shared between main app and keyboard extension.

---

## Code Signing

- **Distribution Certificate**: `55V5H4N7CS` (Apple Distribution: Enkhbold Ganbold)
- **Development Signing Identity**: `68B8B5FD612C67598AD43B740C4E533AA4C0D4B2` (Apple Development: Enkhbold Ganbold)
- **Provisioning Profiles**:
  - `AppStore_com.aigo.inky.app.mobileprovision` (Main app)
  - `AppStore_com.aigo.inky.app.keyboard.mobileprovision` (Keyboard extension)
- **Export Options**: `ExportOptions-TestFlight.plist` (manual signing, maps both bundle IDs)

---

## Build & Deploy Commands

### Build & Install on Physical Device (iPhone39)
```bash
# Build
xcodebuild -project AIGo.xcodeproj -scheme AIGo \
  -destination "id=00008120-001A20A01EE1A01E" build

# Install
xcrun devicectl device install app \
  --device 00008120-001A20A01EE1A01E \
  ~/Library/Developer/Xcode/DerivedData/AIGo-esypgkswfkyltyclyqgspijatllg/Build/Products/Debug-iphoneos/AIGo.app

# Launch
xcrun devicectl device process launch \
  --device 00008120-001A20A01EE1A01E com.aigo.inky.app
```

### Archive & Upload to TestFlight
```bash
# Clean archive
rm -rf ./build && xcodebuild -project AIGo.xcodeproj -scheme AIGo \
  -destination "generic/platform=iOS" \
  -archivePath ./build/AIGo.xcarchive archive

# Export signed IPA
xcodebuild -exportArchive \
  -archivePath ./build/AIGo.xcarchive \
  -exportPath ./build/export-testflight \
  -exportOptionsPlist ./ExportOptions-TestFlight.plist

# Upload to App Store Connect
source ../.env && xcrun altool --upload-app \
  -f ./build/export-testflight/AIGo.ipa -t ios \
  -u "en163902@icloud.com" \
  -p "$APPLE_APP_SPECIFIC_PASSWORD"
```

### Important: Version Bumping
Before each TestFlight upload, increment `CFBundleVersion` in both:
- `AIGoApp/Info.plist`
- `AIGoKeyboard/Info.plist`

Apple rejects duplicate build numbers for the same `CFBundleShortVersionString`.
