import { injectable } from "tsyringe";
import type { WalletBalancePort, CreditWalletBalanceInput } from "../../domain/ports/out/WalletBalancePort";
import { ENV } from "../../../../config/env";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("WalletBalanceHttpAdapter");

@injectable()
export class WalletBalanceHttpAdapter implements WalletBalancePort {
    async creditBalance(input: CreditWalletBalanceInput): Promise<void> {
        try {
            const response = await fetch(`${ENV.WALLET_SERVICE_URL}/v1/wallet/credit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                logger.error(`Wallet credit failed with status ${response.status}`, false);
            }
        } catch (err) {
            logger.error("Wallet credit request failed", false, err);
        }
    }
}