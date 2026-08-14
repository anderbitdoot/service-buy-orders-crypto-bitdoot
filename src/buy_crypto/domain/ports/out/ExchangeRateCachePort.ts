export interface ExchangeRateCachePort {
    getRate(pair: string): number | null;
    setRate(pair: string, rate: number): void;
    getAssetName(symbol: string): string | null;
    setAssetName(symbol: string, name: string): void;
    getCoinId(symbol: string): string | null;
    setCoinId(symbol: string, coinId: string): void;
}