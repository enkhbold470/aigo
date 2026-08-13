import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import OpenAI from "openai";

const http = httpRouter();

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function options() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () =>
    json({
      status: "ok",
      service: "AIGo Convex AI Backend",
      openai: Boolean(process.env.OPENAI_API_KEY),
      timestamp: Date.now(),
    })
  ),
});

http.route({
  path: "/api/ai/clipboard",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      const text = String(body.text ?? "").trim();
      const context = String(body.context ?? "");
      if (!text) return json({ suggestions: [] });

      const openai = getOpenAIClient();
      if (!openai) {
        return json({
          summary: text.slice(0, 80),
          contentType: "general",
          suggestions: [
            { label: "Acknowledge", text: "Got it — I'll take care of this.", icon: "sparkles" },
            { label: "Reply later", text: "Thanks, I'll review and get back to you shortly." },
          ],
          simulated: true,
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Analyze this copied clipboard text and provide 3-4 concise smart replies an iOS keyboard user can tap to paste.

Copied text: ${JSON.stringify(text)}
Typing field context: ${JSON.stringify(context)}

Return JSON:
{
  "summary": "Short 1-sentence classification",
  "contentType": "question | address | code | email | task | general",
  "suggestions": [
    { "label": "Short chip label", "text": "Full text to insert", "icon": "sparkles" }
  ]
}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      return json(JSON.parse(response.choices[0]?.message?.content ?? "{}"));
    } catch (err: any) {
      return json({ error: err?.message || "Failed to analyze clipboard" }, 500);
    }
  }),
});

http.route({
  path: "/api/ai/screenshot",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      const base64Image = body.imageBase64 ?? "";
      const userTone = body.tone ?? "friendly & direct";
      if (!base64Image) return json({ error: "Missing imageBase64 parameter" }, 400);

      const openai = getOpenAIClient();
      if (!openai) {
        return json({
          detectedContext: "Screenshot received (OpenAI key not configured on Convex).",
          suggestions: [
            { label: "Confirm", text: "Sounds good — that time works for me.", tone: "enthusiastic" },
            { label: "Reschedule", text: "Could we shift this by 30 minutes?", tone: "polite" },
          ],
          simulated: true,
        });
      }

      const dataUrl = String(base64Image).startsWith("data:")
        ? base64Image
        : `data:image/jpeg;base64,${base64Image}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this chat/app screenshot. Extract the latest message and generate 4 smart reply chips with tone '${userTone}'. Return JSON with detectedContext and suggestions[{label,text,tone}].`,
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      return json(JSON.parse(response.choices[0]?.message?.content ?? "{}"));
    } catch (err: any) {
      return json({ error: err?.message || "Failed to analyze screenshot" }, 500);
    }
  }),
});

http.route({
  path: "/api/ai/transform",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      const inputText = String(body.text ?? "");
      const action = String(body.action ?? "fix");
      const customPrompt = String(body.customPrompt ?? "");
      if (!inputText.trim()) return json({ transformedText: "" });

      const openai = getOpenAIClient();
      if (!openai) {
        return json({ transformedText: inputText.trim(), originalText: inputText, action, simulated: true });
      }

      let systemInstruction =
        "You are a writing assistant built into an iOS keyboard. Respond ONLY with the revised text.";
      const map: Record<string, string> = {
        formal: " Rewrite professionally.",
        witty: " Add light humor.",
        concise: " Shorten while keeping intent.",
        shorter: " Shorten while keeping intent.",
        executive: " Make it executive and action-oriented.",
        friendly: " Make it friendly.",
        bulleted: " Convert to bullet points.",
        fix: " Fix grammar and typos.",
      };
      systemInstruction += map[action] ?? map.fix;
      if (customPrompt) systemInstruction += ` Additional: ${customPrompt}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: inputText },
        ],
        temperature: 0.5,
      });

      return json({
        transformedText: response.choices[0]?.message?.content?.trim() ?? inputText,
        originalText: inputText,
        action,
      });
    } catch (err: any) {
      return json({ error: err?.message || "Failed to transform text" }, 500);
    }
  }),
});

http.route({
  path: "/api/ai/complete",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      const before = String(body.before ?? "").trim();
      if (!before) return json({ suggestions: [] });

      const openai = getOpenAIClient();
      if (!openai) {
        return json({
          suggestions: [
            { label: "thanks", text: " thanks!" },
            { label: "works", text: " that works for me." },
          ],
          simulated: true,
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Suggest 3 short next-phrase completions. Text before cursor: ${JSON.stringify(before)}. Return JSON { "suggestions": [ { "label": "preview", "text": "continuation only" } ] }`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      return json(JSON.parse(response.choices[0]?.message?.content ?? "{}"));
    } catch (err: any) {
      return json({ error: err?.message || "Failed to complete phrase" }, 500);
    }
  }),
});

for (const path of ["/api/ai/clipboard", "/api/ai/screenshot", "/api/ai/transform", "/api/ai/complete"]) {
  http.route({
    path,
    method: "OPTIONS",
    handler: httpAction(async () => options()),
  });
}

export default http;
