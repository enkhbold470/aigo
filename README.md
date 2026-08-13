# AIGo

AI-native iOS keyboard: clipboard analysis, screenshot smart reply, tone rewrite, snippets, and next-phrase complete.

## Stack

- **iOS:** Swift + SwiftUI keyboard extension (`UIInputViewController`)
- **Web:** SvelteKit + Bun + Tailwind
- **AI:** OpenAI `gpt-4o-mini` (text + vision)
- **Data:** Convex (optional, for later sync)

## Run the web AI backend

```bash
cd web
cp .env.example .env
# put your OPENAI_API_KEY in web/.env
bun dev
```

Opens at `http://127.0.0.1:5173`. The keyboard talks to:

- `POST /api/ai/transform`
- `POST /api/ai/clipboard`
- `POST /api/ai/screenshot`
- `POST /api/ai/complete`
- `GET /api/health`

Without an API key the server still returns useful simulated replies so you can test the UI.

## Run the iOS keyboard

1. Open `ios/AIGo.xcodeproj` in Xcode.
2. Select your Team under Signing for **AIGo** and **AIGoKeyboard**.
3. Enable the App Group `group.com.aigo.keyboard` on both targets if Xcode asks.
4. Run **AIGo** on a simulator or device.
5. On the device/simulator: Settings → General → Keyboard → Keyboards → Add New Keyboard → **AIGo Keyboard**.
6. Open that keyboard row and turn **Allow Full Access** on. Clipboard, screenshots, and network AI will not work without it.
7. In the AIGo host app, set Backend URL:
   - Simulator: `http://127.0.0.1:5173`
   - Physical device: `http://YOUR_MAC_LAN_IP:5173`

Tap the test field in the host app, hold 🌐, and switch to AIGo Keyboard.

## Keyboard features

- QWERTY + shift/caps + 123 layout
- `!fix` `!short` `!formal` chips, plus typed shortcuts like `!fix`
- Auto-read clipboard text and screenshot images (resized before upload)
- Smart reply chips
- Next-phrase complete
- Snippet paste bar (edited in the host app)

## Convex (optional)

```bash
cd web
bunx convex dev
```

Set `OPENAI_API_KEY` in the Convex dashboard. HTTP routes in `web/convex/http.ts` mirror the SvelteKit AI API for production.

Keep auth simple for now — Convex Auth can be added later.
