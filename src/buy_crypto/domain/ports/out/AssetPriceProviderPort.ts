export interface TokenPrice {
    symbol: string;
    name:   string;
    coinId: string;
    price:  number;
}

export interface AssetPriceProviderPort {
    getPricesByQuote(quoteCurrency: string): Promise<TokenPrice[]>;
}