import type { BuyCryptoOrder } from "../../model/BuyCryptoOrder";

export interface BuyCryptoOrderRepositoryPort {
    save(order: BuyCryptoOrder): Promise<void>;
    findByOrderId(orderId: string): Promise<BuyCryptoOrder | null>;
}