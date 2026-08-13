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

## App AI Features & Personalization Specs

The main app (`ContentView.swift`) features a streamlined **Personalize** interface:
- **Gender**: `Male`, `Female`, `Non-binary`, `Other`
- **Sexuality**: `Straight`, `Gay`, `Lesbian`, `Bisexual`, `Queer`, `Other`
- **Age**: `18`–`99`
- **Intent**: `Fun & Hookup`, `A Relationship`, `Casual Date`, `Neutral`
- **Platform**: `iMessage`, `Instagram DM`, `Dating Apps (Tinder/Hinge/Bumble)`
- **Casing Style**: `all lowercase`, `standard casing`, `ALL CAPS`
- **Tone**: `Brainrot / Gen-Z Slang`, `Proper English`, `Playful`, `Witty & Flirty`
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
- Target 1: `AIGo` (Main SwiftUI Personalize App & Camera Picker)
- Target 2: `AIGoKeyboard` (Rizz Keyboard Extension)
- App Group: `group.com.aigo.keyboard` (Shared `UserDefaults` & Personalization Settings)
- Default Backend URL: `http://192.168.0.49:5173`

### Web Backend (`web/`)
- SvelteKit + Vite server on `0.0.0.0:5173` (LAN accessible for physical iPhone)
- API Route: `/api/ai/rizz`
- Vision AI: OpenAI `gpt-4o-mini` with Contrastive Persona & Negative Constraints system prompt.
- Environment Key: `OPENAI_API_KEY` stored in `web/.env` (and root `.env`).

---

## Useful Development Commands

```bash
# Web backend dev server
cd web && bun dev

# Run Svelte / TypeScript checks
cd web && bun run check

# Build iOS app for physical device
cd ios && xcodebuild -project AIGo.xcodeproj -scheme AIGo -destination "id=00008120-001A20A01EE1A01E" build

# Deploy & launch onto iPhone39
xcrun devicectl device install app --device "00008120-001A20A01EE1A01E" /Users/inky/Library/Developer/Xcode/DerivedData/AIGo-esypgkswfkyltyclyqgspijatllg/Build/Products/Debug-iphoneos/AIGo.app
xcrun devicectl device process launch --device "00008120-001A20A01EE1A01E" com.aigo.inky.app
```
