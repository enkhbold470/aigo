import {
	queryVectorDb,
	cosineSimilarity,
	normalizeVector,
	generateLocalEmbedding,
	BM25Index,
	INITIAL_RIZZ_DOCUMENTS
} from '../src/lib/server/vectorDb';

async function runTests() {
	console.log('================================================================');
	console.log('🧪 RUNNING VECTOR DB & RAG RETRIEVAL ENGINE TESTS');
	console.log('================================================================\n');

	let passedTests = 0;
	let totalTests = 0;

	function assert(desc: string, condition: boolean, details?: any) {
		totalTests++;
		if (condition) {
			console.log(`✅ [PASS] ${desc}`);
			passedTests++;
		} else {
			console.error(`❌ [FAIL] ${desc}`);
			if (details) console.error('   Details:', details);
		}
	}

	// 1. Math: Cosine Similarity
	console.log('--- 1. Vector Math & Cosine Similarity Tests ---');
	const vecA = normalizeVector([1, 0, 0]);
	const vecB = normalizeVector([1, 0, 0]);
	const vecC = normalizeVector([0, 1, 0]);
	const vecD = normalizeVector([-1, 0, 0]);

	assert('Identical vectors cosine similarity == 1.0', Math.abs(cosineSimilarity(vecA, vecB) - 1.0) < 0.0001);
	assert('Orthogonal vectors cosine similarity == 0.0', Math.abs(cosineSimilarity(vecA, vecC)) < 0.0001);
	assert('Opposite vectors cosine similarity == -1.0', Math.abs(cosineSimilarity(vecA, vecD) - (-1.0)) < 0.0001);

	// 2. Local Fallback Embeddings
	console.log('\n--- 2. High-Dimensional Local Embedding Generator Tests ---');
	const embCooking1 = generateLocalEmbedding('i suck at cooking dinner');
	const embCooking2 = generateLocalEmbedding('bad at cooking in kitchen');
	const embGym = generateLocalEmbedding('workout bench press heavy gym lifting');

	const simCooking = cosineSimilarity(embCooking1, embCooking2);
	const simDiff = cosineSimilarity(embCooking1, embGym);
	assert('Related concepts have higher similarity than unrelated', simCooking > simDiff, {
		simCooking,
		simDiff
	});

	// 3. BM25 Lexical Index
	console.log('\n--- 3. BM25 Lexical Search Precision Tests ---');
	const bm25 = new BM25Index(INITIAL_RIZZ_DOCUMENTS);
	const bm25Results = bm25.score('burnt cooking kitchen microwave');
	assert('BM25 ranks cooking documents at top', bm25Results[0]?.doc.tags.includes('cooking'));

	// 4. End-to-End Query Scenarios
	console.log('\n--- 4. Semantic RAG Retrieval Scenarios ---');

	const scenarios = [
		{
			name: 'Cooking Fail / Burnt Food context',
			params: {
				detectedContext: "i tried making pasta and literally burnt the pan i suck at cooking 😭",
				tone: 'Playful tease'
			},
			expectedTag: 'cooking'
		},
		{
			name: 'Coffee / Matcha Latte context',
			params: {
				detectedContext: "grabbing my morning iced matcha latte before class",
				tone: 'Playful tease'
			},
			expectedTag: 'matcha'
		},
		{
			name: 'Gym / Leg Day context',
			params: {
				detectedContext: "cannot walk after that heavy leg day workout at the gym",
				flirtLevel: 2
			},
			expectedTag: 'gym'
		},
		{
			name: 'Slow Reply / Ghosting comeback',
			params: {
				detectedContext: "sorry for the late reply i was super busy the past 3 days",
				tone: 'Playful tease'
			},
			expectedTag: 'slow reply'
		},
		{
			name: 'Travel / Vacation photo compliment',
			params: {
				detectedContext: "just landed in Italy, the sunset at the beach is unreal",
				flirtLevel: 3
			},
			expectedTag: 'travel'
		}
	];

	for (const sc of scenarios) {
		const results = await queryVectorDb({ ...sc.params, limit: 3 });
		const top = results[0];
		const hasExpectedTag = results.some((r) => r.tags.includes(sc.expectedTag));

		console.log(`\n  Scenario: "${sc.name}"`);
		console.log(`  Context: "${sc.params.detectedContext}"`);
		if (top) {
			console.log(`  🏆 Top Hit [Score: ${(top.score! * 100).toFixed(0)}%]: "${top.text}"`);
			console.log(`     Category: ${top.category} | Tone: ${top.tone} | Flirt: ${top.flirtLevel}/5`);
			console.log(`     Reasoning: ${top.reasoning}`);
		}

		assert(`Scenario [${sc.name}] retrieved matching tag "${sc.expectedTag}" in top results`, hasExpectedTag);
	}

	console.log('\n================================================================');
	console.log(`📊 TEST SUMMARY: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
	console.log('================================================================\n');

	if (passedTests !== totalTests) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Fatal error running tests:', err);
	process.exit(1);
});
