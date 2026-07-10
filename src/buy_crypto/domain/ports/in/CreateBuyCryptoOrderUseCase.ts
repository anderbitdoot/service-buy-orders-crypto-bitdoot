import type { BuyCryptoOrder } from "../../model/BuyCryptoOrder";

export interface CreateBuyCryptoOrderInput {
    userId?: string;
    from:    string;
    to:      string;
    amount:  number;
}

export interface CreateBuyCryptoOrderUseCase {
    execute(input: CreateBuyCryptoOrderInput): Promise<BuyCryptoOrder>;
}