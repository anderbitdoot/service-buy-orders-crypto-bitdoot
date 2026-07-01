import { container } from "tsyringe";
import { BuyCryptoOrderTokens } from "./BuyCryptoOrderTokens";
import { AssetPriceServiceAdapter } from "../adapters/AssetPriceServiceAdapter";
import { BuyCryptoOrderRepositoryAdapter } from "../adapters/BuyCryptoOrderRepositoryAdapter";
import { WalletBalanceHttpAdapter } from "../adapters/WalletBalanceHttpAdapter";
import { ExchangeRateCacheAdapter } from "../cache/ExchangeRateCacheAdapter";
import { CreateBuyCryptoOrderUseCaseImpl } from "../../application/use-case/CreateBuyCryptoOrderUseCaseImpl";
import { ExchangeRateSchedulerService} from "../../application/service/ExchangeRateSchedulerService";

export function registerBuyCryptoOrderDependencies(): void {
    container.registerSingleton(BuyCryptoOrderTokens.AssetPriceProviderPort, AssetPriceServiceAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort, BuyCryptoOrderRepositoryAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.WalletBalancePort, WalletBalanceHttpAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.ExchangeRateCachePort, ExchangeRateCacheAdapter);
    container.registerSingleton(BuyCryptoOrderTokens.CreateBuyCryptoOrderUseCase, CreateBuyCryptoOrderUseCaseImpl);
    container.registerSingleton(BuyCryptoOrderTokens.ExchangeRateSchedulerService, ExchangeRateSchedulerService);
}