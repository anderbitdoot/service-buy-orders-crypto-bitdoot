export const BuyCryptoOrderConstants = {
    FEE_RATE:                 0.10,
    QUOTE_EXPIRATION_MINUTES: 5,

    SUPPORTED_FROM_CURRENCIES: ["PEN", "USD"] as const,
    SUPPORTED_TO_TOKENS:       ["USDT", "BTC", "ETH"] as const,
} as const;
