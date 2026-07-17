import { container } from "tsyringe";
import { BuyCryptoOrderTokens }              from "./BuyCryptoOrderTokens";
import { AssetPriceServiceAdapter }          from "../adapters/AssetPriceServiceAdapter";
import { BuyCryptoOrderRepositoryAdapter }   from "../adapters/BuyCryptoOrderRepositoryAdapter";
import { ExchangeRateCacheAdapter }          from "../cache/ExchangeRateCacheAdapter";
import { CreateBuyCryptoOrderUseCaseImpl }   from "../../application/use-case/CreateBuyCryptoOrderUseCaseImpl";
import { SimulatePaymentApprovalUseCaseImpl } from "../../application/use-case/SimulatePaymentApprovalUseCaseImpl";

export function registerBuyCryptoOrderDependencies(): void {
    container.registerSingleton(BuyCryptoOrderTokens.AssetPriceProviderPort,          AssetPriceServiceAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort,    BuyCryptoOrderRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.ExchangeRateCachePort,           ExchangeRateCacheAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.CreateBuyCryptoOrderUseCase,     CreateBuyCryptoOrderUseCaseImpl);
    container.registerSingleton(BuyCryptoOrderTokens.SimulatePaymentApprovalUseCase,  SimulatePaymentApprovalUseCaseImpl);
}