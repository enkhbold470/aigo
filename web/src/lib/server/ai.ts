import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

export type Suggestion = {
	label: string;
	text: string;
	icon?: string;
	tone?: string;
};

function client(): OpenAI | null {
	const apiKey = env.OPENAI_API_KEY;
	if (!apiKey) return null;
	return new OpenAI({ apiKey });
}

export function hasOpenAIKey(): boolean {
	return Boolean(env.OPENAI_API_KEY);
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
		model: 'gpt-4o-mini',
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
		model: 'gpt-4o-mini',
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
		model: 'gpt-4o-mini',
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
		model: 'gpt-4o-mini',
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
}> {
	const openai = client();
	if (!openai) {
		const items = localRizzItems();
		return { suggestions: items, options: items.map((i) => i.text), simulated: true };
	}

	const gender = personalization?.gender || 'Male';
	const sexuality = personalization?.sexuality || 'Straight';
	const age = personalization?.age || 22;
	const intent = personalization?.intent || 'Fun & Hookup';
	const platform = personalization?.platform || 'iMessage';
	const casingStyle = personalization?.casingStyle || 'all lowercase';
	const toneStyle = personalization?.toneStyle || 'Brainrot / Gen-Z Slang';
	const flirtLevel = personalization?.flirtLevel || 3;

	const flirtLabels: Record<number, string> = {
		1: 'Mild & subtle flirting',
		2: 'Smooth & witty teasing',
		3: 'Confident & playful banter',
		4: 'Bold & direct flirt',
		5: 'Unhinged & down bad'
	};
	const flirtDesc = flirtLabels[flirtLevel] || 'Playful banter';

	const systemPrompt = `You are the world's sharpest, most observant dating & texting AI. You specialize in analyzing conversation screenshots and generating 3 DISTINCT, HIGH-CONVERTING replies.

SCREENSHOT & BUBBLE ANALYSIS INSTRUCTIONS:
1. LOCATE THE LATEST INCOMING MESSAGE (on the LEFT side of screenshot):
   - iMessage / IG / WhatsApp / Tinder / Hinge: Left grey/white bubbles = INCOMING message from crush/match. Right blue/green/purple = outgoing.
   - Find the VERY LAST message sent by the OTHER person. Your 3 replies MUST directly reference that specific message or photo!
2. STRICT TONE CONTRAST & NEGATIVE CONSTRAINTS (CRITICAL - DO NOT GENERATE SIMILAR TEXT!):

   • Option 1: "Friendly" (Role: Casual Banter & Relatable Callback)
     - Goal: Agree, validate, or add a funny relatable detail to their last message.
     - Negative Constraint: DO NOT tease them. DO NOT propose a date.
     - Example (if they say "i suck at cooking"): "honestly same, my microwave is doing 90% of the heavy lifting 😭"

   • Option 2: "Playful tease" (Role: Playful Callout & Skeptical Pushback)
     - Goal: Playfully call them out, act playfully skeptical, or challenge them.
     - Negative Constraint: DO NOT agree with them. DO NOT be sweet or complimentary.
     - Example (if they say "i suck at cooking"): "so what you're saying is i need to bring fire insurance if you ever invite me over 💀"

   • Option 3: "Bold" (Role: Direct Flirt & Power Move / Date Proposal)
     - Goal: Confident, direct flirt or concrete date proposal.
     - Negative Constraint: DO NOT make passive small talk. Skip to the move.
     - Example (if they say "i suck at cooking"): "good thing i'm taking you out for proper drinks this week then. friday 8pm? 🍸"

USER PROFILE & TUNING:
- Sender Profile: ${gender}, ${sexuality}, age ${age}
- Target Goal/Intent: ${intent}
- App Context: ${platform}
- Casing Rule: "${casingStyle}" (CRITICAL: if "all lowercase", write strictly in lowercase with ZERO capital letters. If "ALL CAPS", use upper case. If "standard casing", use normal capitalization.)
- Tone Style: "${toneStyle}" (If "Brainrot / Gen-Z Slang", use authentic current slang like "ngl", "fr", "lowkey", "cooked", "real", "deadass", "aura". If "Proper English", use clean grammar.)
- Flirt Intensity: ${flirtLevel}/5 (${flirtDesc})

OUTPUT REQUIREMENTS:
- Keep each reply short (1-2 sentences max).
- Match the casing "${casingStyle}" 100% strictly.
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

	const targetModel = 'gpt-4o-mini';
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

	// Calculate Usage & Cost based on current market rates ($0.15/1M input, $0.60/1M output for gpt-4o-mini)
	const model = completion.model || targetModel;
	const promptTokens = completion.usage?.prompt_tokens ?? 0;
	const completionTokens = completion.usage?.completion_tokens ?? 0;
	const totalTokens = completion.usage?.total_tokens ?? (promptTokens + completionTokens);

	const isMini = model.includes('mini');
	const inputRate = isMini ? 0.15 : 2.50; // $ per 1M tokens
	const outputRate = isMini ? 0.60 : 10.00; // $ per 1M tokens

	const costUSD = (promptTokens * (inputRate / 1_000_000)) + (completionTokens * (outputRate / 1_000_000));

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
		}
	};
}

function localRizzItems(): RizzSuggestion[] {
	return [
		{ tone: 'Friendly', text: "There's only one way to find out" },
		{ tone: 'Playful tease', text: "I do, but you're gonna have to convince me you're worth my effort" },
		{ tone: 'Bold', text: "I'd love to show you just how well I can" }
	];
}


