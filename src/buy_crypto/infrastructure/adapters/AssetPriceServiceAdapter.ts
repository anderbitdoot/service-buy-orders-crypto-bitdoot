import { injectable } from "tsyringe";
import type { AssetPriceProviderPort, TokenPrice } from "../../domain/ports/out/AssetPriceProviderPort";
import { ENV } from "../../../../config/env";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("AssetPriceServiceAdapter");

interface DataCommonsAsset {
    name:      string;
    coinId:    string;
    price:     number;
    symbol:    string;
    change24h: number;
    minAmount: number;
}

interface CommonsAssetsResponse {
    meta: { success: boolean; numRecords: number; totalRecords: number };
    data: DataCommonsAsset[];
}

@injectable()
export class AssetPriceServiceAdapter implements AssetPriceProviderPort {
    async getPricesByQuote(quoteCurrency: string): Promise<TokenPrice[]> {
        const url = `${ENV.COMMONS_ASSETS_API_URL}?quote=${quoteCurrency.toUpperCase()}`;

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), ENV.REQUEST_TIMEOUT_MS);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${ENV.COMMONS_SERVICE_TOKEN}`,
                    "Content-Type":  "application/json",
                },
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!response.ok) {
                logger.error(`HTTP ${response.status} fetching prices for quote=${quoteCurrency}`, false);
                return [];
            }

            const json = (await response.json()) as CommonsAssetsResponse;

            if (!json?.meta?.success || !Array.isArray(json.data)) {
                logger.warn(`Invalid response from commons assets`, false);
                return [];
            }

            const results: TokenPrice[] = json.data
                .filter((item) => item.price > 0)
                .map((item) => ({
                    symbol: item.symbol.toUpperCase(),
                    price:  item.price,
                }));

            if (results.length > 0) {
                logger.info(
                    `${new Date().toLocaleString()} Prices for ${quoteCurrency.toUpperCase()}: ${results.map(r => `${r.symbol}=${r.price}`).join(", ")}`,
                    false
                );
            } else {
                logger.warn(`Commons returned all prices as 0 for quote=${quoteCurrency}`, false);
            }

            return results;

        } catch (err) {
            logger.error(`Failed to fetch prices for quote=${quoteCurrency}`, false, err);
            return [];
        }
    }
}