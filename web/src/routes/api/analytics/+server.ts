import { json } from '@sveltejs/kit';
import { getAnalyticsSummary } from '$lib/server/logger';

export async function GET() {
	const summary = getAnalyticsSummary();
	return json(summary);
}
