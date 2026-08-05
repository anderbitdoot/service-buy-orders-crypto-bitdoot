export const BuyCryptoOrderTokens = {
    AssetPriceProviderPort:         Symbol.for("AssetPriceProviderPort"),
    BuyCryptoOrderRepositoryPort:   Symbol.for("BuyCryptoOrderRepositoryPort"),
    ExchangeRateCachePort:          Symbol.for("ExchangeRateCachePort"),
    BalanceRepositoryPort:          Symbol.for("BuyCryptoBalanceRepositoryPort"),
    CreateBuyCryptoOrderUseCase:    Symbol.for("CreateBuyCryptoOrderUseCase"),
    SimulatePaymentApprovalUseCase: Symbol.for("SimulatePaymentApprovalUseCase"),
    UpdateBalanceOnPaymentUseCase:  Symbol.for("UpdateBalanceOnPaymentUseCase"),
} as const;