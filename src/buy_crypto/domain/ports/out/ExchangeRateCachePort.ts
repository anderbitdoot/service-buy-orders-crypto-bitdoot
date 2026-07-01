export interface ExchangeRateCachePort {
    getRate(pair: string): number | null;
    setRate(pair: string, rate: number): void;
}