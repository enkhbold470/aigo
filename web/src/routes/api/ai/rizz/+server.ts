import { json } from '@sveltejs/kit';
import { generateRizz } from '$lib/server/ai';
import { logRizzRequest } from '$lib/server/logger';

export async function POST({ request, getClientAddress }) {
	const startTime = Date.now();
	let clientIp = '127.0.0.1';
	try {
		clientIp = getClientAddress();
	} catch {
		// Ignore if unavailable
	}

	try {
		const body = await request.json();
		const imageBase64: string | null = body.imageBase64 ?? null;
		const context: string = body.context ?? '';
		const personalization = body.personalization;

		const result = await generateRizz(imageBase64, context, personalization);

		// Extract small image preview for log record (if image provided)
		let imagePreviewBase64: string | undefined;
		if (imageBase64) {
			imagePreviewBase64 = imageBase64.length > 500 ? imageBase64.substring(0, 300) + '...' : imageBase64;
		}

		// Log request and response locally with token usage and cost metrics
		logRizzRequest({
			hasImage: Boolean(imageBase64),
			imagePreviewBase64,
			context,
			personalization,
			suggestions: result.suggestions,
			simulated: result.simulated,
			durationMs: Date.now() - startTime,
			clientIp,
			usage: result.usage
		});

		return json(result);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to generate rizz';
		return json({ error: message }, { status: 500 });
	}
}
