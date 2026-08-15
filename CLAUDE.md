# AIGo — Project & CLI Guide

## Antigravity CLI Shortcuts & Commands

### Slash Commands
- `/goal` — Run long-running tasks autonomously until the objective is complete.
- `/plan` — Generate a step-by-step implementation plan before writing code.
- `/grill-me` — Interactive Q&A interview to resolve architecture and design decisions.
- `/schedule` — Schedule one-shot timers or recurring cron jobs.
- `/teamwork-preview` — Launch multi-agent subagent orchestration for large features.
- `/learn` — Persist custom user preferences, rules, or environment fixes across sessions.

### CLI Keybindings
- `ctrl+o` — Toggle expand/collapse for tool output details.
- `ctrl+c` — Interrupt current model turn / tool execution.

---

## Production Deployment

### Backend
- **Production URL**: `https://aigo-vert.vercel.app`
- **Health Check**: `GET /api/health` → `{"status":"ok","service":"AIGo AI Backend","openai":true}`
- **Rizz Endpoint**: `POST /api/ai/rizz`
- **Analytics Endpoint**: `GET /api/analytics`

### App Store Connect
- **App Name**: AIGo Rizz Keyboard
- **App ID**: `6801409076`
- **Bundle ID**: `com.aigo.inky.app`
- **Apple ID**: `en163902@icloud.com`
- **Team ID**: `129188892` (Enkhbold Ganbold)
- **Dev Team ID**: `24QC7XFXVJ`

---

## TestFlight & Build Workflow

### 1. Build, Export & Upload to TestFlight (Full Pipeline)
```bash
# Clean build, archive, export, and upload in one shot
cd ios && rm -rf ./build && \
xcodebuild -project AIGo.xcodeproj -scheme AIGo \
  -destination "generic/platform=iOS" \
  -archivePath ./build/AIGo.xcarchive archive && \
xcodebuild -exportArchive \
  -archivePath ./build/AIGo.xcarchive \
  -exportPath ./build/export-testflight \
  -exportOptionsPlist ./ExportOptions-TestFlight.plist && \
source ../.env && \
xcrun altool --upload-app \
  -f ./build/export-testflight/AIGo.ipa -t ios \
  -u "en163902@icloud.com" \
  -p "$APPLE_APP_SPECIFIC_PASSWORD"
```

### 2. Build & Install on Physical Device (iPhone39)
```bash
# Build for connected iPhone39
xcodebuild -project ios/AIGo.xcodeproj -scheme AIGo \
  -destination "id=00008120-001A20A01EE1A01E" build

# Install app
xcrun devicectl device install app \
  --device 00008120-001A20A01EE1A01E \
  ~/Library/Developer/Xcode/DerivedData/AIGo-esypgkswfkyltyclyqgspijatllg/Build/Products/Debug-iphoneos/AIGo.app

# Launch app
xcrun devicectl device process launch \
  --device 00008120-001A20A01EE1A01E com.aigo.inky.app
```

### 3. Fastlane Commands
```bash
# Create/verify App Store Connect record
FASTLANE_USER="en163902@icloud.com" FASTLANE_PASSWORD="?Trs6R8q" \
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="kwun-utpc-uiec-sqvs" \
fastlane run produce app_identifier:"com.aigo.inky.app" itc_team_id:"129188892"

# Add internal TestFlight tester
FASTLANE_USER="en163902@icloud.com" FASTLANE_PASSWORD="?Trs6R8q" \
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="kwun-utpc-uiec-sqvs" \
FASTLANE_ITC_TEAM_ID="129188892" \
fastlane pilot add -a "com.aigo.inky.app" -f "FirstName" -l "LastName" -e "tester@email.com" -g "Internal"
```

---

## App AI Features & Personalization Specs

The main app (`ContentView.swift`) features a streamlined **Personalize** interface:
- **Gender**: `Male`, `Female`, `Non-binary`, `Other`
- **Sexuality**: `Straight`, `Gay`, `Lesbian`, `Bisexual`, `Queer`, `Other`
- **Age**: `18`–`99`
- **Intent**: `Fun & Hookup`, `A Relationship`, `Casual Date`, `Neutral`
- **Platform**: `iMessage`, `Instagram DM`, `Dating Apps (Tinder/Hinge/Bumble)`
- **Casing Style**: `all lowercase`, `standard casing`, `ALL CAPS`
- **Tone**: `Brainrot / Gen-Z Slang`, `Proper English`, `Playful`, `Witty & Flirting`
- **Flirt Level**: `1`–`5` (`Mild & Subtle` → `Smooth & Teasing` → `Playful Banter` → `Bold & Direct` → `Unhinged & Down Bad`)

---

## Keyboard Extension Specifications (`AIGoKeyboard`)

- **Design**: Native iOS system keyboard styling matching Apple iOS system colors (`systemGray5`).
- **Font**: 13pt Apple SF Pro system font (`.system(size: 13, weight: .regular, design: .default)`).
- **Screenshot-Only Rizz Mode**: Operates purely on screenshot images detected from Photos (`PhotoLibraryMonitor`) or Pasteboard (`ClipboardMonitor`).
- **Left-Aligned Screenshot Preview**: Screenshot photo renders on the left side of the scroll view like an incoming received image.
- **Action Control Row**: Features **`re-rizz ↺`** (or `rizz`) dark wide action button + `⌫` backspace key.

---

## Project Structure & Architecture

### iOS App (`ios/`)
- Target 1: `AIGo` (`com.aigo.inky.app`)
- Target 2: `AIGoKeyboard` (`com.aigo.inky.app.keyboard`)
- App Group: `group.com.aigo.keyboard` (Shared `UserDefaults` & Personalization Settings)
- Default Backend URL: `https://aigo-vert.vercel.app`
- App Icon: Custom Gemini-generated Rizz Keyboard logo (lightning bolt "R" on blue-pink gradient)
- Current Build Version: `1.0 (2)`

### Web Dashboard (`web/`)
- SvelteKit + Vite server on `0.0.0.0:5173` (LAN accessible for physical iPhone)
- API Routes: `/api/ai/rizz`, `/api/analytics`, `/api/logs`
- Vision AI: OpenAI-compatible gateway, model set by `AI_MODEL` (default `google/gemini-3-5-flash-lite`), with Contrastive Persona & Negative Constraints system prompt
- Environment: `OPENAI_API_KEY` + `BASE_URL` stored in `web/.env` (and root `.env`); `/api/health` reports the active gateway and model
- Logo: `web/static/logo.png` (same as App Store icon)

### Code Signing & Certificates
- Distribution Certificate: `55V5H4N7CS`
- Provisioning Profiles: `AppStore_com.aigo.inky.app.mobileprovision`, `AppStore_com.aigo.inky.app.keyboard.mobileprovision`
- Export Options: `ios/ExportOptions-TestFlight.plist`

---

## Useful Development Commands

```bash
# Web backend dev server
cd web && bun dev

# Run Svelte / TypeScript checks
cd web && bun run check

# Verify backend health
curl https://aigo-vert.vercel.app/api/health

# List connected devices
xcrun xctrace list devices
```

---

## Environment Variables (`.env`)

```
OPENAI_API_KEY=sk-...
APPLE_APP_SPECIFIC_PASSWORD=kwun-utpc-uiec-sqvs
```

### Fastlane Environment
```
FASTLANE_USER=en163902@icloud.com
FASTLANE_PASSWORD=?Trs6R8q
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=kwun-utpc-uiec-sqvs
FASTLANE_ITC_TEAM_ID=129188892
```
