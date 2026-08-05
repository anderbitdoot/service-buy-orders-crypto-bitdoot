export interface TokenPrice {
    symbol: string;
    name:   string;
    price:  number;
}

export interface AssetPriceProviderPort {
    getPricesByQuote(quoteCurrency: string): Promise<TokenPrice[]>;
}