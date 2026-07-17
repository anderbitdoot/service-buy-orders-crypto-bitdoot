import { inject, injectable } from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type { AssetPriceProviderPort } from "../../domain/ports/out/AssetPriceProviderPort";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";
import { BuyCryptoOrderConstants } from "../../domain/constants/BuyCryptoOrderConstants";
import { ENV } from "../../../../config/env";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("ExchangeRateMonitor");

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
        logger.info(`Exchange rate monitor started — polling every ${intervalMs / 1000}s`, false);
        this.refresh();
        this.intervalId = setInterval(() => this.refresh(), intervalMs);
        logger.info(`Starting at ${new Date().toLocaleString()}`, false);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    private async refresh(): Promise<void> {
        for (const from of BuyCryptoOrderConstants.SUPPORTED_FROM_CURRENCIES) {
            await this.refreshQuote(from);
        }
    }

    private async refreshQuote(fromCurrency: string): Promise<void> {
        try {
            const prices = await this.assetPriceProvider.getPricesByQuote(fromCurrency);

            if (prices.length === 0) {
                logger.warn(`No prices returned for quote=${fromCurrency.toUpperCase()}`, false);
                return;
            }

            for (const { symbol, price } of prices) {
                const pair     = `${fromCurrency.toLowerCase()}_${symbol.toLowerCase()}`;
                const previous = this.exchangeRateCache.getRate(pair);

                this.exchangeRateCache.setRate(pair, price);
            }
        } catch (err) {
            logger.error(`Failed to refresh rates for quote=${fromCurrency}`, false, err);
        }
    }
}