import { json } from '@sveltejs/kit';
import { analyzeClipboard } from '$lib/server/ai';

export async function POST({ request }) {
	const body = await request.json();
	const result = await analyzeClipboard(body.text ?? '', body.context ?? '');
	return json(result);
}
