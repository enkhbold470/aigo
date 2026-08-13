import { json } from '@sveltejs/kit';
import { completePhrase } from '$lib/server/ai';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const result = await completePhrase(body.before ?? '', body.after ?? '');
		return json(result);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to complete phrase';
		return json({ error: message }, { status: 500 });
	}
}
