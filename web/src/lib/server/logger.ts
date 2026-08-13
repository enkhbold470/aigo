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

		// Prepend newest log and keep up to 200 recent entries
		existingLogs.unshift(fullRecord);
		if (existingLogs.length > 200) {
			existingLogs = existingLogs.slice(0, 200);
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
