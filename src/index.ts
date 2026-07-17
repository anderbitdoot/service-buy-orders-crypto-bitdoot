import "reflect-metadata";
import { createApp }          from "./app";
import { mongoDBConfig }      from "./shared/database/mongodb";
import { connectRedis, disconnectRedis } from "./shared/database/redis";
import { ENV }                from "../config/env";
import { createLogger }       from "./shared/utils/logs/Logger";
import { scheduleBuyCryptoJobs }          from "./buy_crypto/infrastructure/jobs/BuyCryptoJobScheduler";
import { startRefreshExchangeRatesWorker } from "./buy_crypto/infrastructure/jobs/workers/RefreshExchangeRatesWorker";
import { startExpireStaleOrdersWorker }    from "./buy_crypto/infrastructure/jobs/workers/ExpireStaleOrdersWorker";

const logger = createLogger("Bootstrap");

async function run() {
    try {
        logger.info(`🚀 Initializing SERVICE ${ENV.SERVICE_NAME} BITDOOT`);
        logger.info(`Environment: ${ENV.DEPLOY_ENV}`);
        logger.info(`Port: ${ENV.PORT}`);

        // 1. MongoDB
        logger.info("Connecting to MongoDB...");
        await mongoDBConfig.connect();

        // 2. Redis
        logger.info("Connecting to Redis...");
        await connectRedis();

        // 3. Registrar jobs en las colas (repeat)
        await scheduleBuyCryptoJobs();

        // 4. Arrancar workers que procesan los jobs
        const rateWorker   = startRefreshExchangeRatesWorker();
        const expiryWorker = startExpireStaleOrdersWorker();

        // 5. App HTTP
        const app    = createApp();
        const PORT   = Number(ENV.PORT) || 4200;
        const server = Bun.serve({ port: PORT, fetch: app.fetch });

        console.log("");
        console.log("✅ SERVICE BUY CRYPTO BITDOOT running");
        console.log(`🌐 Server:  http://localhost:${PORT}`);
        console.log(`🔗 Health:  http://localhost:${PORT}/health`);
        console.log(`🔗 Orders:  http://localhost:${PORT}/v1/buy_crypto`);
        console.log("");

        // 6. Graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`\n${signal} received — shutting down...`);
            try {
                await rateWorker.close();
                await expiryWorker.close();
                server.stop();
                await mongoDBConfig.disconnect();
                await disconnectRedis();
                console.log("✅ Shutdown complete");
                process.exit(0);
            } catch (err) {
                console.error("❌ Error during shutdown:", err);
                process.exit(1);
            }
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT",  () => shutdown("SIGINT"));

    } catch (error) {
        console.error("❌ Failed to start service-buy-orders-crypto-bitdoot:", error);
        process.exit(1);
    }
}

run();