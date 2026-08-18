import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

export const DEFAULT_MODEL = 'google/gemini-3-5-flash-lite';
export const OPENAI_FALLBACK_MODEL = 'gpt-4o-mini';

/** True when the SDK will talk to api.openai.com (unset BASE_URL uses that default). */
export function isOpenAIHost(baseUrl?: string): boolean {
	if (!baseUrl) return true;
	try {
		const host = new URL(baseUrl).hostname;
		return host === 'api.openai.com' || host.endsWith('.openai.com');
	} catch {
		return false;
	}
}

/**
 * OpenAI rejects provider-prefixed ids (`google/gemini-...`) with
 * `400 invalid model ID`. Gateways like Arkor accept them. Map the
 * incompatible ones onto a vision-capable OpenAI default.
 */
export function resolveModelForGateway(model: string, baseUrl?: string): string {
	const requested = model.trim();
	if (!requested) return isOpenAIHost(baseUrl) ? OPENAI_FALLBACK_MODEL : DEFAULT_MODEL;
	if (!isOpenAIHost(baseUrl)) return requested;
	if (requested.includes('/') || /gemini|claude|grok|llama|mistral/i.test(requested)) {
		return OPENAI_FALLBACK_MODEL;
	}
	return requested;
}

/**
 * The OpenAI SDK appends `/chat/completions` itself, so BASE_URL must point at
 * the API root. Accepts a bare host, a `/v1` root, or a full endpoint path and
 * always returns the `/v1` root. Returns undefined when unset so the SDK falls
 * back to api.openai.com.
 */
export function normalizeBaseUrl(raw: string | undefined | null): string | undefined {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) return undefined;

	let url: URL;
	try {
		url = new URL(trimmed);
	} catch {
		return undefined;
	}

	// Drop the endpoint suffix the SDK adds back, then collapse to the version root.
	let path = url.pathname.replace(/\/+$/, '');
	path = path.replace(/\/(chat\/completions|completions|responses|embeddings)$/, '');
	if (!/\/v\d+$/.test(path)) path = `${path}/v1`;

	return `${url.origin}${path.replace(/\/{2,}/g, '/')}`;
}

export function getApiKey(): string | undefined {
	return env.OPENAI_API_KEY?.trim() || undefined;
}

export function getBaseUrl(): string | undefined {
	return normalizeBaseUrl(env.BASE_URL ?? env.OPENAI_BASE_URL);
}

export function getModel(): string {
	return resolveModelForGateway(env.AI_MODEL?.trim() || DEFAULT_MODEL, getBaseUrl());
}

/** Model used for image/vision requests; falls back to the primary model. */
export function getVisionModel(): string {
	const requested = env.AI_VISION_MODEL?.trim();
	if (requested) return resolveModelForGateway(requested, getBaseUrl());
	return getModel();
}

export function createClient(): OpenAI | null {
	const apiKey = getApiKey();
	if (!apiKey) return null;

	const baseURL = getBaseUrl();
	return new OpenAI(baseURL ? { apiKey, baseURL } : { apiKey });
}

type Rate = { input: number; output: number };

// USD per 1M tokens. Gateway-hosted open models are far cheaper than GPT-4o,
// so the old hardcoded gpt-4o-mini rates over-reported cost by ~10x.
const RATES: Array<{ match: RegExp; rate: Rate }> = [
	{ match: /gemini-3[.-]7|gemini-3[.-]5-pro/i, rate: { input: 0.3, output: 2.5 } },
	{ match: /gemini.*flash-lite/i, rate: { input: 0.05, output: 0.2 } },
	{ match: /gemini.*flash/i, rate: { input: 0.1, output: 0.4 } },
	{ match: /gemma|unsloth/i, rate: { input: 0.03, output: 0.06 } },
	{ match: /gpt-4o-mini|4o-mini/i, rate: { input: 0.15, output: 0.6 } },
	{ match: /gpt-4o/i, rate: { input: 2.5, output: 10 } }
];

export function rateFor(model: string): Rate {
	return RATES.find((r) => r.match.test(model))?.rate ?? { input: 0.05, output: 0.2 };
}

export function estimateCostUSD(
	model: string,
	promptTokens: number,
	completionTokens: number
): number {
	const { input, output } = rateFor(model);
	return promptTokens * (input / 1_000_000) + completionTokens * (output / 1_000_000);
}
