export const BuyCryptoJobNames = {
    REFRESH_EXCHANGE_RATES: "refresh-exchange-rates",
    EXPIRE_STALE_ORDERS:    "expire-stale-orders",
} as const;

export type BuyCryptoJobName = typeof BuyCryptoJobNames[keyof typeof BuyCryptoJobNames];