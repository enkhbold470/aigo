import { json } from '@sveltejs/kit';
import { analyzeClipboard } from '$lib/server/ai';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const result = await analyzeClipboard(body.text ?? '', body.context ?? '');
		return json(result);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to analyze clipboard';
		return json({ error: message }, { status: 500 });
	}
}
