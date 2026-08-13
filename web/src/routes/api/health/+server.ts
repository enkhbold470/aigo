import { json } from '@sveltejs/kit';
import { hasOpenAIKey } from '$lib/server/ai';

export function GET() {
	return json({
		status: 'ok',
		service: 'AIGo AI Backend',
		openai: hasOpenAIKey(),
		timestamp: Date.now()
	});
}
