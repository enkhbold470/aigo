import { json } from '@sveltejs/kit';
import { aiConfigSummary, hasOpenAIKey } from '$lib/server/ai';

export function GET() {
	const ai = aiConfigSummary();
	return json({
		status: 'ok',
		service: 'AIGo AI Backend',
		openai: hasOpenAIKey(),
		ai,
		timestamp: Date.now()
	});
}
