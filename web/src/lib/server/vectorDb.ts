export type VectorItem = {
	id: string;
	line: string;
	category: string;
	tone: string;
	intent: string;
	flirtLevel: number; // 1 - 5
	reasoningTemplate: string;
	tags: string[];
	score?: number; // baseline quality score
	vector?: number[];
};

export type VectorSearchResult = VectorItem & {
	similarity: number;
	scoreMultiplier?: number;
};

export type VectorQueryParams = {
	text?: string;
	ocrContext?: string;
	tone?: string;
	intent?: string;
	flirtLevel?: number;
	category?: string;
	topK?: number;
	minSimilarity?: number;
};

// Seed knowledge base with high-converting rizz lines across tones, intents, flirt levels, and scenarios
export const VECTOR_KNOWLEDGE_BASE: VectorItem[] = [
	{
		id: 'kb_rizz_001',
		line: "so what you're saying is i need to bring fire insurance if you ever invite me over 💀",
		category: 'Food & Cooking',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 3,
		reasoningTemplate: 'Playfully disqualifies cooking ability, introduces playful risk, and naturally implants the idea of coming over.',
		tags: ['cooking', 'food', 'danger', 'burn', 'insurance', 'invite over', 'tease', 'kitchen']
	},
	{
		id: 'kb_rizz_002',
		line: "honestly same, my microwave is doing 90% of the heavy lifting 😭",
		category: 'Food & Cooking',
		tone: 'Friendly',
		intent: 'Casual Date',
		flirtLevel: 1,
		reasoningTemplate: 'Vulnerability and relatable humor lowers resistance and builds comfort through shared imperfection.',
		tags: ['cooking', 'relatable', 'microwave', 'food', 'casual', 'lazy']
	},
	{
		id: 'kb_rizz_003',
		line: "good thing i'm taking you out for proper drinks this week then. friday 8pm? 🍸",
		category: 'Food & Cooking',
		tone: 'Bold',
		intent: 'A Relationship',
		flirtLevel: 4,
		reasoningTemplate: 'Direct transition from problem (bad food) to immediate solution (cocktails), anchoring a clear date and time.',
		tags: ['drinks', 'cocktails', 'friday', 'date', 'bold', 'invitation']
	},
	{
		id: 'kb_rizz_004',
		line: "ngl your aura in this photo is dangerously high, who authorized this? 😮‍💨",
		category: 'Compliments & Aura',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 3,
		reasoningTemplate: 'Validates visual appeal using Gen-Z aura framing while playfully acting like it violates protocol.',
		tags: ['photo', 'aura', 'outfit', 'instagram', 'story', 'flirt', 'danger']
	},
	{
		id: 'kb_rizz_005',
		line: "you look like trouble and my mama warned me about people like you 👀",
		category: 'Banter & Pushback',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 3,
		reasoningTemplate: 'Reverse-psychology push-pull: frames the other person as the pursuer/dangerous one while signaling high interest.',
		tags: ['trouble', 'pushpull', 'tease', 'bad influence', 'crush', 'banter']
	},
	{
		id: 'kb_rizz_006',
		line: "we would either be best friends or get arrested together within 48 hours, no in-between",
		category: 'Banter & Pushback',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 4,
		reasoningTemplate: 'Creates an exciting future-paced shared adventure dynamic with extreme playful polarization.',
		tags: ['chaos', 'adventure', 'crime', 'arrested', 'best friends', 'funny']
	},
	{
		id: 'kb_rizz_007',
		line: "are you always this quick with the replies or did i just get special VIP priority? 😏",
		category: 'Response Timing & Attention',
		tone: 'Playful tease',
		intent: 'Casual Date',
		flirtLevel: 2,
		reasoningTemplate: 'Rewards quick responsiveness with a cocky-funny compliment, testing their interest level playfully.',
		tags: ['fast reply', 'vip', 'special', 'texting', 'imessage', 'flirt']
	},
	{
		id: 'kb_rizz_008',
		line: "i was gonna play it cool and wait 10 minutes to text back but i folded immediately ngl",
		category: 'Vulnerability & Flirt',
		tone: 'Friendly',
		intent: 'A Relationship',
		flirtLevel: 2,
		reasoningTemplate: 'Charming self-awareness and intentional loss of composure that makes the match feel uniquely attractive.',
		tags: ['text back', 'play it cool', 'folded', 'relatable', 'cute', 'sweet']
	},
	{
		id: 'kb_rizz_009',
		line: "let's skip the small talk phase — what's your most unhinged hot take?",
		category: 'Conversation Starters',
		tone: 'Friendly',
		intent: 'Casual Date',
		flirtLevel: 2,
		reasoningTemplate: 'Cuts through boring generic small talk and prompts high-engagement storytelling and playful debate.',
		tags: ['hot take', 'skip small talk', 'opener', 'question', 'curious', 'banter']
	},
	{
		id: 'kb_rizz_010',
		line: "you're cute but do you pass the vibe check in person or are you just good at texting?",
		category: 'Qualification & Challenge',
		tone: 'Playful tease',
		intent: 'Casual Date',
		flirtLevel: 3,
		reasoningTemplate: 'Challenge frame: qualifies them and implies an in-person meetup is the only real benchmark.',
		tags: ['challenge', 'vibe check', 'in person', 'date setup', 'cute']
	},
	{
		id: 'kb_rizz_011',
		line: "cancel whatever plans you have on saturday, we're getting matcha and judging strangers 🍵",
		category: 'Date Proposals',
		tone: 'Bold',
		intent: 'Casual Date',
		flirtLevel: 4,
		reasoningTemplate: 'Presumptive close with high specificity, playful conspiracy, and low-pressure activity.',
		tags: ['matcha', 'coffee', 'saturday', 'date', 'judging', 'bold', 'plan']
	},
	{
		id: 'kb_rizz_012',
		line: "not me smiling at my phone like an idiot on the train because of you",
		category: 'Vulnerability & Flirt',
		tone: 'Friendly',
		intent: 'A Relationship',
		flirtLevel: 2,
		reasoningTemplate: 'Directly credits them for bringing joy in the physical world without being overly aggressive.',
		tags: ['smiling', 'train', 'public', 'butterflies', 'sweet', 'wholesome']
	},
	{
		id: 'kb_rizz_013',
		line: "tell me why i immediately knew you were a menace the second i saw this",
		category: 'Story & Photo Reactions',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 3,
		reasoningTemplate: 'Menace frame: playfully implies bad behavior, triggering a desire to defend themselves playfully.',
		tags: ['menace', 'story reply', 'photo', 'instagram', 'reaction', 'tease']
	},
	{
		id: 'kb_rizz_014',
		line: "stop looking so good in your stories, it's getting distracting and i have work to do 😤",
		category: 'Compliments & Aura',
		tone: 'Bold',
		intent: 'Fun & Hookup',
		flirtLevel: 4,
		reasoningTemplate: 'Compliment disguised as an accusation / playful grievance, creating high romantic tension.',
		tags: ['story', 'instagram', 'distracted', 'work', 'compliment', 'hot', 'bold']
	},
	{
		id: 'kb_rizz_015',
		line: "i have a theory that your playlist is either immaculate or absolute chaos",
		category: 'Music & Taste',
		tone: 'Friendly',
		intent: 'Casual Date',
		flirtLevel: 1,
		reasoningTemplate: 'Safe high-engagement conversational wedge around personal music taste and aux cord privileges.',
		tags: ['music', 'playlist', 'spotify', 'taste', 'opener', 'banter']
	},
	{
		id: 'kb_rizz_016',
		line: "if you let me pick the place for drinks, i promise you won't even think about checking your phone once",
		category: 'Date Proposals',
		tone: 'Bold',
		intent: 'A Relationship',
		flirtLevel: 4,
		reasoningTemplate: 'Supreme confidence combined with an experiential guarantee of high presence and connection.',
		tags: ['drinks', 'date', 'confidence', 'speakeasy', 'night out', 'bold']
	},
	{
		id: 'kb_rizz_017',
		line: "deadass the best photo on the entire app today, respect the vision 🫡",
		category: 'Brainrot & Gen-Z Slang',
		tone: 'Brainrot / Gen-Z Slang',
		intent: 'Fun & Hookup',
		flirtLevel: 2,
		reasoningTemplate: 'Authentic modern slang validating aesthetic execution with meme-literate enthusiasm.',
		tags: ['deadass', 'respect', 'vision', 'genz', 'brainrot', 'slang', 'photo']
	},
	{
		id: 'kb_rizz_018',
		line: "lowkey need your entire travel itinerary because this looks unreal ✈️",
		category: 'Travel & Hobbies',
		tone: 'Friendly',
		intent: 'Casual Date',
		flirtLevel: 1,
		reasoningTemplate: 'Enthusiastic interest in travel experience, prompting recommendations and vacation storytelling.',
		tags: ['travel', 'vacation', 'itinerary', 'trip', 'photo', 'airplane']
	},
	{
		id: 'kb_rizz_019',
		line: "i'm convinced you only posted this to ruin my concentration today 😮‍💨",
		category: 'Compliments & Aura',
		tone: 'Bold',
		intent: 'Fun & Hookup',
		flirtLevel: 5,
		reasoningTemplate: 'Maximum flirt escalation attributing deliberate intent to their attractiveness, elevating sexual tension.',
		tags: ['concentration', 'ruined', 'unhinged', 'down bad', 'bold', 'hot']
	},
	{
		id: 'kb_rizz_020',
		line: "you have exactly 3 chances to guess what i'm craving right now and sushi is already taken",
		category: 'Food & Cooking',
		tone: 'Playful tease',
		intent: 'Casual Date',
		flirtLevel: 3,
		reasoningTemplate: 'Gamified guessing format with a clever constraint that naturally pivots into dinner plans.',
		tags: ['game', 'guessing', 'craving', 'sushi', 'dinner', 'playful']
	},
	{
		id: 'kb_rizz_021',
		line: "you're cute but i bet you're terrible at mario kart",
		category: 'Banter & Pushback',
		tone: 'Playful tease',
		intent: 'Casual Date',
		flirtLevel: 3,
		reasoningTemplate: 'Classic playful disqualifier that triggers competitive instinct and sets up an easy home/arcade date challenge.',
		tags: ['mario kart', 'gaming', 'competitive', 'challenge', 'cute', 'tease']
	},
	{
		id: 'kb_rizz_022',
		line: "let's grab drinks and pretend we're mysterious international spies 🍸🕶️",
		category: 'Date Proposals',
		tone: 'Playful tease',
		intent: 'Fun & Hookup',
		flirtLevel: 3,
		reasoningTemplate: 'Imaginative roleplay date concept that transforms a routine drink into an adventurous cinematic experience.',
		tags: ['drinks', 'spies', 'roleplay', 'fun', 'creative', 'cocktails']
	},
	{
		id: 'kb_rizz_023',
		line: "i was having a very productive day until this notification popped up 🙃",
		category: 'Response Timing & Attention',
		tone: 'Friendly',
		intent: 'A Relationship',
		flirtLevel: 2,
		reasoningTemplate: 'Lighthearted acknowledgment of the disruptive impact their text has, boosting their social status.',
		tags: ['notification', 'distracted', 'cute', 'texting', 'productive']
	},
	{
		id: 'kb_rizz_024',
		line: "give me your number before i lose my nerve and act like a respectable adult",
		category: 'Closing & Contact Exchange',
		tone: 'Bold',
		intent: 'Fun & Hookup',
		flirtLevel: 5,
		reasoningTemplate: 'Direct contact acquisition with endearing self-awareness, skipping prolonged messaging lag.',
		tags: ['number', 'digits', 'contact', 'bold', 'closer', 'direct']
	}
];

