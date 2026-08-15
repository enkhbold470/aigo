# Web Backend Guidelines (`web/`)

## Key Specifications

- **Framework**: SvelteKit + Vite
- **Local Dev**: `0.0.0.0:5173` (LAN accessible for physical iPhones on local Wi-Fi)
- **Production URL**: `https://aigo-vert.vercel.app`
- **Environment Key**: `OPENAI_API_KEY` stored in `web/.env`
- **Logo Asset**: `web/static/logo.png` (same as iOS App Store icon)

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Health check, returns `{"status":"ok","openai":true}` |
| `POST` | `/api/ai/rizz` | Vision-based rizz generation from base64 screenshot |
| `GET` | `/api/analytics` | Token burn & cost analytics summary |
| `GET` | `/api/logs` | Request log history |

---

## Vision System Prompt Architecture (`src/lib/server/ai.ts`)

The backend OpenAI vision pipeline relies on **Contrastive Personas**, **Negative Constraints**, and **Bubble Layout Recognition**:

1. **Bubble Parsing**: Identifies left-side incoming messages across iMessage (grey), Instagram DM (grey), WhatsApp (white), and Tinder/Hinge (grey).
2. **Recipient Grounding**: Directly extracts the recipient's last message to ensure 100% unique context-aware replies without repetitive template phrases.
3. **Contrastive Options**:
   - `Friendly`: Casual banter & relatable callback (No date proposals, no teasing).
   - `Playful tease`: Playful callout & skeptical pushback (No sweet compliments, no agreeing).
   - `Bold`: Direct flirt & date invitation (No passive small talk).
4. **Sampling**: Temperature set to `0.92` for optimal creative separation.
5. **Model**: configurable via `AI_MODEL` (default `google/gemini-3-5-flash-lite`, vision-capable). Screenshot requests can use a separate `AI_VISION_MODEL`. Resolved in `src/lib/server/aiConfig.ts`.
6. **Cost Tracking**: Each request logs prompt/completion tokens and calculates USD cost from the per-model rate table in `src/lib/server/aiConfig.ts`.

---

## Token Burn & Cost Analytics

The analytics dashboard (`src/routes/+page.svelte`) displays:
- Total prompt tokens, completion tokens, and all-time USD spend
- Current month spend breakdown
- Per-request token log table
- Market rate reference table, derived from the models actually seen in logs plus the configured default

Data is aggregated in `src/lib/server/logger.ts` and exposed via `/api/analytics`.

---

## Commands

```bash
# Run SvelteKit dev server
cd web && bun dev

# Run Svelte & TypeScript check
cd web && bun run check

# Verify production health
curl https://aigo-vert.vercel.app/api/health
```
