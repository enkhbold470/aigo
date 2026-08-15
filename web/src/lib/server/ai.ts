import type OpenAI from 'openai';
import { queryVectorDB, type VectorSearchResult } from './vectorDb';
import {
	createClient,
	estimateCostUSD,
	getApiKey,
	getBaseUrl,
	getModel,
	getVisionModel
} from './aiConfig';

export type Suggestion = {
	label: string;
	text: string;
	icon?: string;
	tone?: string;
};

function client(): OpenAI | null {
	return createClient();
}

export function hasOpenAIKey(): boolean {
	return Boolean(getApiKey());
}

/** Surfaced by /api/health so the active gateway is visible without leaking the key. */
export function aiConfigSummary(): { configured: boolean; baseUrl: string; model: string } {
	return {
		configured: Boolean(getApiKey()),
		baseUrl: getBaseUrl() ?? 'https://api.openai.com/v1',
		model: getModel()
	};
}

const TRANSFORM_INSTRUCTIONS: Record<string, string> = {
	formal: 'Rewrite to sound professional, respectful, and well-structured.',
	witty: 'Rewrite with cleverness, warmth, and light humor. Keep it short.',
	concise: 'Shorten significantly while preserving core facts and intent. One or two sentences.',
	shorter: 'Shorten significantly while preserving core facts and intent. One or two sentences.',
	executive: 'Reframe as high-level executive communication: direct, action-oriented, clear.',
	friendly: 'Rewrite in an approachable, enthusiastic, friendly tone.',
	bulleted: 'Convert the key points into clean bullet points.',
	fix: 'Fix spelling, grammar, and typos while keeping the original meaning and tone.'
};

export async function transformText(
	text: string,
	action = 'fix',
	customPrompt = ''
): Promise<{ transformedText: string; simulated: boolean }> {
	const trimmed = text.trim();
	if (!trimmed) return { transformedText: '', simulated: false };

	const openai = client();
	if (!openai) {
		return { transformedText: localTransform(trimmed, action), simulated: true };
	}

	let system =
		'You are a writing assistant inside an iOS keyboard. Respond ONLY with the revised text. No quotes, no preamble.';
	system += ' ' + (TRANSFORM_INSTRUCTIONS[action] ?? TRANSFORM_INSTRUCTIONS.fix);
	if (customPrompt) system += ` Additional instruction: ${customPrompt}`;

	const completion = await openai.chat.completions.create({
		model: getModel(),
		messages: [
			{ role: 'system', content: system },
			{ role: 'user', content: trimmed }
		],
		temperature: 0.5
	});

	return {
		transformedText: completion.choices[0]?.message?.content?.trim() || trimmed,
		simulated: false
	};
}

export async function analyzeClipboard(
	text: string,
	context = ''
): Promise<{
	summary: string;
	contentType: string;
	suggestions: Suggestion[];
	simulated: boolean;
}> {
	const trimmed = text.trim();
	if (!trimmed) {
		return { summary: '', contentType: 'general', suggestions: [], simulated: false };
	}

	const openai = client();
	if (!openai) {
		return {
			summary: trimmed.slice(0, 80),
			contentType: 'general',
			suggestions: localClipboard(trimmed),
			simulated: true
		};
	}

	const completion = await openai.chat.completions.create({
		model: getModel(),
		messages: [
			{
				role: 'user',
				content: `Analyze this copied clipboard text and provide 3-4 concise smart replies an iOS keyboard user can tap to paste.

Copied text: ${JSON.stringify(trimmed)}
Typing field context: ${JSON.stringify(context)}

Return JSON:
{
  "summary": "Short 1-sentence classification",
  "contentType": "question | address | code | email | task | general",
  "suggestions": [
    { "label": "Short chip label", "text": "Full text to insert", "icon": "sparkles" }
  ]
}`
			}
		],
		response_format: { type: 'json_object' },
		temperature: 0.7
	});

	const parsed = safeJson(completion.choices[0]?.message?.content);
	return {
		summary: parsed.summary ?? '',
		contentType: parsed.contentType ?? 'general',
		suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : localClipboard(trimmed),
		simulated: false
	};
}