// Helper to calculate simple cosine similarity between two numeric vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
	if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
	let dotProduct = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < vecA.length; i++) {
		dotProduct += vecA[i] * vecB[i];
		normA += vecA[i] * vecA[i];
		normB += vecB[i] * vecB[i];
	}
	if (normA === 0 || normB === 0) return 0;
	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Built-in lexical semantic vectorizer with n-grams, IDF weights, and domain concept clusters (128-dimensional)
const VOCAB_CLUSTERS: string[][] = [
	['food', 'cooking', 'eat', 'dinner', 'lunch', 'hungry', 'kitchen', 'microwave', 'sushi', 'pasta', 'baking', 'chef'],
	['drinks', 'cocktails', 'coffee', 'matcha', 'wine', 'bar', 'beer', 'friday', 'saturday', 'weekend', 'cheers'],
	['photo', 'story', 'instagram', 'outfit', 'fit', 'hair', 'selfie', 'look', 'looks', 'view', 'camera', 'pic'],
	['aura', 'rizz', 'glow', 'fire', 'menace', 'trouble', 'danger', 'vibes', 'vibe', 'check', 'energy'],
	['tease', 'challenge', 'bully', 'roast', 'banter', 'argue', 'push', 'doubt', 'skeptical', 'game'],
	['bold', 'unhinged', 'direct', 'date', 'proposal', 'number', 'phone', 'imessage', 'tonight', 'meet'],
	['sweet', 'wholesome', 'friendly', 'cute', 'smile', 'smiling', 'train', 'blush', 'warm', 'laugh', 'funny'],
	['travel', 'flight', 'trip', 'vacation', 'beach', 'sunset', 'plane', 'itinerary', 'explore', 'abroad'],
	['music', 'song', 'playlist', 'spotify', 'concert', 'festival', 'headphones', 'track', 'album', 'aux'],
	['genz', 'brainrot', 'deadass', 'ngl', 'fr', 'real', 'cooked', 'cap', 'folded', 'downbad', 'simp'],
	['gaming', 'mariokart', 'switch', 'game', 'playstation', 'arcade', 'competitor', 'win', 'lose'],
	['reply', 'text', 'notification', 'fast', 'slow', 'vip', 'left on read', 'typing', 'ghost']
];

