import { container } from "tsyringe";
import { BuyCryptoOrderTokens }              from "./BuyCryptoOrderTokens";
import { AssetPriceServiceAdapter }          from "../adapters/AssetPriceServiceAdapter";
import { BuyCryptoOrderRepositoryAdapter }   from "../adapters/BuyCryptoOrderRepositoryAdapter";
import { BalanceRepositoryAdapter }          from "../adapters/BalanceRepositoryAdapter";
import { TransactionRepositoryAdapter }      from "../adapters/TransactionRepositoryAdapter";
import { SequenceRepositoryAdapter }         from "../adapters/SequenceRepositoryAdapter";
import { ExchangeRateCacheAdapter }          from "../cache/ExchangeRateCacheAdapter";
import { CreateBuyCryptoOrderUseCaseImpl }   from "../../application/use-case/CreateBuyCryptoOrderUseCaseImpl";
import { SimulatePaymentApprovalUseCaseImpl } from "../../application/use-case/SimulatePaymentApprovalUseCaseImpl";
import { UpdateBalanceOnPaymentUseCaseImpl } from "../../application/use-case/UpdateBalanceOnPaymentUseCaseImpl";
import { RecordBuyCryptoTransactionUseCaseImpl } from "../../application/use-case/RecordBuyCryptoTransactionUseCaseImpl";

export function registerBuyCryptoOrderDependencies(): void {
    container.registerSingleton(BuyCryptoOrderTokens.AssetPriceProviderPort,         AssetPriceServiceAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort,   BuyCryptoOrderRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.BalanceRepositoryPort,          BalanceRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.TransactionRepositoryPort,      TransactionRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.SequenceRepositoryPort,         SequenceRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.ExchangeRateCachePort,          ExchangeRateCacheAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.CreateBuyCryptoOrderUseCase,    CreateBuyCryptoOrderUseCaseImpl);
    container.registerSingleton(BuyCryptoOrderTokens.UpdateBalanceOnPaymentUseCase,  UpdateBalanceOnPaymentUseCaseImpl);
    container.registerSingleton(BuyCryptoOrderTokens.RecordBuyCryptoTransactionUseCase, RecordBuyCryptoTransactionUseCaseImpl);
    container.registerSingleton(BuyCryptoOrderTokens.SimulatePaymentApprovalUseCase, SimulatePaymentApprovalUseCaseImpl);
}