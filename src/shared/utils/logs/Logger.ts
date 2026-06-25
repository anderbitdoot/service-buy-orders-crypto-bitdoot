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

    private format(level: LogLevel, message: string, requiredTimestap: boolean,): string {
        const timestamp = new Date().toISOString();
        const icon = LEVEL_ICONS[level];
        return `${icon} [${requiredTimestap} ? ${timestamp} : ''] [${this.context}] ${message}`;
    }

    info(message: string, requiredTimestap: boolean):  void {
        console.log(this.format("info", message, requiredTimestap));
    }

    warn(message: string, requiredTimestap: boolean):  void {
        console.warn(this.format("warn", message, requiredTimestap));
    }

    error(message: string, requiredTimestap: boolean, err?: unknown, ): void {
        console.error(this.format("error", message, requiredTimestap));
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