export const BuyCryptoOrderTokens = {
    AssetPriceProviderPort:          Symbol.for("AssetPriceProviderPort"),
    BuyCryptoOrderRepositoryPort:    Symbol.for("BuyCryptoOrderRepositoryPort"),
    ExchangeRateCachePort:           Symbol.for("ExchangeRateCachePort"),
    CreateBuyCryptoOrderUseCase:     Symbol.for("CreateBuyCryptoOrderUseCase"),
    ExchangeRateSchedulerService:    Symbol.for("ExchangeRateSchedulerService"),
} as const;