import { json } from '@sveltejs/kit';
import { transformText } from '$lib/server/ai';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const result = await transformText(body.text ?? '', body.action ?? 'fix', body.customPrompt ?? '');
		return json({
			transformedText: result.transformedText,
			originalText: body.text ?? '',
			action: body.action ?? 'fix',
			simulated: result.simulated
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to transform text';
		return json({ error: message }, { status: 500 });
	}
}
