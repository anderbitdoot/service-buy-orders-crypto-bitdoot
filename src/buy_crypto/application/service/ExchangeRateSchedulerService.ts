import { inject, injectable } from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type { AssetPriceProviderPort } from "../../domain/ports/out/AssetPriceProviderPort";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("ExchangeRateScheduler");

@injectable()
export class ExchangeRateSchedulerService {
    private intervalId?: ReturnType<typeof setInterval>;

    constructor(
        @inject(BuyCryptoOrderTokens.AssetPriceProviderPort)
        private readonly assetPriceProvider: AssetPriceProviderPort,
        @inject(BuyCryptoOrderTokens.ExchangeRateCachePort)
        private readonly exchangeRateCache: ExchangeRateCachePort
    ) {}

    start(intervalMs: number): void {
        this.refresh();
        this.intervalId = setInterval(() => this.refresh(), intervalMs);
        logger.info(`Exchange rate refresh scheduled every ${intervalMs}ms`, false);
    }

    stop(): void {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    private async refresh(): Promise<void> {
        try {
            const price = await this.assetPriceProvider.getPrice("USDT");
            if (price > 0) {
                this.exchangeRateCache.setRate("pen_usdt", price);
            }
        } catch (err) {
            logger.error("Failed to refresh pen_usdt exchange rate", false, err);
        }
    }
}