import { json } from '@sveltejs/kit';
import { generateRizz } from '$lib/server/ai';

export async function POST({ request }) {
	try {
		const body = await request.json();
		const result = await generateRizz(
			body.imageBase64 ?? null,
			body.context ?? '',
			body.personalization
		);
		return json(result);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to generate rizz';
		return json({ error: message }, { status: 500 });
	}
}
