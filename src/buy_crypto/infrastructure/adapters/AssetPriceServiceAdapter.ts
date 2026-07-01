import { injectable } from "tsyringe";
import type { AssetPriceProviderPort } from "../../domain/ports/out/AssetPriceProviderPort";
import { ENV } from "../../../../config/env";

interface CommonsAsset {
    name: string;
    coinId: string;
    price: number;
    symbol: string;
    change24h: number;
    minAmount: number;
}

interface CommonsAssetsResponse {
    meta: { success: boolean; numRecords: number; totalRecords: number };
    data: CommonsAsset[];
}

@injectable()
export class AssetPriceServiceAdapter implements AssetPriceProviderPort {
    async getPrice(symbol: string): Promise<number> {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), ENV.REQUEST_TIMEOUT_MS);

            const response = await fetch(ENV.COMMONS_ASSETS_API_URL, {
                method: "GET",
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!response.ok) return 0;

            const json = (await response.json()) as CommonsAssetsResponse;

            if (!json?.meta?.success || !Array.isArray(json.data)) return 0;

            const asset = json.data.find(
                (item) => item.symbol?.toUpperCase() === symbol.toUpperCase()
            );

            if (!asset || !asset.price || asset.price <= 0) return 0;

            return asset.price;
        } catch {
            return 0;
        }
    }
}