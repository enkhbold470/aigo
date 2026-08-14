import { json } from '@sveltejs/kit';
import { queryVectorDB, getVectorDbStats, getAllVectorItems } from '$lib/server/vectorDb';

export async function GET({ url }) {
	try {
		const q = url.searchParams.get('q') || url.searchParams.get('query') || '';
		const ocrContext = url.searchParams.get('ocr') || '';
		const tone = url.searchParams.get('tone') || undefined;
		const intent = url.searchParams.get('intent') || undefined;
		const category = url.searchParams.get('category') || undefined;
		const flirtLevelParam = url.searchParams.get('flirtLevel');
		const flirtLevel = flirtLevelParam ? parseInt(flirtLevelParam, 10) : undefined;
		const limitParam = url.searchParams.get('limit') || url.searchParams.get('topK');
		const topK = limitParam ? parseInt(limitParam, 10) : 10;
		const all = url.searchParams.get('all') === 'true';

		const stats = getVectorDbStats();

		if (all) {
			return json({
				total: stats.totalVectors,
				stats,
				results: getAllVectorItems()
			});
		}

		const results = await queryVectorDB({
			text: q,
			ocrContext,
			tone,
			intent,
			flirtLevel,
			category,
			topK,
			minSimilarity: 0.05
		});

		return json({
			query: q,
			count: results.length,
			stats,
			results
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Vector search error';
		return json({ error: message }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const text = body.text || body.query || '';
		const ocrContext = body.ocrContext || '';
		const tone = body.tone || undefined;
		const intent = body.intent || undefined;
		const flirtLevel = body.flirtLevel !== undefined ? Number(body.flirtLevel) : undefined;
		const category = body.category || undefined;
		const topK = body.limit || body.topK || 10;
		const minSimilarity = body.minSimilarity !== undefined ? Number(body.minSimilarity) : 0.05;

		const stats = getVectorDbStats();

		const results = await queryVectorDB({
			text,
			ocrContext,
			tone,
			intent,
			flirtLevel,
			category,
			topK,
			minSimilarity
		});

		return json({
			query: text,
			ocrContext,
			count: results.length,
			stats,
			results
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Vector search error';
		return json({ error: message }, { status: 500 });
	}
}
