import { randomUUID } from "crypto";
import { InvalidOrderAmountError } from "../error/BuyCryptoOrderDomainError";
import { BuyCryptoOrderConstants } from "../constants/BuyCryptoOrderConstants";

export interface BuyCryptoOrderProps {
    orderId:       string;
    userId?:       string;
    from:          string;
    to:            string;
    amount:        number;
    receiveAmount: number;
    price:         number;
    feeRate:       number;
    feeAmount:     number;
    total:         number;
    expireAt:      Date;
    createdAt:     Date;
}

export interface CreateBuyCryptoOrderProps {
    userId?:       string;
    from:          string;
    to:            string;
    amount:        number;
    receiveAmount: number;
    price:         number;
    feeRate:       number;
    feeAmount:     number;
    total:         number;
}

export class BuyCryptoOrder {
    private constructor(private readonly props: BuyCryptoOrderProps) {}

    static create(props: CreateBuyCryptoOrderProps): BuyCryptoOrder {
        if (!props.amount || props.amount <= 0) {
            throw new InvalidOrderAmountError(props.amount);
        }

        const now      = new Date();
        const expireAt = new Date(
            now.getTime() + BuyCryptoOrderConstants.QUOTE_EXPIRATION_MINUTES * 60 * 1000
        );

        return new BuyCryptoOrder({
            orderId:       randomUUID(),
            userId:        props.userId,
            from:          props.from,
            to:            props.to,
            amount:        props.amount,
            receiveAmount: props.receiveAmount,
            price:         props.price,
            feeRate:       props.feeRate,
            feeAmount:     props.feeAmount,
            total:         props.total,
            expireAt,
            createdAt: now,
        });
    }

    static fromPersistence(props: BuyCryptoOrderProps): BuyCryptoOrder {
        return new BuyCryptoOrder(props);
    }

    get orderId(): string            { return this.props.orderId; }
    get userId(): string | undefined { return this.props.userId; }
    get from(): string               { return this.props.from; }
    get to(): string                 { return this.props.to; }
    get amount(): number             { return this.props.amount; }
    get receiveAmount(): number      { return this.props.receiveAmount; }
    get price(): number              { return this.props.price; }
    get feeRate(): number            { return this.props.feeRate; }
    get feeAmount(): number          { return this.props.feeAmount; }
    get total(): number              { return this.props.total; }
    get expireAt(): Date             { return this.props.expireAt; }
    get createdAt(): Date            { return this.props.createdAt; }

    isExpired(): boolean {
        return this.props.expireAt.getTime() < Date.now();
    }

    toPersistence(): BuyCryptoOrderProps {
        return { ...this.props };
    }
}