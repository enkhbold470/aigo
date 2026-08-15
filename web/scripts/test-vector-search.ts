import {
	queryVectorDB,
	cosineSimilarity,
	generateSemanticVector,
	getVectorDbStats,
	getAllVectorItems,
	VECTOR_KNOWLEDGE_BASE
} from '../src/lib/server/vectorDb';

function normalize(vec: number[]): number[] {
	const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
	return mag > 0 ? vec.map((v) => v / mag) : vec;
}

async function runTests() {
	console.log('================================================================');
	console.log('RUNNING VECTOR DB & RAG RETRIEVAL ENGINE TESTS');
	console.log('================================================================\n');

	let passedTests = 0;
	let totalTests = 0;

	function assert(desc: string, condition: boolean, details?: unknown) {
		totalTests++;
		if (condition) {
			console.log(`[PASS] ${desc}`);
			passedTests++;
		} else {
			console.error(`[FAIL] ${desc}`);
			if (details !== undefined) console.error('   Details:', details);
		}
	}

	// 1. Vector math
	console.log('--- 1. Vector Math & Cosine Similarity ---');
	const vecA = normalize([1, 0, 0]);
	const vecB = normalize([1, 0, 0]);
	const vecC = normalize([0, 1, 0]);
	const vecD = normalize([-1, 0, 0]);

	assert('Identical vectors similarity == 1.0', Math.abs(cosineSimilarity(vecA, vecB) - 1) < 1e-4);
	assert('Orthogonal vectors similarity == 0.0', Math.abs(cosineSimilarity(vecA, vecC)) < 1e-4);
	assert('Opposite vectors similarity == -1.0', Math.abs(cosineSimilarity(vecA, vecD) + 1) < 1e-4);
	assert('Zero-magnitude vector does not produce NaN', !Number.isNaN(cosineSimilarity([0, 0, 0], vecA)));

	// 2. Local semantic embeddings
	console.log('\n--- 2. Local Semantic Embedding Generator ---');
	const embCooking1 = generateSemanticVector('i suck at cooking dinner');
	const embCooking2 = generateSemanticVector('bad at cooking in the kitchen');
	const embGym = generateSemanticVector('bench press heavy squat workout');

	const simRelated = cosineSimilarity(embCooking1, embCooking2);
	const simUnrelated = cosineSimilarity(embCooking1, embGym);

	assert('Embedding has fixed 64 dimensions', embCooking1.length === 64, embCooking1.length);
	assert('Embedding is unit-normalized', Math.abs(Math.sqrt(embCooking1.reduce((s, v) => s + v * v, 0)) - 1) < 1e-6);
	assert('Related concepts score above unrelated', simRelated > simUnrelated, { simRelated, simUnrelated });
	assert('Empty input is handled without throwing', generateSemanticVector('').length === 64);

	// 3. Knowledge base integrity
	console.log('\n--- 3. Knowledge Base Integrity ---');
	const stats = getVectorDbStats();
	const ids = VECTOR_KNOWLEDGE_BASE.map((i) => i.id);

	assert('Knowledge base is non-empty', VECTOR_KNOWLEDGE_BASE.length > 0, stats.totalVectors);
	assert('All entry ids are unique', new Set(ids).size === ids.length);
	assert('Every entry is pre-embedded', VECTOR_KNOWLEDGE_BASE.every((i) => i.vector?.length === 64));
	assert('Every entry has a line and tags', VECTOR_KNOWLEDGE_BASE.every((i) => i.line && i.tags.length > 0));
	assert('flirtLevel is within 1-5', VECTOR_KNOWLEDGE_BASE.every((i) => i.flirtLevel >= 1 && i.flirtLevel <= 5));
	assert('getAllVectorItems matches knowledge base size', getAllVectorItems().length === VECTOR_KNOWLEDGE_BASE.length);
	console.log(`   ${stats.totalVectors} vectors | ${stats.categories.length} categories | ${stats.tones.length} tones`);

	// 4. Query contract
	console.log('\n--- 4. Query Contract (topK, minSimilarity, metadata boosts) ---');
	const topKResults = await queryVectorDB({ text: 'cooking dinner', topK: 3, minSimilarity: 0 });
	assert('topK caps the result count', topKResults.length <= 3, topKResults.length);

	const sorted = topKResults.every((r, i) => i === 0 || topKResults[i - 1].similarity >= r.similarity);
	assert('Results are sorted by descending similarity', sorted);

	const highFloor = await queryVectorDB({ text: 'cooking dinner', topK: 10, minSimilarity: 0.99 });
	assert('High minSimilarity filters out weak matches', highFloor.length < VECTOR_KNOWLEDGE_BASE.length);

	const toneBoosted = await queryVectorDB({ text: 'cooking', tone: 'Playful tease', topK: 5, minSimilarity: 0 });
	assert(
		'Matching tone raises the score multiplier above 1',
		toneBoosted.some((r) => (r.scoreMultiplier ?? 1) > 1),
		toneBoosted.map((r) => r.scoreMultiplier)
	);

	const emptyQuery = await queryVectorDB({ text: '', topK: 3, minSimilarity: 0 });
	assert('Empty query still returns results without throwing', Array.isArray(emptyQuery));

	// 5. End-to-end retrieval scenarios
	console.log('\n--- 5. Semantic RAG Retrieval Scenarios ---');
	const scenarios: Array<{ name: string; text: string; tone?: string; flirtLevel?: number; expectedTag: string }> = [
		{
			name: 'Cooking fail / burnt pan',
			text: 'i tried making pasta and literally burnt the pan i suck at cooking',
			tone: 'Playful tease',
			expectedTag: 'cooking'
		},
		{
			name: 'Matcha latte morning',
			text: 'grabbing my morning iced matcha latte before class',
			expectedTag: 'matcha'
		},
		{
			name: 'Travel / vacation photo',
			text: 'just landed in italy, the sunset at the beach is unreal on this trip',
			flirtLevel: 3,
			expectedTag: 'travel'
		},
		{
			name: 'Mario Kart / gaming challenge',
			text: 'i will destroy you at mario kart, gaming is my whole personality',
			expectedTag: 'mario kart'
		},
		{
			name: 'Instagram story reaction',
			text: 'replying to your instagram story photo',
			expectedTag: 'instagram'
		}
	];

	for (const sc of scenarios) {
		const results = await queryVectorDB({
			text: sc.text,
			tone: sc.tone,
			flirtLevel: sc.flirtLevel,
			topK: 4,
			minSimilarity: 0
		});
		const top = results[0];
		const hasExpectedTag = results.some((r) => r.tags.includes(sc.expectedTag));

		console.log(`\n  Scenario: "${sc.name}"`);
		if (top) {
			console.log(`  Top hit [${(top.similarity * 100).toFixed(0)}%]: "${top.line}"`);
			console.log(`     ${top.category} | ${top.tone} | flirt ${top.flirtLevel}/5`);
		}
		assert(`Scenario [${sc.name}] surfaced tag "${sc.expectedTag}"`, hasExpectedTag, results.map((r) => r.tags));
	}

	console.log('\n================================================================');
	console.log(
		`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`
	);
	console.log('================================================================\n');

	if (passedTests !== totalTests) process.exit(1);
}

runTests().catch((err) => {
	console.error('Fatal error running tests:', err);
	process.exit(1);
});
