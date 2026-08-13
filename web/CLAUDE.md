# Web Backend Guidelines (`web/`)

## Key Specifications

- **Framework**: SvelteKit + Vite
- **Host**: `0.0.0.0:5173` (LAN accessible for physical iPhones on local Wi-Fi)
- **API Endpoint**: `/api/ai/rizz` (`POST`)
- **Environment Key**: `OPENAI_API_KEY` stored in `web/.env`

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

---

## Commands

```bash
# Run SvelteKit dev server
cd web && bun dev

# Run Svelte & TypeScript check
cd web && bun run check
```
