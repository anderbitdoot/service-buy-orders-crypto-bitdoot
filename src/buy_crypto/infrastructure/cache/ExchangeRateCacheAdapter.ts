import { injectable } from "tsyringe";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";

@injectable()
export class ExchangeRateCacheAdapter implements ExchangeRateCachePort {
    private readonly rates = new Map<string, number>();
    private readonly names = new Map<string, string>();
    private readonly coinIds = new Map<string, string>();

    getRate(pair: string): number | null {
        return this.rates.get(pair) ?? null;
    }

    setRate(pair: string, rate: number): void {
        this.rates.set(pair, rate);
    }

    getAssetName(symbol: string): string | null {
        return this.names.get(symbol.toUpperCase()) ?? null;
    }

    setAssetName(symbol: string, name: string): void {
        this.names.set(symbol.toUpperCase(), name);
    }

    getCoinId(symbol: string): string | null {
        return this.coinIds.get(symbol.toUpperCase()) ?? null;
    }

    setCoinId(symbol: string, coinId: string): void {
        this.coinIds.set(symbol.toUpperCase(), coinId);
    }
}