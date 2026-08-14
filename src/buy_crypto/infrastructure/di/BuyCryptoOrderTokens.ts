export const BuyCryptoOrderTokens = {
    AssetPriceProviderPort:         Symbol.for("AssetPriceProviderPort"),
    BuyCryptoOrderRepositoryPort:   Symbol.for("BuyCryptoOrderRepositoryPort"),
    ExchangeRateCachePort:          Symbol.for("ExchangeRateCachePort"),
    BalanceRepositoryPort:          Symbol.for("BuyCryptoBalanceRepositoryPort"),
    TransactionRepositoryPort:      Symbol.for("BuyCryptoTransactionRepositoryPort"),
    SequenceRepositoryPort:         Symbol.for("BuyCryptoSequenceRepositoryPort"),
    CreateBuyCryptoOrderUseCase:    Symbol.for("CreateBuyCryptoOrderUseCase"),
    SimulatePaymentApprovalUseCase: Symbol.for("SimulatePaymentApprovalUseCase"),
    UpdateBalanceOnPaymentUseCase:  Symbol.for("UpdateBalanceOnPaymentUseCase"),
    RecordBuyCryptoTransactionUseCase: Symbol.for("RecordBuyCryptoTransactionUseCase"),
} as const;