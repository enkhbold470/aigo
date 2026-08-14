<script lang="ts">
	import { Sparkles, Smartphone, Layers, Command, Copy, Wand2, Settings, Zap, RefreshCw, Image, Flame, Check, X, BarChart3, DollarSign, Cpu } from 'lucide-svelte';

	type Tab = 'simulator' | 'analytics' | 'shortcuts' | 'snippets' | 'setup';
	type Chip = { label: string; text: string; icon?: string; tone?: string };

	type AnalyticsData = {
		totalGenerations: number;
		totalImagesProcessed: number;
		totalPromptTokens: number;
		totalCompletionTokens: number;
		totalTokens: number;
		totalCostUSD: number;
		monthlyCostUSD: number;
		thisMonthGenerations: number;
		marketRates: {
			'gpt-4o-mini': { inputPer1M: number; outputPer1M: number };
			'gpt-4o': { inputPer1M: number; outputPer1M: number };
		};
	};

	type LogRecord = {
		id: string;
		timestamp: string;
		hasImage: boolean;
		context: string;
		suggestions: Array<{ tone: string; text: string }>;
		durationMs: number;
		usage?: {
			model: string;
			promptTokens: number;
			completionTokens: number;
			totalTokens: number;
			costUSD: number;
		};
	};

	let activeTab = $state<Tab>('simulator');
	let inputText = $state(
		'Hey sarah, are we still meeting for lunch today at 1pm? Let me know if that works!'
	);
	let clipboardInput = $state(
		'Can you send me the updated Q3 presentation slides when you get a chance?'
	);
	let isTransforming = $state(false);
	let isAnalyzingClipboard = $state(false);
	let isAnalyzingScreenshot = $state(false);
	let isCompleting = $state(false);
	let isGeneratingRizz = $state(false);
	let simulated = $state(false);
	let openaiReady = $state<boolean | null>(null);

	let transformedOutput = $state('');
	let clipboardSuggestions = $state<Chip[]>([]);
	let screenshotSuggestions = $state<Chip[]>([]);
	let screenshotContext = $state('');
	let completeSuggestions = $state<Chip[]>([]);

	let rizzContext = $state('');
	let rizzImageBase64 = $state<string | null>(null);
	let rizzSuggestions = $state<string[]>([]);
	let copiedRizzIndex = $state<number | null>(null);

	let analyticsData = $state<AnalyticsData | null>(null);
	let recentLogs = $state<LogRecord[]>([]);

	let shortcuts = $state([
		{ shortcut: '!fix', title: 'Fix Grammar', prompt: 'Fix spelling and grammar while keeping tone natural.' },
		{ shortcut: '!shorter', title: 'Make Shorter', prompt: 'Summarize into a concise, direct sentence.' },
		{ shortcut: '!formal', title: 'Professional Tone', prompt: 'Rewrite in a polite business professional tone.' },
		{ shortcut: '!witty', title: 'Witty & Charming', prompt: 'Add clever, friendly humor.' }
	]);
	let newShortcut = $state('');
	let newTitle = $state('');
	let newPrompt = $state('');

	let snippets = $state([
		{ title: 'My Email Address', content: 'hello@aigo-keyboard.app', category: 'Contact' },
		{ title: 'Zoom Meeting Link', content: 'https://zoom.us/j/1234567890', category: 'Work' },
		{ title: 'Address & Directions', content: '123 Tech Avenue, Suite 400, San Francisco, CA 94107', category: 'Personal' }
	]);
	let snippetTitle = $state('');
	let snippetContent = $state('');

	$effect(() => {
		void fetch('/api/health')
			.then((r) => r.json())
			.then((data) => {
				openaiReady = Boolean(data.openai);
			})
			.catch(() => {
				openaiReady = false;
			});

		void loadAnalytics();
	});

	async function loadAnalytics() {
		try {
			const res = await fetch('/api/analytics');
			analyticsData = await res.json();

			const logsRes = await fetch('/api/logs?limit=30');
			const logsData = await logsRes.json();
			recentLogs = logsData.logs || [];
		} catch {
			// ignore
		}
	}

	async function transformText(action: string) {
		if (!inputText) return;
		isTransforming = true;
		try {
			const res = await fetch('/api/ai/transform', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: inputText, action })
			});
			const data = await res.json();
			transformedOutput = data.transformedText || inputText;
			simulated = Boolean(data.simulated);
		} finally {
			isTransforming = false;
			void loadAnalytics();
		}
	}

	async function analyzeClipboard() {
		if (!clipboardInput) return;
		isAnalyzingClipboard = true;
		try {
			const res = await fetch('/api/ai/clipboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: clipboardInput, context: inputText })
			});
			const data = await res.json();
			clipboardSuggestions = data.suggestions || [];
			simulated = Boolean(data.simulated);
		} finally {
			isAnalyzingClipboard = false;
			void loadAnalytics();
		}
	}

	async function completePhrase() {
		if (!inputText) return;
		isCompleting = true;
		try {
			const res = await fetch('/api/ai/complete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ before: inputText })
			});
			const data = await res.json();
			completeSuggestions = data.suggestions || [];
			simulated = Boolean(data.simulated);
		} finally {
			isCompleting = false;
			void loadAnalytics();
		}
	}

	async function analyzeScreenshotFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		isAnalyzingScreenshot = true;
		try {
			const dataUrl = await fileToDataUrl(file);
			const res = await fetch('/api/ai/screenshot', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imageBase64: dataUrl, tone: 'friendly & direct' })
			});
			const data = await res.json();
			screenshotContext = data.detectedContext || '';
			screenshotSuggestions = data.suggestions || [];
			simulated = Boolean(data.simulated);
		} finally {
			isAnalyzingScreenshot = false;
			void loadAnalytics();
		}
	}

	async function handleGenerateRizz() {
		isGeneratingRizz = true;
		try {
			const res = await fetch('/api/ai/rizz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imageBase64: rizzImageBase64, context: rizzContext })
			});
			const data = await res.json();
			if (data.options && Array.isArray(data.options)) {
				rizzSuggestions = data.options;
			}
			if (data.simulated !== undefined) {
				simulated = Boolean(data.simulated);
			}
		} catch (err) {
			console.error('Failed to generate rizz:', err);
		} finally {
			isGeneratingRizz = false;
			void loadAnalytics();
		}
	}

	function handleRizzImageUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		void fileToDataUrl(file).then((base64) => {
			rizzImageBase64 = base64;
		});
	}

	function fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function copyToClipboard(text: string, index?: number) {
		void navigator.clipboard.writeText(text);
		if (index !== undefined) {
			copiedRizzIndex = index;
			setTimeout(() => {
				copiedRizzIndex = null;
			}, 2000);
		}
	}

	function handleAddShortcut() {
		if (!newShortcut || !newPrompt) return;
		shortcuts = [
			...shortcuts,
			{
				shortcut: newShortcut.startsWith('!') ? newShortcut : `!${newShortcut}`,
				title: newTitle || newShortcut,
				prompt: newPrompt
			}
		];
		newShortcut = '';
		newTitle = '';
		newPrompt = '';
	}

	function handleAddSnippet() {
		if (!snippetTitle || !snippetContent) return;
		snippets = [...snippets, { title: snippetTitle, content: snippetContent, category: 'General' }];
		snippetTitle = '';
		snippetContent = '';
	}

	const keys1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
	const keys2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
	const keys3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<header class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
		<div class="flex items-center gap-3">
			<img src="/logo.png" alt="AIGo Logo" class="w-12 h-12 rounded-2xl shadow-lg shadow-indigo-500/20 border border-indigo-500/30 object-cover" />
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
					AIGo Keyboard
					<span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">iOS Native</span>
				</h1>
				<p class="text-sm text-slate-400">Clipboard analysis, rizz generator, screenshot smart reply, tone rewrite, and token cost tracking.</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<span class={`text-xs px-2 py-1 rounded-full border ${openaiReady ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' : 'border-amber-500/40 text-amber-300 bg-amber-950/40'}`}>
				{openaiReady === null ? 'Checking OpenAI…' : openaiReady ? 'OpenAI connected' : 'Simulated mode (add OPENAI_API_KEY)'}
			</span>
			<nav class="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
				<button onclick={() => (activeTab = 'simulator')} class={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
					<Smartphone class="w-4 h-4" /> Simulator
				</button>
				<button onclick={() => (activeTab = 'analytics')} class={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
					<BarChart3 class="w-4 h-4" /> Analytics & Cost
				</button>
				<button onclick={() => (activeTab = 'shortcuts')} class={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'shortcuts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
					<Command class="w-4 h-4" /> Shortcuts
				</button>
				<button onclick={() => (activeTab = 'snippets')} class={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'snippets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
					<Layers class="w-4 h-4" /> Snippets
				</button>
				<button onclick={() => (activeTab = 'setup')} class={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'setup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
					<Settings class="w-4 h-4" /> iOS Setup
				</button>
			</nav>
		</div>
	</header>

	<main class="py-8">
		{#if activeTab === 'simulator'}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				<div class="lg:col-span-6 space-y-6">
					<!-- Rizz Generator Panel -->
					<div class="bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 rounded-2xl border border-indigo-500/30 p-5 space-y-4 shadow-xl shadow-indigo-950/30">
						<div class="flex items-center justify-between">
							<h2 class="text-base font-semibold text-white flex items-center gap-2">
								<Flame class="w-5 h-5 text-orange-400" />
								Rizz Generator (Screenshot & Text)
							</h2>
							<span class="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium">all-lowercase + emojis</span>
						</div>

						<div class="space-y-3">
							<div>
								<label for="rizz-image" class="block text-xs font-medium text-slate-300 mb-1">Optional Chat Screenshot</label>
								<div class="flex items-center gap-3">
									<input id="rizz-image" type="file" accept="image/*" onchange={handleRizzImageUpload} class="hidden" />
									<label for="rizz-image" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-all flex items-center gap-2 border border-slate-700">
										<Image class="w-4 h-4 text-indigo-400" />
										{rizzImageBase64 ? 'Change Image' : 'Upload Screenshot'}
									</label>
									{#if rizzImageBase64}
										<div class="flex items-center gap-2">
											<img src={rizzImageBase64} alt="Screenshot Preview" class="w-10 h-10 object-cover rounded-lg border border-indigo-500/40" />
											<button onclick={() => (rizzImageBase64 = null)} class="text-slate-400 hover:text-red-400 p-1">
												<X class="w-4 h-4" />
											</button>
										</div>
									{/if}
								</div>
							</div>

							<div>
								<label for="rizz-context" class="block text-xs font-medium text-slate-300 mb-1">Context / Last Message Sent</label>
								<textarea id="rizz-context" bind:value={rizzContext} placeholder="e.g. she said: i'm so bored today, what are you doing?" rows={2} class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"></textarea>
							</div>

							<button onclick={handleGenerateRizz} disabled={isGeneratingRizz} class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 text-white font-medium text-sm shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
								{#if isGeneratingRizz}
									<RefreshCw class="w-4 h-4 animate-spin" /> Generating rizz…
								{:else}
									<Flame class="w-4 h-4" /> {rizzSuggestions.length > 0 ? 'Regenerate rizz ↺' : 'Generate rizz'}
								{/if}
							</button>

							{#if rizzSuggestions.length > 0}
								<div class="space-y-2.5 pt-2">
									<p class="text-xs font-medium text-slate-400">Generated Rizz Suggestions (Click to copy):</p>
									{#each rizzSuggestions as rizz, i}
										<div class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 group hover:border-indigo-400/50 transition-all">
											<div class="flex items-center gap-2.5">
												<span class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-bold">{i + 1}</span>
												<p class="text-sm font-mono text-indigo-100">{rizz}</p>
											</div>
											<button onclick={() => copyToClipboard(rizz, i)} class="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-xs font-medium transition-all flex items-center gap-1">
												{#if copiedRizzIndex === i}
													<Check class="w-3.5 h-3.5 text-emerald-400" /> Copied!
												{:else}
													<Copy class="w-3.5 h-3.5" /> Copy
												{/if}
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<h2 class="text-base font-semibold text-white flex items-center gap-2">
							<Wand2 class="w-5 h-5 text-indigo-400" />
							Quick AI Text Transformations
						</h2>
						<textarea bind:value={inputText} rows={3} class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all resize-none"></textarea>
						<div class="flex flex-wrap gap-2">
							<button onclick={() => transformText('fix')} disabled={isTransforming} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all">!fix</button>
							<button onclick={() => transformText('shorter')} disabled={isTransforming} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all">!shorter</button>
							<button onclick={() => transformText('formal')} disabled={isTransforming} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all">!formal</button>
							<button onclick={() => transformText('witty')} disabled={isTransforming} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all">!witty</button>
						</div>
						{#if transformedOutput}
							<div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200">
								{transformedOutput}
							</div>
						{/if}
					</div>
				</div>

				<div class="lg:col-span-6 space-y-6">
					<!-- iOS Keyboard UI Graphic Simulation -->
					<div class="bg-slate-950 rounded-3xl border border-slate-800 p-4 shadow-2xl space-y-3">
						<div class="flex items-center justify-between text-xs text-slate-400 px-2">
							<span>AIGo Keyboard Simulator</span>
							<span class="text-indigo-400 font-mono">http://192.168.0.49:5173</span>
						</div>

						<div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 min-h-[140px] space-y-2">
							{#if rizzSuggestions.length > 0}
								<p class="text-xs text-slate-400 font-medium">Selected Rizz Preview:</p>
								<div class="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-xs font-mono text-indigo-200">
									{rizzSuggestions[0]}
								</div>
							{:else}
								<p class="text-xs text-slate-500 italic">No text generated yet. Use the Rizz Generator or transformation tools to preview.</p>
							{/if}
						</div>

						<!-- Virtual Keyboard Base -->
						<div class="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800 space-y-2">
							<div class="flex justify-center gap-1">
								{#each keys1 as k}
									<span class="w-8 h-10 rounded-lg bg-slate-800 text-white text-xs font-medium flex items-center justify-center border border-slate-700/60 shadow-sm">{k}</span>
								{/each}
							</div>
							<div class="flex justify-center gap-1 px-3">
								{#each keys2 as k}
									<span class="w-8 h-10 rounded-lg bg-slate-800 text-white text-xs font-medium flex items-center justify-center border border-slate-700/60 shadow-sm">{k}</span>
								{/each}
							</div>
							<div class="flex justify-center gap-1">
								<span class="px-3 h-10 rounded-lg bg-slate-700 text-white text-xs font-medium flex items-center justify-center">⇧</span>
								{#each keys3 as k}
									<span class="w-8 h-10 rounded-lg bg-slate-800 text-white text-xs font-medium flex items-center justify-center border border-slate-700/60 shadow-sm">{k}</span>
								{/each}
								<span class="px-3 h-10 rounded-lg bg-slate-700 text-white text-xs font-medium flex items-center justify-center">⌫</span>
							</div>
							<div class="flex items-center gap-1.5 pt-1">
								<span class="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold">123</span>
								<span class="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center justify-center">🌐</span>
								<span class="flex-1 h-10 rounded-lg bg-slate-800 text-slate-400 text-xs flex items-center justify-center font-medium">space</span>
								<button onclick={handleGenerateRizz} class="px-4 h-10 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1">
									re-rizz ↺
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

		{:else if activeTab === 'analytics'}
			<!-- Analytics & Cost Dashboard -->
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-xl font-bold text-white flex items-center gap-2">
							<BarChart3 class="w-6 h-6 text-indigo-400" />
							Token Burn & Cost Analytics Dashboard
						</h2>
						<p class="text-sm text-slate-400">Track generations, prompt/completion tokens, image vision costs, and API spending.</p>
					</div>
					<button onclick={loadAnalytics} class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center gap-2">
						<RefreshCw class="w-3.5 h-3.5" /> Refresh Data
					</button>
				</div>

				{#if analyticsData}
					<!-- Summary Metric Cards -->
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2">
							<div class="flex items-center justify-between text-slate-400 text-xs font-medium">
								<span>Total Generations</span>
								<Zap class="w-4 h-4 text-indigo-400" />
							</div>
							<p class="text-3xl font-bold text-white">{analyticsData.totalGenerations}</p>
							<p class="text-xs text-slate-400">{analyticsData.thisMonthGenerations} this month • {analyticsData.totalImagesProcessed} screenshot vision requests</p>
						</div>

						<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2">
							<div class="flex items-center justify-between text-slate-400 text-xs font-medium">
								<span>Total Tokens Burned</span>
								<Cpu class="w-4 h-4 text-purple-400" />
							</div>
							<p class="text-3xl font-bold text-white">{analyticsData.totalTokens.toLocaleString()}</p>
							<p class="text-xs text-slate-400">{analyticsData.totalPromptTokens.toLocaleString()} input • {analyticsData.totalCompletionTokens.toLocaleString()} output</p>
						</div>

						<div class="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-5 space-y-2 bg-emerald-950/10">
							<div class="flex items-center justify-between text-emerald-400 text-xs font-medium">
								<span>Estimated Monthly Cost</span>
								<DollarSign class="w-4 h-4 text-emerald-400" />
							</div>
							<p class="text-3xl font-bold text-emerald-400">${analyticsData.monthlyCostUSD.toFixed(5)}</p>
							<p class="text-xs text-emerald-300/70">Current Month Spending</p>
						</div>

						<div class="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-5 space-y-2 bg-indigo-950/10">
							<div class="flex items-center justify-between text-indigo-300 text-xs font-medium">
								<span>All-Time API Spend</span>
								<DollarSign class="w-4 h-4 text-indigo-400" />
							</div>
							<p class="text-3xl font-bold text-indigo-300">${analyticsData.totalCostUSD.toFixed(5)}</p>
							<p class="text-xs text-indigo-300/70">Total Spend All-Time</p>
						</div>
					</div>

					<!-- OpenAI Market Pricing Rate Card -->
					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
						<h3 class="text-sm font-semibold text-white flex items-center gap-2">
							<DollarSign class="w-4 h-4 text-amber-400" />
							Current OpenAI Market Pricing Rates
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
								<div class="flex items-center justify-between">
									<span class="font-bold text-indigo-300">GPT-4o-mini (Default Model)</span>
									<span class="text-emerald-400 font-mono">Active</span>
								</div>
								<p class="text-slate-400">Input (Text & Vision): <span class="text-white font-mono">$0.15</span> per 1,000,000 tokens</p>
								<p class="text-slate-400">Output (Completion): <span class="text-white font-mono">$0.60</span> per 1,000,000 tokens</p>
							</div>

							<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
								<div class="flex items-center justify-between">
									<span class="font-bold text-purple-300">GPT-4o (High-Cap Vision)</span>
									<span class="text-slate-500 font-mono">Supported</span>
								</div>
								<p class="text-slate-400">Input (Text & Vision): <span class="text-white font-mono">$2.50</span> per 1,000,000 tokens</p>
								<p class="text-slate-400">Output (Completion): <span class="text-white font-mono">$10.00</span> per 1,000,000 tokens</p>
							</div>
						</div>
					</div>

					<!-- Recent Generation Request Logs Table -->
					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<h3 class="text-sm font-semibold text-white">Recent Request & Token Burn Log</h3>
						<div class="overflow-x-auto">
							<table class="w-full text-left text-xs text-slate-300">
								<thead class="text-slate-400 border-b border-slate-800 uppercase bg-slate-950/60">
									<tr>
										<th class="py-2.5 px-3">Time</th>
										<th class="py-2.5 px-3">Type</th>
										<th class="py-2.5 px-3">Model</th>
										<th class="py-2.5 px-3">Prompt Tokens</th>
										<th class="py-2.5 px-3">Completion Tokens</th>
										<th class="py-2.5 px-3">Total Tokens</th>
										<th class="py-2.5 px-3">Cost ($)</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-slate-800/60 font-mono">
									{#each recentLogs as log}
										<tr class="hover:bg-slate-800/40 transition-colors">
											<td class="py-2.5 px-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
											<td class="py-2.5 px-3">
												<span class={`px-2 py-0.5 rounded-full text-[10px] ${log.hasImage ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'}`}>
													{log.hasImage ? '📷 Screenshot' : '💬 Text'}
												</span>
											</td>
											<td class="py-2.5 px-3 text-slate-300">{log.usage?.model || 'gpt-4o-mini'}</td>
											<td class="py-2.5 px-3 text-indigo-300">{log.usage?.promptTokens ?? '—'}</td>
											<td class="py-2.5 px-3 text-purple-300">{log.usage?.completionTokens ?? '—'}</td>
											<td class="py-2.5 px-3 font-bold text-white">{log.usage?.totalTokens ?? '—'}</td>
											<td class="py-2.5 px-3 text-emerald-400">${(log.usage?.costUSD ?? 0).toFixed(6)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>

		{:else if activeTab === 'shortcuts'}
			<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
				<h2 class="text-lg font-bold text-white">Custom AI Shortcuts</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each shortcuts as sc}
						<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
							<span class="font-mono text-indigo-400 text-sm font-bold">{sc.shortcut}</span>
							<h3 class="text-white font-medium text-sm">{sc.title}</h3>
							<p class="text-xs text-slate-400">{sc.prompt}</p>
						</div>
					{/each}
				</div>
			</div>

		{:else if activeTab === 'snippets'}
			<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
				<h2 class="text-lg font-bold text-white">Saved Snippets</h2>
				<div class="space-y-3">
					{#each snippets as snip}
						<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
							<div>
								<h3 class="text-white font-medium text-sm">{snip.title}</h3>
								<p class="text-xs font-mono text-indigo-300">{snip.content}</p>
							</div>
							<span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{snip.category}</span>
						</div>
					{/each}
				</div>
			</div>

		{:else if activeTab === 'setup'}
			<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
				<h2 class="text-lg font-bold text-white">iOS Keyboard Extension Setup Guide</h2>
				<ol class="space-y-3 text-sm text-slate-300 list-decimal list-inside">
					<li>Open <strong class="text-white">Settings</strong> on your iPhone.</li>
					<li>Go to <strong class="text-white">General → Keyboard → Keyboards</strong>.</li>
					<li>Tap <strong class="text-white">Add New Keyboard…</strong> and select <strong class="text-white">AIGo Keyboard</strong>.</li>
					<li>Tap <strong class="text-white">AIGo Keyboard</strong> and turn ON <strong class="text-white">Allow Full Access</strong>.</li>
					<li>Open any chat app (iMessage, Instagram DM, WhatsApp, Tinder) and switch to AIGo Keyboard!</li>
				</ol>
			</div>
		{/if}
	</main>
</div>
