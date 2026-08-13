import { json } from '@sveltejs/kit';
import { analyzeScreenshot } from '$lib/server/ai';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const imageBase64 = body.imageBase64 ?? '';
		if (!imageBase64) {
			return json({ error: 'Missing imageBase64 parameter' }, { status: 400 });
		}
		const result = await analyzeScreenshot(imageBase64, body.tone ?? 'friendly & direct');
		return json(result);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to analyze screenshot';
		return json({ error: message }, { status: 500 });
	}
}
