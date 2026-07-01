export const BuyCryptoOrderConstants = {
    FEE_RATE: 0.10,
    DEFAULT_EXCHANGE_RATE: 3.5, // remover luego
    QUOTE_EXPIRATION_MINUTES: 5,
    SUPPORTED_FROM_CURRENCIES: ["pen"] as const,
    SUPPORTED_TO_CURRENCIES: ["usdt"] as const,
} as const;