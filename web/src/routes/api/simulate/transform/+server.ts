import { json } from '@sveltejs/kit';
import { transformText } from '$lib/server/ai';

export async function POST({ request }) {
	const body = await request.json();
	const result = await transformText(body.text ?? '', body.action ?? 'fix', body.customPrompt ?? '');
	return json({ transformedText: result.transformedText, simulated: result.simulated });
}
