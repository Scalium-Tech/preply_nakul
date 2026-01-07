type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    meta?: Record<string, unknown>;
    timestamp: string;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'key', 'signature'];

function sanitize(data: unknown): unknown {
    if (!data) return data;

    if (typeof data === 'object') {
        if (Array.isArray(data)) {
            return data.map(sanitize);
        }

        return Object.keys(data).reduce((acc, key) => {
            const value = (data as Record<string, unknown>)[key];
            const lowerKey = key.toLowerCase();

            if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
                acc[key] = '***REDACTED***';
            } else {
                acc[key] = typeof value === 'object' ? sanitize(value) : value;
            }

            return acc;
        }, {} as Record<string, unknown>);
    }

    return data;
}

export const logger = {
    info: (message: string, meta?: Record<string, unknown>) => {
        console.log(JSON.stringify({
            level: 'info',
            message,
            meta: sanitize(meta),
            timestamp: new Date().toISOString(),
        }));
    },

    warn: (message: string, meta?: Record<string, unknown>) => {
        console.warn(JSON.stringify({
            level: 'warn',
            message,
            meta: sanitize(meta),
            timestamp: new Date().toISOString(),
        }));
    },

    error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
        const errorDetails = error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error;

        console.error(JSON.stringify({
            level: 'error',
            message,
            error: errorDetails,
            meta: sanitize(meta),
            timestamp: new Date().toISOString(),
        }));
    }
};