export async function analyzeScreenshot(
	imageBase64: string,
	tone = 'friendly & direct'
): Promise<{
	detectedContext: string;
	suggestions: Suggestion[];
	simulated: boolean;
}> {
	if (!imageBase64) {
		return { detectedContext: '', suggestions: [], simulated: false };
	}

	const openai = client();
	if (!openai) {
		return {
			detectedContext: 'Screenshot detected (OpenAI key not configured).',
			suggestions: localScreenshot(),
			simulated: true
		};
	}

	const dataUrl = imageBase64.startsWith('data:')
		? imageBase64
		: `data:image/jpeg;base64,${imageBase64}`;

	const completion = await openai.chat.completions.create({
		model: getVisionModel(),
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `You are an AI keyboard analyzing a chat/app screenshot. Extract the latest message and generate 4 smart reply chips with tone "${tone}".

Return JSON:
{
  "detectedContext": "Brief OCR/chat summary",
  "suggestions": [
    { "label": "Short label", "text": "Exact reply to paste", "tone": "enthusiastic" }
  ]
}`
					},
					{ type: 'image_url', image_url: { url: dataUrl } }
				]
			}
		],
		response_format: { type: 'json_object' },
		max_tokens: 500
	});

	const parsed = safeJson(completion.choices[0]?.message?.content);
	return {
		detectedContext: parsed.detectedContext ?? '',
		suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : localScreenshot(),
		simulated: false
	};
}

export async function completePhrase(
	before: string,
	after = ''
): Promise<{ suggestions: Suggestion[]; simulated: boolean }> {
	const context = before.trim();
	if (!context) return { suggestions: [], simulated: false };

	const openai = client();
	if (!openai) {
		return { suggestions: localComplete(context), simulated: true };
	}

	const completion = await openai.chat.completions.create({
		model: getModel(),
		messages: [
			{
				role: 'user',
				content: `You are an iOS keyboard autocomplete engine. Given the text before the cursor, suggest 3 short next-phrase completions the user can tap.

Text before cursor: ${JSON.stringify(context)}
Text after cursor: ${JSON.stringify(after)}

Return JSON:
{ "suggestions": [ { "label": "short preview", "text": "exact continuation to insert" } ] }

"text" must be only the continuation, not the whole sentence.`
			}
		],
		response_format: { type: 'json_object' },
		temperature: 0.4
	});

	const parsed = safeJson(completion.choices[0]?.message?.content);
	return {
		suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : localComplete(context),
		simulated: false
	};
}

function localTransform(text: string, action: string): string {
	switch (action) {
		case 'formal':
			return `Hi — ${text.replace(/\s+/g, ' ').trim()} Please let me know if that works.`;
		case 'shorter':
		case 'concise':
			return text.split(/[.!?]/)[0]?.trim() || text.slice(0, 80);
		case 'witty':
			return `${text.trim()} 😉`;
		case 'bulleted':
			return text
				.split(/[.!?]\s+/)
				.filter(Boolean)
				.map((line) => `• ${line.trim()}`)
				.join('\n');
		case 'friendly':
			return `Hey! ${text.trim()}`;
		case 'executive':
			return text.trim();
		default:
			return text.replace(/\bi\b/g, 'I').replace(/\s+/g, ' ').trim();
	}
}

function localClipboard(text: string): Suggestion[] {
	const snippet = text.slice(0, 24);
	return [
		{ label: 'Acknowledge', text: `Got it — I'll take care of this.`, icon: 'sparkles' },
		{ label: 'Reply later', text: `Thanks for sending this. I'll review and get back to you shortly.` },
		{ label: 'Ask detail', text: `Quick question about "${snippet}${text.length > 24 ? '…' : ''}": can you share a bit more context?` }
	];
}

function localScreenshot(): Suggestion[] {
	return [
		{ label: 'Confirm', text: 'Sounds good — that time works for me.', tone: 'enthusiastic' },
		{ label: 'Reschedule', text: 'Could we shift this by 30 minutes?', tone: 'polite' },
		{ label: 'Clarify', text: 'Just to confirm, what time were you thinking?', tone: 'curious' },
		{ label: 'Decline', text: `I can't make that one — can we find another slot?`, tone: 'respectful' }
	];
}

function localComplete(before: string): Suggestion[] {
	const last = before.trim().split(/\s+/).slice(-3).join(' ');
	return [
		{ label: 'thanks', text: ' thanks!' },
		{ label: 'works for me', text: ' that works for me.' },
		{ label: 'more', text: ` ${last}?` }
	];
}

