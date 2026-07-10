export const BuyCryptoOrderConstants = {
    FEE_RATE:                 0.10,
    QUOTE_EXPIRATION_MINUTES: 5,

    SUPPORTED_FROM_CURRENCIES: ["pen", "usd"] as const,
    SUPPORTED_TO_TOKENS:       ["usdt", "btc", "eth"] as const,
} as const;

export type SupportedFromCurrency = typeof BuyCryptoOrderConstants.SUPPORTED_FROM_CURRENCIES[number];
export type SupportedToToken      = typeof BuyCryptoOrderConstants.SUPPORTED_TO_TOKENS[number];