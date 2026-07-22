import { z, ZodError } from "zod";

const envSchema = z.object({
    PORT:               z.string().default("4200"),
    DEPLOY_ENV:         z.enum(["dev", "docker", "qa", "prod"]),
    NODE_ENV:           z.string().default("development"),
    SERVICE_NAME:       z.string().default("BUY CRYPTO"),
    REQUEST_TIMEOUT_MS: z.coerce.number().default(30_000),

    MONGODB_URI:                z.url(),
    MONGODB_DATABASE:           z.string().default("bitdoot_db"),
    MONGODB_MAX_POOL_SIZE:      z.coerce.number().default(10),
    MONGODB_MIN_POOL_SIZE:      z.coerce.number().default(2),
    MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().default(10_000),
    MONGODB_SOCKET_TIMEOUT_MS:  z.coerce.number().default(45_000),

    COMMONS_ASSETS_API_URL: z.string().url(),
    COMMONS_SERVICE_TOKEN:  z.string().min(1),

    JWT_SECRET: z.string().min(1),

    REDIS_HOST:     z.string().default("localhost"),
    REDIS_PORT:     z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().min(1),

    EXCHANGE_RATE_REFRESH_MS: z.coerce.number().default(600_000),
    USE_LIVE_EXCHANGE_RATE:   z.coerce.boolean().default(true),

    ORDER_EXPIRY_MS:       z.coerce.number().default(3_600_000),
    ORDER_EXPIRY_CHECK_MS: z.coerce.number().default(120_000),
    FEE_RATE:              z.coerce.number().min(0).max(1).default(0.1),
});

export type EnvSchema = z.infer<typeof envSchema>;

function loadEnv(): EnvSchema {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("❌ Invalid environment variables:\n");
            error.issues.forEach(issue => {
                console.error(`  ⚠️  ${issue.path.join(".")}: ${issue.message}`);
            });
            console.error("\nCheck your .env.dev / .env.docker / .env.qa file.");
            process.exit(1);
        }
        throw error;
    }
}

export const ENV = loadEnv();