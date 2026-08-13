import fs from 'fs';
import path from 'path';

export type RizzLogRecord = {
	id: string;
	timestamp: string;
	hasImage: boolean;
	imagePreviewBase64?: string;
	context: string;
	personalization?: Record<string, any>;
	suggestions: Array<{ tone: string; text: string }>;
	simulated: boolean;
	durationMs: number;
	clientIp?: string;
	usage?: {
		model: string;
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
		costUSD: number;
	};
};

export type AnalyticsSummary = {
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

const LOG_DIR = path.resolve(process.cwd(), 'data/logs');
const JSONL_FILE = path.join(LOG_DIR, 'rizz_history.jsonl');
const JSON_FILE = path.join(LOG_DIR, 'rizz_history.json');

function ensureLogDirExists() {
	if (!fs.existsSync(LOG_DIR)) {
		fs.mkdirSync(LOG_DIR, { recursive: true });
	}
}

export function logRizzRequest(record: Omit<RizzLogRecord, 'id' | 'timestamp'>): RizzLogRecord {
	ensureLogDirExists();

	const fullRecord: RizzLogRecord = {
		id: `rizz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		timestamp: new Date().toISOString(),
		...record
	};

	try {
		// 1. Append to .jsonl log file (append-only log)
		const line = JSON.stringify(fullRecord) + '\n';
		fs.appendFileSync(JSONL_FILE, line, 'utf-8');

		// 2. Maintain .json log file (recent array for easy JSON querying)
		let existingLogs: RizzLogRecord[] = [];
		if (fs.existsSync(JSON_FILE)) {
			try {
				const content = fs.readFileSync(JSON_FILE, 'utf-8');
				existingLogs = JSON.parse(content);
			} catch {
				existingLogs = [];
			}
		}

		// Prepend newest log and keep up to 500 recent entries
		existingLogs.unshift(fullRecord);
		if (existingLogs.length > 500) {
			existingLogs = existingLogs.slice(0, 500);
		}

		fs.writeFileSync(JSON_FILE, JSON.stringify(existingLogs, null, 2), 'utf-8');
	} catch (err) {
		console.error('Failed to log rizz request:', err);
	}

	return fullRecord;
}

export function getRizzLogs(limit = 50): RizzLogRecord[] {
	ensureLogDirExists();
	if (!fs.existsSync(JSON_FILE)) return [];
	try {
		const content = fs.readFileSync(JSON_FILE, 'utf-8');
		const logs: RizzLogRecord[] = JSON.parse(content);
		return logs.slice(0, limit);
	} catch {
		return [];
	}
}

export function getAnalyticsSummary(): AnalyticsSummary {
	ensureLogDirExists();
	const logs = getRizzLogs(1000);

	const now = new Date();
	const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

	let totalGenerations = 0;
	let totalImagesProcessed = 0;
	let totalPromptTokens = 0;
	let totalCompletionTokens = 0;
	let totalTokens = 0;
	let totalCostUSD = 0;
	let monthlyCostUSD = 0;
	let thisMonthGenerations = 0;

	for (const log of logs) {
		totalGenerations++;
		if (log.hasImage) totalImagesProcessed++;

		const logMonth = log.timestamp.substring(0, 7);
		const isThisMonth = logMonth === currentYearMonth;

		if (isThisMonth) {
			thisMonthGenerations++;
		}

		if (log.usage) {
			totalPromptTokens += log.usage.promptTokens;
			totalCompletionTokens += log.usage.completionTokens;
			totalTokens += log.usage.totalTokens;
			totalCostUSD += log.usage.costUSD;
			if (isThisMonth) {
				monthlyCostUSD += log.usage.costUSD;
			}
		}
	}

	return {
		totalGenerations,
		totalImagesProcessed,
		totalPromptTokens,
		totalCompletionTokens,
		totalTokens,
		totalCostUSD,
		monthlyCostUSD,
		thisMonthGenerations,
		marketRates: {
			'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.60 },
			'gpt-4o': { inputPer1M: 2.50, outputPer1M: 10.00 }
		}
	};
}
