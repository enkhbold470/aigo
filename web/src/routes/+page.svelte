<script lang="ts">
	import { Sparkles, Smartphone, Layers, Command, Copy, Wand2, Settings, Zap, RefreshCw, Image, Flame, Check, X } from 'lucide-svelte';

	type Tab = 'simulator' | 'shortcuts' | 'snippets' | 'setup';
	type Chip = { label: string; text: string; icon?: string; tone?: string };

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
	});

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
		}
	}

	async function handleRizzImageUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			rizzImageBase64 = await fileToDataUrl(file);
		} catch (err) {
			console.error('Failed to read image file:', err);
		}
	}

	function useDemoRizzImage() {
		rizzImageBase64 =
			'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f43f5e"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="120" height="120" rx="24" fill="url(%23g)"/><text x="60" y="70" font-size="40" text-anchor="middle">🔥</text></svg>';
	}

	function copyRizzToClipboard(line: string, index: number) {
		void navigator.clipboard.writeText(line);
		copiedRizzIndex = index;
		setTimeout(() => {
			if (copiedRizzIndex === index) {
				copiedRizzIndex = null;
			}
		}, 2000);
	}

	function fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
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
			<div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
				<Sparkles class="w-6 h-6 text-white" />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
					AIGo Keyboard
					<span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">iOS Native</span>
				</h1>
				<p class="text-sm text-slate-400">Clipboard analysis, rizz generator, screenshot smart reply, tone rewrite, and phrase complete.</p>
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
					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<div class="flex items-center justify-between">
							<h2 class="text-base font-semibold text-white flex items-center gap-2">
								<Wand2 class="w-4 h-4 text-indigo-400" /> Tone transformer
							</h2>
							{#if simulated}
								<span class="text-xs text-amber-300">simulated</span>
							{/if}
						</div>
						<textarea bind:value={inputText} rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
						<div class="flex flex-wrap items-center gap-2">
							{#each ['fix', 'formal', 'shorter', 'witty', 'friendly', 'bulleted'] as action}
								<button onclick={() => transformText(action)} disabled={isTransforming} class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700">
									{action}
								</button>
							{/each}
							<button onclick={completePhrase} disabled={isCompleting} class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium">
								{isCompleting ? 'Completing…' : 'Next phrase'}
							</button>
						</div>
						{#if transformedOutput}
							<div class="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl space-y-2">
								<div class="flex items-center justify-between text-xs text-indigo-300 font-medium">
									<span>AI output</span>
									<button onclick={() => (inputText = transformedOutput)} class="text-indigo-400 hover:text-indigo-200">Use in field</button>
								</div>
								<p class="text-sm text-slate-200">{transformedOutput}</p>
							</div>
						{/if}
						{#if completeSuggestions.length}
							<div class="flex flex-wrap gap-2">
								{#each completeSuggestions as chip}
									<button onclick={() => (inputText += chip.text)} class="px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs">
										{chip.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<h2 class="text-base font-semibold text-white flex items-center gap-2">
							<Copy class="w-4 h-4 text-purple-400" /> Clipboard analyzer
						</h2>
						<div class="flex items-center gap-2">
							<input type="text" bind:value={clipboardInput} class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							<button onclick={analyzeClipboard} disabled={isAnalyzingClipboard} class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium flex items-center gap-1.5">
								{#if isAnalyzingClipboard}<RefreshCw class="w-4 h-4 animate-spin" />{/if}
								Analyze
							</button>
						</div>
						{#if clipboardSuggestions.length}
							<div class="flex flex-wrap gap-2">
								{#each clipboardSuggestions as chip}
									<button onclick={() => (inputText = chip.text)} class="px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs font-medium">
										{chip.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<div class="flex items-center justify-between">
							<h2 class="text-base font-semibold text-white flex items-center gap-2">
								<Flame class="w-4 h-4 text-rose-400" /> Rizz generator
							</h2>
							{#if simulated}
								<span class="text-xs text-amber-300">simulated</span>
							{/if}
						</div>
						<p class="text-xs text-slate-400">Generate 3 flirty, all-lowercase rizz suggestions with emojis based on a photo or context.</p>

						<div class="space-y-3">
							<input
								type="text"
								bind:value={rizzContext}
								placeholder="Optional context or prompt (e.g. coffee date, compliment)..."
								class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
							/>

							{#if rizzImageBase64}
								<div class="relative flex items-center gap-3 bg-slate-950 p-2.5 border border-rose-500/40 rounded-xl">
									<img src={rizzImageBase64} alt="Rizz context" class="h-14 w-14 object-cover rounded-lg border border-slate-800" />
									<div class="flex-1 min-w-0">
										<p class="text-xs font-semibold text-rose-300">Photo attached</p>
										<p class="text-[11px] text-slate-400 truncate">Image ready for vision model</p>
									</div>
									<button
										onclick={() => (rizzImageBase64 = null)}
										class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
										title="Remove photo"
									>
										<X class="w-4 h-4" />
									</button>
								</div>
							{:else}
								<div class="flex items-center gap-2">
									<label class="flex-1 cursor-pointer bg-slate-950 hover:bg-slate-900 border border-dashed border-slate-800 hover:border-rose-500/50 rounded-xl p-2.5 text-center transition-all">
										<input type="file" accept="image/*" onchange={handleRizzImageUpload} class="hidden" />
										<span class="text-xs text-slate-400 flex items-center justify-center gap-1.5">
											<Image class="w-4 h-4 text-rose-400" /> Upload photo
										</span>
									</label>
									<button
										onclick={useDemoRizzImage}
										class="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-xs text-rose-300 border border-slate-800 hover:border-rose-500/40 rounded-xl font-medium whitespace-nowrap transition-all"
									>
										Demo photo
									</button>
								</div>
							{/if}

							<button
								onclick={handleGenerateRizz}
								disabled={isGeneratingRizz}
								class="w-full py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-rose-900/20 transition-all disabled:opacity-50"
							>
								{#if isGeneratingRizz}
									<RefreshCw class="w-4 h-4 animate-spin" />
									Generating rizz…
								{:else}
									<Flame class="w-4 h-4" />
									Generate Rizz Lines
								{/if}
							</button>
						</div>

						{#if rizzSuggestions.length > 0}
							<div class="space-y-2 pt-1">
								<div class="flex items-center justify-between text-xs text-rose-300 font-medium px-1">
									<span>Generated Rizz Suggestions</span>
									<span class="text-[11px] text-slate-400">All-lowercase with emojis</span>
								</div>
								<div class="space-y-2">
									{#each rizzSuggestions as line, i}
										<div class="flex items-center justify-between gap-2 p-2.5 bg-slate-950 border border-rose-950/80 hover:border-rose-800/60 rounded-xl transition-all">
											<button
												onclick={() => (inputText = line)}
												class="text-xs text-rose-100 text-left flex-1 hover:text-white font-sans"
												title="Click to insert into keyboard simulator"
											>
												{line}
											</button>
											<div class="flex items-center gap-1">
												<button
													onclick={() => (inputText = line)}
													class="text-[10px] px-2 py-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800/40"
													title="Use in simulator"
												>
													Use
												</button>
												<button
													onclick={() => copyRizzToClipboard(line, i)}
													class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1 text-xs"
													title="Copy to clipboard"
												>
													{#if copiedRizzIndex === i}
														<Check class="w-3.5 h-3.5 text-emerald-400" />
														<span class="text-[10px] text-emerald-400 font-medium">Copied</span>
													{:else}
														<Copy class="w-3.5 h-3.5 text-rose-300" />
													{/if}
												</button>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
						<h2 class="text-base font-semibold text-white flex items-center gap-2">
							<Image class="w-4 h-4 text-pink-400" /> Screenshot smart reply
						</h2>
						<p class="text-xs text-slate-400">Upload a chat screenshot. The keyboard does the same when an image is on the clipboard.</p>
						<input type="file" accept="image/*" onchange={analyzeScreenshotFile} class="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-600 file:px-3 file:py-2 file:text-white" />
						{#if isAnalyzingScreenshot}
							<p class="text-xs text-pink-300">Reading screenshot…</p>
						{/if}
						{#if screenshotContext}
							<p class="text-sm text-slate-200">{screenshotContext}</p>
						{/if}
						{#if screenshotSuggestions.length}
							<div class="flex flex-wrap gap-2">
								{#each screenshotSuggestions as chip}
									<button onclick={() => (inputText = chip.text)} class="px-3 py-1.5 rounded-full bg-pink-950/60 border border-pink-800/60 text-pink-200 text-xs font-medium">
										{chip.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="lg:col-span-6 flex justify-center">
					<div class="w-[380px] bg-slate-950 rounded-[44px] p-4 border-[6px] border-slate-800 shadow-2xl">
						<div class="w-28 h-5 bg-slate-900 rounded-full mx-auto mb-4"></div>
						<div class="bg-slate-900/90 rounded-2xl p-4 h-64 mb-4 border border-slate-800 flex flex-col justify-between">
							<div class="space-y-3 overflow-y-auto">
								<div class="flex justify-start">
									<div class="bg-slate-800 text-slate-200 text-xs rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[80%]">
										Hey! Are you free for a quick sync on the keyboard?
									</div>
								</div>
								<div class="flex justify-end">
									<div class="bg-indigo-600 text-white text-xs rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[80%]">
										{inputText || 'Typing…'}
									</div>
								</div>
							</div>
							<div class="pt-2 border-t border-slate-800/80 text-xs text-slate-400 truncate">{inputText || 'Type a message…'}</div>
						</div>
						<div class="bg-slate-900/95 rounded-2xl p-2.5 border border-slate-800 space-y-2">
							<div class="bg-slate-950 rounded-xl p-2 border border-slate-800 flex items-center gap-1 overflow-x-auto">
								<button onclick={() => transformText('fix')} class="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium whitespace-nowrap">!fix</button>
								<button onclick={() => transformText('shorter')} class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] whitespace-nowrap">!shorter</button>
								<button onclick={() => transformText('formal')} class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] whitespace-nowrap">!formal</button>
								<button onclick={handleGenerateRizz} disabled={isGeneratingRizz} class="px-2 py-1 rounded-lg bg-rose-900/40 text-rose-300 border border-rose-800/40 text-[11px] whitespace-nowrap">🔥 Rizz</button>
								<button onclick={analyzeClipboard} class="px-2 py-1 rounded-lg bg-purple-900/40 text-purple-300 text-[11px] whitespace-nowrap">Clip</button>
							</div>
							<div class="space-y-1.5 select-none pt-1">
								<div class="flex justify-center gap-1">
									{#each keys1 as key}
										<button onclick={() => (inputText += key.toLowerCase())} class="w-7 h-9 bg-slate-800 text-white rounded-md text-xs font-semibold">{key}</button>
									{/each}
								</div>
								<div class="flex justify-center gap-1 px-2">
									{#each keys2 as key}
										<button onclick={() => (inputText += key.toLowerCase())} class="w-7 h-9 bg-slate-800 text-white rounded-md text-xs font-semibold">{key}</button>
									{/each}
								</div>
								<div class="flex justify-center gap-1">
									<button class="w-10 h-9 bg-slate-700 text-white rounded-md text-xs">⇧</button>
									{#each keys3 as key}
										<button onclick={() => (inputText += key.toLowerCase())} class="w-7 h-9 bg-slate-800 text-white rounded-md text-xs font-semibold">{key}</button>
									{/each}
									<button onclick={() => (inputText = inputText.slice(0, -1))} class="w-10 h-9 bg-slate-700 text-white rounded-md text-xs">⌫</button>
								</div>
								<div class="flex justify-center gap-1 pt-1">
									<button class="w-9 h-9 bg-slate-700 text-slate-300 rounded-md text-xs">🌐</button>
									<button onclick={() => (inputText += ' ')} class="flex-1 h-9 bg-slate-800 text-slate-300 text-xs rounded-md">space</button>
									<button class="w-14 h-9 bg-indigo-600 text-white rounded-md text-xs font-semibold">return</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'shortcuts'}
			<div class="max-w-3xl mx-auto space-y-6">
				<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
					<h2 class="text-lg font-semibold text-white flex items-center gap-2"><Command class="w-5 h-5 text-indigo-400" /> Custom prompt shortcuts</h2>
					<p class="text-sm text-slate-400">Typing <code class="text-indigo-300">!fix</code> on the iOS keyboard rewrites the current field.</p>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
						<input bind:value={newShortcut} placeholder="Shortcut (e.g. !bullet)" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
						<input bind:value={newTitle} placeholder="Title" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
						<button onclick={handleAddShortcut} class="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm px-4 py-2">Add shortcut</button>
					</div>
					<textarea bind:value={newPrompt} rows="2" placeholder="AI system prompt…" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"></textarea>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each shortcuts as s}
						<div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{s.shortcut}</span>
								<span class="text-sm font-semibold text-white">{s.title}</span>
							</div>
							<p class="text-xs text-slate-400">{s.prompt}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'snippets'}
			<div class="max-w-3xl mx-auto space-y-6">
				<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
					<h2 class="text-lg font-semibold text-white flex items-center gap-2"><Layers class="w-5 h-5 text-purple-400" /> Fast snippets</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input bind:value={snippetTitle} placeholder="Snippet title" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
						<button onclick={handleAddSnippet} class="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-sm px-4 py-2">Save snippet</button>
					</div>
					<textarea bind:value={snippetContent} rows="2" placeholder="Content to paste…" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"></textarea>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each snippets as snip}
						<div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-sm font-semibold text-white">{snip.title}</span>
								<span class="text-[10px] uppercase font-bold text-slate-500">{snip.category}</span>
							</div>
							<p class="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-lg truncate">{snip.content}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="max-w-2xl mx-auto space-y-6">
				<div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
					<h2 class="text-lg font-semibold text-white flex items-center gap-2"><Smartphone class="w-5 h-5 text-indigo-400" /> Install the native keyboard</h2>
					<ol class="space-y-4 text-sm text-slate-300 list-decimal list-inside">
						<li>Open <code class="text-indigo-300">ios/AIGo.xcodeproj</code> in Xcode. Set your Team, then run on a simulator or device.</li>
						<li>On the device: Settings → General → Keyboard → Keyboards → Add New Keyboard → AIGo Keyboard.</li>
						<li>Enable <strong class="text-white">Allow Full Access</strong>. Required for clipboard, screenshots, and network AI.</li>
						<li>In the host app, set Backend URL to your machine, e.g. <code class="text-indigo-300">http://127.0.0.1:5173</code> (simulator) or your LAN IP (device).</li>
						<li>In any app, hold 🌐 and choose AIGo Keyboard.</li>
					</ol>
					<div class="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl space-y-2">
						<h3 class="text-sm font-semibold text-indigo-300 flex items-center gap-2"><Zap class="w-4 h-4" /> Run locally</h3>
						<p class="text-xs text-slate-300 font-mono">cd web && bun dev</p>
						<p class="text-xs text-slate-400">Copy <code class="text-indigo-200">web/.env.example</code> to <code class="text-indigo-200">web/.env</code> and add <code class="text-indigo-200">OPENAI_API_KEY</code>.</p>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