function safeJson(raw: string | null | undefined): Record<string, any> {
	if (!raw) return {};
	try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

export type RizzSuggestion = { tone: string; text: string };

export type PersonalizationConfig = {
	gender?: string;
	sexuality?: string;
	age?: number;
	intent?: string;
	platform?: string;
	casingStyle?: string;
	toneStyle?: string;
	flirtLevel?: number;
};

export type UsageStats = {
	model: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
	costUSD: number;
};

export async function generateRizz(
	imageBase64: string | null,
	context = '',
	personalization?: PersonalizationConfig
): Promise<{
	suggestions: RizzSuggestion[];
	options: string[];
	simulated: boolean;
	usage?: UsageStats;
	ragContext?: VectorSearchResult[];
}> {
	const gender = personalization?.gender || 'Male';
	const sexuality = personalization?.sexuality || 'Straight';
	const age = personalization?.age || 22;
	const intent = personalization?.intent || 'Fun & Hookup';
	const platform = personalization?.platform || 'iMessage';
	const casingStyle = personalization?.casingStyle || 'all lowercase';
	const toneStyle = personalization?.toneStyle || 'Brainrot / Gen-Z Slang';
	const flirtLevel = personalization?.flirtLevel || 3;

	// 1. Query Vector DB for relevant reference lines & reasoning templates
	const ragMatches = await queryVectorDB({
		text: context,
		ocrContext: imageBase64 ? 'screenshot chat image' : '',
		tone: toneStyle,
		intent,
		flirtLevel,
		topK: 4,
		minSimilarity: 0.15
	});

	const openai = client();
	if (!openai) {
		const items = ragMatches.length >= 3
			? [
					{ tone: 'Friendly', text: ragMatches[0].line },
					{ tone: 'Playful tease', text: ragMatches[1].line },
					{ tone: 'Bold', text: ragMatches[2].line }
				]
			: localRizzItems();
		return {
			suggestions: items,
			options: items.map((i) => i.text),
			simulated: true,
			ragContext: ragMatches
		};
	}

	const flirtLabels: Record<number, string> = {
		1: 'Mild & subtle flirting',
		2: 'Smooth & witty teasing',
		3: 'Confident & playful banter',
		4: 'Bold & direct flirt',
		5: 'Unhinged & down bad'
	};
	const flirtDesc = flirtLabels[flirtLevel] || 'Playful banter';

	// Format retrieved RAG context for injection into LLM prompt
	let ragContextPrompt = '';
	if (ragMatches.length > 0) {
		ragContextPrompt = `\nRETRIEVED VECTOR DB RAG REFERENCES & REASONING FRAMEWORKS:\n` +
			ragMatches
				.map(
					(m, idx) =>
						`[Ref ${idx + 1}] Category: ${m.category} | Tone: ${m.tone} | Similarity: ${(m.similarity * 100).toFixed(0)}%\n` +
						`  • Example Pattern: "${m.line}"\n` +
						`  • Psychological Strategy: ${m.reasoningTemplate}`
				)
				.join('\n\n') +
			`\n\nUse the reasoning strategies and tonal dynamics above to synthesize novel, high-converting replies strictly calibrated to the screenshot/context!`;
	}

	const systemPrompt = `You are the ULTIMATE Gen-Z rizz machine. You live and breathe brainrot slang, meme culture, and high-conversion dating energy. You specialize in analyzing chat screenshots and generating 3 FIRE, DISTINCT replies that make them OBSESSED.

SCREENSHOT & BUBBLE ANALYSIS INSTRUCTIONS:
1. LOCATE THE LATEST INCOMING MESSAGE (on the LEFT side of screenshot):
   - iMessage / IG / WhatsApp / Tinder / Hinge / Bumble: Left grey/white bubbles = INCOMING message from the crush/match. Right blue/green/purple = outgoing.
   - Find the VERY LAST message sent by the OTHER person. Your 3 replies MUST directly reference that specific message or photo with laser precision!

2. STRICT TONE CONTRAST & NEGATIVE CONSTRAINTS (CRITICAL - VIOLATE THESE AND YOU FAIL):

   • Option 1: "Friendly" (Role: Relatable Vibes & Shared Experience)
     - Goal: Match their energy, add a funny personal detail, or vibe with them.
     - Negative Constraint: NO teasing. NO date proposals. NO flirting. Pure vibes only.
     - Example (if they say "i suck at cooking"): "same my airfryer has a restraining order against me 😭"
     - Example (if they post a fit pic): "this fit got me weak fr no cap"

   • Option 2: "Playful tease" (Role: Savage Roast & Push-Pull Energy)
     - Goal: Playfully call them out, act skeptical, challenge them, or reverse uno card them.
     - Negative Constraint: NO agreement. NO compliments. NO being sweet. Pure chaos energy.
     - Example (if they say "i suck at cooking"): "damn so i should bring my own chef when i come over? 💀"
     - Example (if they post a fit pic): "ai generated and we know it, where the receipt at? 🧐"

   • Option 3: "Bold" (Role: Unhinged Down Bad & Power Move)
     - Goal: Direct flirt, concrete date proposal, or straight up sexual tension.
     - Negative Constraint: NO passive energy. NO small talk. NO beating around the bush. Get to the point.
     - Example (if they say "i suck at cooking"): "bet i can still feed you something good, my place or yours? 😏"
     - Example (if they post a fit pic): "drop the location or i'm manifesting you in my dm's tonight 🔥"

3. GEN-Z BRAINROT SLANG RULES (Use these NATURALLY when toneStyle is "Brainrot / Gen-Z Slang"):
   - "ngl" = not gonna lie
   - "fr" = for real
   - "lowkey" = secretly, kinda
   - "highkey" = obviously, definitely
   - "cooked" = crazy, wild, insane
   - "deadass" = seriously
   - "cap" = lying / fake
   - "no cap" = no lie / serious
   - "aura" = vibe / energy
   - "rizz" = charisma / game
   - "sigma" = confident, independent
   - "gyat" = expression of shock at appearance
   - "skibidi" = chaotic, wild energy
   - "ohio" = chaos, randomness
   - "delulu" = delusional (but in a confident way)
   - "slay" = doing amazing
   - "bussin" = really good (food)
   - "fanum tax" = taking some of someone's food
   - "w" = win
   - "L" = loss
   - "ratio" = getting more replies than likes
   - "glizzy" = hot dog (or sometimes gun, context matters)

USER PROFILE & TUNING:
- Sender Profile: ${gender}, ${sexuality}, age ${age}
- Target Goal/Intent: ${intent}
- App Context: ${platform}
- Casing Rule: "${casingStyle}" (CRITICAL: if "all lowercase", write strictly in lowercase with ZERO capital letters. If "ALL CAPS", use upper case. If "standard casing", use normal capitalization.)
- Tone Style: "${toneStyle}"
- Flirt Intensity: ${flirtLevel}/5 (${flirtDesc})
${ragContextPrompt}

OUTPUT REQUIREMENTS:
- Keep each reply SHORT (1-2 sentences max, aim for under 15 words).
- Use emojis NATURALLY and SPARINGLY (1-2 per reply max).
- Match the casing "${casingStyle}" 100% strictly - this is non-negotiable.
- NO markdown, NO code blocks, NO extra formatting.
- Return JSON format:
{
  "suggestions": [
    { "tone": "Friendly", "text": "..." },
    { "tone": "Playful tease", "text": "..." },
    { "tone": "Bold", "text": "..." }
  ]
}`;

	const userContent: any[] = [];

	if (imageBase64) {
		const dataUrl = imageBase64.startsWith('data:')
			? imageBase64
			: `data:image/jpeg;base64,${imageBase64}`;
		userContent.push({ type: 'image_url', image_url: { url: dataUrl } });
		userContent.push({
			type: 'text',
			text: `generate 3 rizz responses inspired by this screenshot/photo${context ? `. current input text: "${context}"` : ''}`
		});
	} else {
		userContent.push({
			type: 'text',
			text: `generate 3 rizz responses${context ? ` for this conversation context: "${context}"` : ''}`
		});
	}

	const targetModel = imageBase64 ? getVisionModel() : getModel();
	const completion = await openai.chat.completions.create({
		model: targetModel,
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userContent }
		],
		response_format: { type: 'json_object' },
		temperature: 0.92,
		max_tokens: 350
	});

	const parsed = safeJson(completion.choices[0]?.message?.content);
	let suggestions: RizzSuggestion[] = [];
	if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
		suggestions = parsed.suggestions.map((item: any) => ({
			tone: String(item.tone || 'Reply'),
			text: String(item.text || '')
		}));
	} else if (Array.isArray(parsed.options)) {
		const tones = ['Friendly', 'Playful tease', 'Bold'];
		suggestions = parsed.options.map((t: string, idx: number) => ({
			tone: tones[idx] || 'Suggestion',
			text: String(t)
		}));
	} else {
		suggestions = localRizzItems();
	}

	const model = completion.model || targetModel;
	const promptTokens = completion.usage?.prompt_tokens ?? 0;
	const completionTokens = completion.usage?.completion_tokens ?? 0;
	const totalTokens = completion.usage?.total_tokens ?? (promptTokens + completionTokens);
	const costUSD = estimateCostUSD(model, promptTokens, completionTokens);

	return {
		suggestions,
		options: suggestions.map((s) => s.text),
		simulated: false,
		usage: {
			model,
			promptTokens,
			completionTokens,
			totalTokens,
			costUSD
		},
		ragContext: ragMatches
	};
}

function localRizzItems(): RizzSuggestion[] {
	return [
		{ tone: 'Friendly', text: "There's only one way to find out" },
		{ tone: 'Playful tease', text: "I do, but you're gonna have to convince me you're worth my effort" },
		{ tone: 'Bold', text: "I'd love to show you just how well I can" }
	];
}


