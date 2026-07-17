import Redis from "ioredis";
import { ENV }         from "../../../config/env";
import { createLogger } from "../utils/logs/Logger";

const logger = createLogger("Redis");

let redisInstance: Redis | null = null;

export function getRedisConnection(): Redis {
    if (redisInstance) return redisInstance;

    redisInstance = new Redis({
        host:                 ENV.REDIS_HOST,
        port:                 ENV.REDIS_PORT,
        password:             ENV.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck:     false,
        lazyConnect:          true,
    });

    redisInstance.on("connect",      ()    => logger.info("Connected"));
    redisInstance.on("ready",        ()    => logger.info("Ready"));
    redisInstance.on("error",        (err) => logger.error("Connection error", err));
    redisInstance.on("close",        ()    => logger.warn("Connection closed"));
    redisInstance.on("reconnecting", ()    => logger.warn("Reconnecting..."));

    return redisInstance;
}

export async function connectRedis(): Promise<void> {
    const redis = getRedisConnection();
    await redis.connect();
    logger.info(`Connected to ${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`);
}

export async function disconnectRedis(): Promise<void> {
    if (!redisInstance) return;
    await redisInstance.quit();
    redisInstance = null;
    logger.info("Disconnected gracefully");
}