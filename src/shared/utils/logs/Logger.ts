type LogLevel = "info" | "warn" | "error" | "debug";

const LEVEL_ICONS: Record<LogLevel, string> = {
    info:  "ℹ️ ",
    warn:  "⚠️ ",
    error: "❌ ",
    debug: "🔍 ",
};

export function formatDateTime(date: Date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
}

class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private format(level: LogLevel, message: string): string {
        const icon = LEVEL_ICONS[level];
        return `${icon} [${this.context}] ${message}`;
    }

    info(message: string):  void { console.log(this.format("info", message)); }
    warn(message: string):  void { console.warn(this.format("warn", message)); }
    debug(message: string): void {
        if (process.env.NODE_ENV !== "production") {
            console.log(this.format("debug", message));
        }
    }

    error(message: string, err?: unknown): void {
        console.error(this.format("error", message));
        if (err) console.error(err);
    }

    plain(message: string): void {
        console.log(`${LEVEL_ICONS.info} ${message}`);
    }
}

export function createLogger(context: string): Logger {
    return new Logger(context);
}