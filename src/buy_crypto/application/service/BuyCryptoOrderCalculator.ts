import { BuyCryptoOrderConstants } from "../../domain/constants/BuyCryptoOrderConstants";

export interface BuyCryptoOrderCalculationInput {
    amount: number;
    price: number;
}

export interface BuyCryptoOrderCalculationResult {
    receiveAmount: number;
    feeRate: number;
    feeAmount: number;
    total: number;
}

function round(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

export class BuyCryptoOrderCalculator {
    static calculate({ amount, price }: BuyCryptoOrderCalculationInput): BuyCryptoOrderCalculationResult {
        const feeRate = BuyCryptoOrderConstants.FEE_RATE;
        const feeAmount = round(amount * feeRate, 2);
        const total = round(amount + feeAmount, 2);
        const receiveAmount = round(amount / price, 6);

        return { receiveAmount, feeRate, feeAmount, total };
    }
}