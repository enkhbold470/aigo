import type { Handle } from '@sveltejs/kit';

const cors: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/') && event.request.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers: cors });
	}

	const response = await resolve(event);

	if (event.url.pathname.startsWith('/api/')) {
		for (const [key, value] of Object.entries(cors)) {
			response.headers.set(key, value);
		}
	}

	return response;
};
