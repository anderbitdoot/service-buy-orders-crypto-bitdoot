export const BuyCryptoOrderTokens = {
    AssetPriceProviderPort: Symbol.for("AssetPriceProviderPort"),
    BuyCryptoOrderRepositoryPort: Symbol.for("BuyCryptoOrderRepositoryPort"),
    ExchangeRateCachePort: Symbol.for("ExchangeRateCachePort"),
    WalletBalancePort: Symbol.for("WalletBalancePort"),
    CreateBuyCryptoOrderUseCase: Symbol.for("CreateBuyCryptoOrderUseCase"),
    ExchangeRateSchedulerService: Symbol.for("ExchangeRateSchedulerService"),
} as const;