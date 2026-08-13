import { json } from '@sveltejs/kit';
import { getRizzLogs } from '$lib/server/logger';

export async function GET({ url }) {
	const limitParam = url.searchParams.get('limit');
	const limit = limitParam ? parseInt(limitParam, 10) : 50;

	const logs = getRizzLogs(limit);
	return json({
		total: logs.length,
		logs
	});
}
