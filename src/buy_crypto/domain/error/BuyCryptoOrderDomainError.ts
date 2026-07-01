import { DomainError } from "../../../shared/utils/exceptionTypes/DomainErrors";

export class InvalidCurrencyPairError extends DomainError {
    constructor(from: string, to: string) {
        super(`Currency pair ${from}_${to} is not supported`);
        this.name = "InvalidCurrencyPairError";
    }
}

export class InvalidOrderAmountError extends DomainError {
    constructor(amount: number) {
        super(`Amount must be greater than zero, received ${amount}`);
        this.name = "InvalidOrderAmountError";
    }
}

export class AssetPriceUnavailableError extends DomainError {
    constructor(symbol: string) {
        super(`Price for ${symbol} could not be resolved`);
        this.name = "AssetPriceUnavailableError";
    }
}

export class BuyCryptoOrderNotFoundError extends DomainError {
    constructor(orderId: string) {
        super(`Buy crypto order not found: ${orderId}`);
        this.name = "BuyCryptoOrderNotFoundError";
    }
}