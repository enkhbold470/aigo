# iOS App Architecture & Guidelines (`ios/`)

## Key Specifications

- **Main App Target**: `AIGo` (`com.aigo.inky.app`)
- **Keyboard Extension Target**: `AIGoKeyboard` (`com.aigo.inky.app.keyboard`)
- **App Group**: `group.com.aigo.keyboard`
- **Default Server Base URL**: `https://aigo-production-dc3d.up.railway.app`

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

---

## Build & CLI Deploy Workflow

```bash
# Build for connected physical device (iPhone39)
cd ios && xcodebuild -project AIGo.xcodeproj -scheme AIGo -destination "id=00008120-001A20A01EE1A01E" build

# Install app via devicectl
xcrun devicectl device install app --device "00008120-001A20A01EE1A01E" /Users/inky/Library/Developer/Xcode/DerivedData/AIGo-esypgkswfkyltyclyqgspijatllg/Build/Products/Debug-iphoneos/AIGo.app

# Launch app via devicectl
xcrun devicectl device process launch --device "00008120-001A20A01EE1A01E" com.aigo.inky.app
```
