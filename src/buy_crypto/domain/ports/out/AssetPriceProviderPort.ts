export interface TokenPrice {
    symbol: string;
    price:  number;
}

export interface AssetPriceProviderPort {
    getPricesByQuote(quoteCurrency: string): Promise<TokenPrice[]>;
}