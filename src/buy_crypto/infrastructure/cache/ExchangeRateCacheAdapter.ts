import { injectable } from "tsyringe";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";

@injectable()
export class ExchangeRateCacheAdapter implements ExchangeRateCachePort {
    private readonly rates = new Map<string, number>();

    getRate(pair: string): number | null {
        return this.rates.get(pair) ?? null;
    }

    setRate(pair: string, rate: number): void {
        this.rates.set(pair, rate);
    }
}