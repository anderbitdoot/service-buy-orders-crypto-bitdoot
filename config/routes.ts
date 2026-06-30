import type { Hono } from "hono";
import { buyCryptoOrderRouter } from "../src/buy_crypto/infrastructure/api/controllers/BuyCryptoOrderController";

export function registerRoutes(app: Hono): void {
    app.route("/buy_crypto", buyCryptoOrderRouter);
}