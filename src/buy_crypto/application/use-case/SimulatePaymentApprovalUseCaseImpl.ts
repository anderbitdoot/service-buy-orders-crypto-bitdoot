import { inject, injectable }  from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type { BuyCryptoOrderRepositoryPort }      from "../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import type { UpdateBalanceOnPaymentUseCaseImpl } from "./UpdateBalanceOnPaymentUseCaseImpl";
import { BuyCryptoOrder }   from "../../domain/model/BuyCryptoOrder";
import { OrderStatus }      from "../../domain/enums/OrderStatus";
import { ENV }              from "../../../../config/env";
import { createLogger }     from "../../../shared/utils/logs/Logger";

const logger = createLogger("SimulatePaymentApproval");

@injectable()
export class SimulatePaymentApprovalUseCaseImpl {
    constructor(
        @inject(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort)
        private readonly repository: BuyCryptoOrderRepositoryPort,

        @inject(BuyCryptoOrderTokens.UpdateBalanceOnPaymentUseCase)
        private readonly updateBalance: UpdateBalanceOnPaymentUseCaseImpl,
    ) {}

    async execute(orderId: string): Promise<BuyCryptoOrder> {
        const order = await this.repository.findByOrderId(orderId);

        if (!order) {
            throw new Error(`Order '${orderId}' not found`);
        }

        if (order.isCancelled()) {
            throw new Error(
                `Order '${orderId}' is cancelled (expired). ` +
                `The user must contact support to resolve a late payment.`
            );
        }

        if (order.isPaid()) {
            throw new Error(`Order '${orderId}' is already marked as paid`);
        }

        const deadline = new Date(order.createdAt.getTime() + ENV.ORDER_EXPIRY_MS);
        if (new Date() > deadline) {
            throw new Error(
                `Order '${orderId}' exceeded the payment window ` +
                `(${ENV.ORDER_EXPIRY_MS / 60_000} min). Contact support.`
            );
        }

        const updated = await this.repository.updateStatus(
            orderId,
            OrderStatus.PAYED,
            { paidAt: new Date() },
        );

        if (!updated) throw new Error(`Failed to update order '${orderId}'`);

        try {
            await this.updateBalance.execute(updated);
        } catch (err) {
            logger.error(
                `Balance update failed for orderId=${orderId} — order is payed but balance was not updated`,
                err
            );
        }

        return updated;
    }
}