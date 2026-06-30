import "reflect-metadata";
import { createApp } from "./app";
import { mongoDBConfig} from "./shared/database/mongodb";
import { ENV} from "../config/env";
import {createLogger} from "./shared/utils/logs/Logger";

async function run() {
    const logger = createLogger("Bootstrap");
    try {
        logger.info(`Initializing SERVICE ${ENV.SERVICE_NAME} BITDOOT`, false);
        logger.info(`Environment: ${ENV.DEPLOY_ENV}`, false);
        logger.info(`Port: ${ENV.PORT}`, false);
        logger.info("Connecting to MongoDB...", false);
        await mongoDBConfig.connect();

        const app = createApp();
        const PORT = Number(ENV.PORT) || 4200;
        const server = Bun.serve({
            port: PORT,
            fetch: app.fetch,
        });

        console.log("");
        console.log("✅ SERVICE BUY CRYPTO BITDOOT running");
        console.log(`🌐 Server:    http://localhost:${PORT}`);
        console.log(`🔗 Health:    http://localhost:${PORT}/health`);
        console.log(`🔗 Wallet:    http://localhost:${PORT}/v1/buy-crypto-order`);
        console.log("");

        const shutdown = async (signal: string) => {
            console.log(`\n${signal} received — shutting down gracefully...`);
            try {
                server.stop();
                await mongoDBConfig.disconnect();
                console.log("✅ Shutdown complete");
                process.exit(0);
            } catch (error) {
                console.error("❌ Error during shutdown:", error);
                process.exit(1);
            }
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error("❌ Failed to start service-wallet-bitdoot:", error);
        process.exit(1);
    }
}

run();
