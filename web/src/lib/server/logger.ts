import fs from 'fs';
import path from 'path';
import { getModel, rateFor } from './aiConfig';

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
	ragContextCount?: number;
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
	marketRates: Record<string, { inputPer1M: number; outputPer1M: number }>;
};

const LOG_DIR = path.resolve(process.cwd(), 'data/logs');
const JSONL_FILE = path.join(LOG_DIR, 'rizz_history.jsonl');
const JSON_FILE = path.join(LOG_DIR, 'rizz_history.json');

function ensureLogDirExists(): boolean {
	try {
		if (!fs.existsSync(LOG_DIR)) {
			fs.mkdirSync(LOG_DIR, { recursive: true });
		}
		return true;
	} catch (err) {
		console.warn('Filesystem logging unavailable (serverless environment):', err);
		return false;
	}
}

export function logRizzRequest(record: Omit<RizzLogRecord, 'id' | 'timestamp'>): RizzLogRecord {
	const fullRecord: RizzLogRecord = {
		id: `rizz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		timestamp: new Date().toISOString(),
		...record
	};

	try {
		if (ensureLogDirExists()) {
			const line = JSON.stringify(fullRecord) + '\n';
			fs.appendFileSync(JSONL_FILE, line, 'utf-8');

			let existingLogs: RizzLogRecord[] = [];
			if (fs.existsSync(JSON_FILE)) {
				try {
					const content = fs.readFileSync(JSON_FILE, 'utf-8');
					existingLogs = JSON.parse(content);
				} catch {
					existingLogs = [];
				}
			}

			existingLogs.unshift(fullRecord);
			if (existingLogs.length > 500) {
				existingLogs = existingLogs.slice(0, 500);
			}

			fs.writeFileSync(JSON_FILE, JSON.stringify(existingLogs, null, 2), 'utf-8');
		} else {
			console.log('[LOG RECORD]', JSON.stringify(fullRecord));
		}
	} catch (err) {
		console.error('Failed to log rizz request:', err);
	}

	return fullRecord;
}

export function getRizzLogs(limit = 50): RizzLogRecord[] {
	try {
		if (!ensureLogDirExists() || !fs.existsSync(JSON_FILE)) return [];
		const content = fs.readFileSync(JSON_FILE, 'utf-8');
		const logs: RizzLogRecord[] = JSON.parse(content);
		return logs.slice(0, limit);
	} catch {
		return [];
	}
}

export function getAnalyticsSummary(): AnalyticsSummary {
	let logs: RizzLogRecord[] = [];
	try {
		logs = getRizzLogs(1000);
	} catch {
		logs = [];
	}

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
		marketRates: buildMarketRates(logs)
	};
}

/** Rates for the models actually seen in logs, plus the configured default. */
function buildMarketRates(
	logs: RizzLogRecord[]
): Record<string, { inputPer1M: number; outputPer1M: number }> {
	const models = new Set<string>([getModel()]);
	for (const log of logs) {
		if (log.usage?.model) models.add(log.usage.model);
	}

	const rates: Record<string, { inputPer1M: number; outputPer1M: number }> = {};
	for (const model of models) {
		const { input, output } = rateFor(model);
		rates[model] = { inputPer1M: input, outputPer1M: output };
	}
	return rates;
}