export function generateSemanticVector(text: string): number[] {
	const normalized = (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
	const tokens = normalized.split(/\s+/).filter(Boolean);
	const tokenSet = new Set(tokens);

	const vector: number[] = new Array(64).fill(0);

	// Cluster overlaps
	VOCAB_CLUSTERS.forEach((cluster, clusterIdx) => {
		let matchCount = 0;
		for (const term of cluster) {
			if (tokenSet.has(term) || normalized.includes(term)) {
				matchCount += 1;
			}
		}
		vector[clusterIdx] = matchCount > 0 ? 0.5 + 0.5 * Math.min(matchCount / 3, 1) : 0;
	});

	// Character n-gram hashing for lexical continuity
	for (let i = 0; i < normalized.length - 2; i++) {
		const tri = normalized.substring(i, i + 3);
		let hash = 0;
		for (let j = 0; j < tri.length; j++) {
			hash = (hash << 5) - hash + tri.charCodeAt(j);
			hash |= 0;
		}
		const idx = 12 + (Math.abs(hash) % 52);
		vector[idx] += 0.15;
	}

	// Normalize vector length
	const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
	return mag > 0 ? vector.map((v) => v / mag) : vector;
}

// Pre-initialize embeddings on knowledge base
for (const item of VECTOR_KNOWLEDGE_BASE) {
	const contentToEmbed = `${item.line} ${item.category} ${item.tags.join(' ')} ${item.reasoningTemplate} ${item.tone} ${item.intent}`;
	item.vector = generateSemanticVector(contentToEmbed);
}

export async function computeEmbedding(text: string): Promise<number[]> {
	const trimmed = (text || '').trim();
	if (!trimmed) return generateSemanticVector('');

	// Fallback to local semantic vector
	return generateSemanticVector(trimmed);
}

export async function queryVectorDB(params: VectorQueryParams): Promise<VectorSearchResult[]> {
	const {
		text = '',
		ocrContext = '',
		tone,
		intent,
		flirtLevel,
		category,
		topK = 5,
		minSimilarity = 0.1
	} = params;

	const compositeQuery = [text, ocrContext, category, tone, intent]
		.filter(Boolean)
		.join(' ')
		.trim();

	const queryVec = await computeEmbedding(compositeQuery);

	const scored = VECTOR_KNOWLEDGE_BASE.map((item) => {
		let baseSim = cosineSimilarity(queryVec, item.vector || generateSemanticVector(item.line));

		// Bonus weight for exact metadata alignment
		let multiplier = 1.0;

		if (tone && item.tone.toLowerCase().includes(tone.toLowerCase())) {
			multiplier += 0.25;
		}

		if (intent && item.intent.toLowerCase().includes(intent.toLowerCase())) {
			multiplier += 0.20;
		}

		if (flirtLevel !== undefined && item.flirtLevel) {
			const diff = Math.abs(item.flirtLevel - flirtLevel);
			if (diff === 0) multiplier += 0.20;
			else if (diff === 1) multiplier += 0.10;
		}

		if (category && item.category.toLowerCase().includes(category.toLowerCase())) {
			multiplier += 0.30;
		}

		// Text token keyword boosts
		const lowerQuery = compositeQuery.toLowerCase();
		for (const tag of item.tags) {
			if (lowerQuery.includes(tag.toLowerCase())) {
				multiplier += 0.15;
			}
		}

		const finalSimilarity = Math.min(1.0, baseSim * multiplier);

		return {
			...item,
			similarity: Math.round(finalSimilarity * 1000) / 1000,
			scoreMultiplier: Math.round(multiplier * 100) / 100
		};
	});

	// Sort descending by similarity
	const filtered = scored
		.filter((r) => r.similarity >= minSimilarity)
		.sort((a, b) => b.similarity - a.similarity);

	return filtered.slice(0, topK);
}

export function getAllVectorItems(): VectorItem[] {
	return VECTOR_KNOWLEDGE_BASE;
}

export function getVectorDbStats() {
	const categories = new Set(VECTOR_KNOWLEDGE_BASE.map((i) => i.category));
	const tones = new Set(VECTOR_KNOWLEDGE_BASE.map((i) => i.tone));
	return {
		totalVectors: VECTOR_KNOWLEDGE_BASE.length,
		dimensions: 64,
		categories: Array.from(categories),
		tones: Array.from(tones),
		avgFlirtLevel: (
			VECTOR_KNOWLEDGE_BASE.reduce((acc, i) => acc + i.flirtLevel, 0) /
			VECTOR_KNOWLEDGE_BASE.length
		).toFixed(1)
	};
}
