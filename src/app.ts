import { Hono } from "hono";
import { registerMiddlewares } from "../config/middleware";
import { ErrorHandler } from "./shared/utils/error/errorHandler";
import { mongoDBConfig } from "./shared/database/mongodb";
import { registerRoutes } from "../config/routes";
import {
    registerBuyCryptoOrderDependencies,
} from "./buy_crypto/infrastructure/di/BuyCryptoOrderContainer";
import {registerAuthDependencies} from "./shared/di/AuthContainer";

export function createApp(): Hono {
    const app = new Hono().basePath("/v1");

    registerMiddlewares(app);

    app.onError((err, c) => ErrorHandler.handle(c, err));

    app.get("/", (c) => c.json({
        status: "ok",
        service: "bitdoot-buy-crypto-order-api",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    }));

    app.get("/health", async (c) => {
        const mongoHealthy = await mongoDBConfig.healthCheck();
        const isHealthy = mongoHealthy && mongoDBConfig.isConnectionActive();
        return c.json({
            healthy: isHealthy,
            timestamp: new Date().toISOString(),
            services: { api: true, mongodb: mongoHealthy },
        }, isHealthy ? 200 : 503);
    });

    registerAuthDependencies();
    registerBuyCryptoOrderDependencies();

    registerRoutes(app);

    app.notFound((c) => c.json({ error: "Not Found", path: c.req.path }, 404));

    return app;
}