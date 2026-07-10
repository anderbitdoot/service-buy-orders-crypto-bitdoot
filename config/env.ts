import { z, ZodError } from "zod";

const envSchema = z.object({
    PORT:         z.string().default("4200"),
    DEPLOY_ENV:   z.enum(["dev", "docker", "qa", "prod"]),
    NODE_ENV:     z.string().default("development"),
    SERVICE_NAME: z.string().default("BUY CRYPTO ORDER"),
    REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),

    MONGODB_URI:                z.url(),
    MONGODB_DATABASE:           z.string().default("bitdoot_db"),
    MONGODB_MAX_POOL_SIZE:      z.coerce.number().default(10),
    MONGODB_MIN_POOL_SIZE:      z.coerce.number().default(2),
    MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().default(10000),
    MONGODB_SOCKET_TIMEOUT_MS:  z.coerce.number().default(45000),

    COMMONS_ASSETS_API_URL:   z.url().default("https://api.bitdoot.dev/v1/commons/assets"),
    COMMONS_SERVICE_TOKEN:    z.string().min(1, "COMMONS_SERVICE_TOKEN is required"),
    EXCHANGE_RATE_REFRESH_MS: z.coerce.number().default(5000),
    USE_LIVE_EXCHANGE_RATE:   z.coerce.boolean().default(false),
    FALLBACK_EXCHANGE_RATE:   z.coerce.number().default(3.5),

    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export type EnvSchema = z.infer<typeof envSchema>;

function loadEnv(): EnvSchema {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("❌ Invalid environment variables:");
            console.error("");
            error.issues.forEach((issue) => {
                console.error(`  ⚠️  ${issue.path.join(".")}: ${issue.message}`);
            });
            console.error("");
            console.error("Check your .env.dev / .env.docker / .env.qa file.");
            process.exit(1);
        }
        throw error;
    }
}

export const ENV = loadEnv();