export const BuyCryptoOrderTokens = {
    AssetPriceProviderPort:         Symbol.for("AssetPriceProviderPort"),
    BuyCryptoOrderRepositoryPort:   Symbol.for("BuyCryptoOrderRepositoryPort"),
    ExchangeRateCachePort:          Symbol.for("ExchangeRateCachePort"),
    CreateBuyCryptoOrderUseCase:    Symbol.for("CreateBuyCryptoOrderUseCase"),
    SimulatePaymentApprovalUseCase: Symbol.for("SimulatePaymentApprovalUseCase"),
} as const;