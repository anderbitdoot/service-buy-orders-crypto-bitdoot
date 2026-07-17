import type { BuyCryptoOrder } from "../../model/BuyCryptoOrder";
import type { OrderStatus }    from "../../enums/OrderStatus";

export interface BuyCryptoOrderRepositoryPort {
    save(order: BuyCryptoOrder): Promise<void>;
    findByOrderId(orderId: string): Promise<BuyCryptoOrder | null>;
    findPendingByPair(from: string, to: string): Promise<BuyCryptoOrder[]>;
    findExpiredPending(): Promise<BuyCryptoOrder[]>;
    updatePrice(orderId: string, price: number, receiveAmount: number, expireAt: Date): Promise<void>;
    updateStatus(orderId: string, status: OrderStatus, extra?: { paidAt?: Date; cancelledAt?: Date }): Promise<BuyCryptoOrder | null>;
    cancelMany(orderIds: string[]): Promise<number>;
}