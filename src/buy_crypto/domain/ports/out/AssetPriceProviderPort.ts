export interface AssetPriceProviderPort {
    getPrice(symbol: string): Promise<number>;
}