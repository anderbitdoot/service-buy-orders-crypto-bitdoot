type LogLevel = "info" | "warn" | "error" | "debug";

const LEVEL_ICONS: Record<LogLevel, string> = {
    info:  "ℹ️ ",
    warn:  "⚠️ ",
    error: "❌ ",
    debug: "🔍 ",
};

class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private format(level: LogLevel, message: string, showTimestamp: boolean): string {
        const icon = LEVEL_ICONS[level];
        const timestamp = showTimestamp ? ` [${new Date().toISOString()}]` : "";
        return `${icon}${timestamp} [${this.context}] ${message}`;
    }

    info(message: string, showTimestamp: boolean = false): void {
        console.log(this.format("info", message, showTimestamp));
    }

    warn(message: string, showTimestamp: boolean = false): void {
        console.warn(this.format("warn", message, showTimestamp));
    }

    error(message: string, showTimestamp: boolean = false, err?: unknown): void {
        console.error(this.format("error", message, showTimestamp));
        if (err) console.error(err);
    }

    debug(message: string): void {
        if (process.env.NODE_ENV !== "production") {
            console.log(this.format("debug", message, false));
        }
    }
}

export function createLogger(context: string): Logger {
    return new Logger(context);
}