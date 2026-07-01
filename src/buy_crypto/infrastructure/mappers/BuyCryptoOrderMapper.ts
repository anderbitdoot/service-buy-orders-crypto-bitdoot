import type { BuyCryptoOrder } from "../../domain/model/BuyCryptoOrder";

export interface BuyCryptoOrderResponseData {
    quote_id: string;
    from: string;
    to: string;
    amount: number;
    receive_amount: number;
    price: number;
    fee_rate: number;
    fee_amount: number;
    total: number;
    expire_at: string;
}

export class BuyCryptoOrderMapper {
    static toResponse(order: BuyCryptoOrder): BuyCryptoOrderResponseData {
        return {
            quote_id: order.orderId,
            from: order.from,
            to: order.to,
            amount: order.amount,
            receive_amount: order.receiveAmount,
            price: order.price,
            fee_rate: order.feeRate,
            fee_amount: order.feeAmount,
            total: order.total,
            expire_at: order.expireAt.toISOString(),
        };
    }
}