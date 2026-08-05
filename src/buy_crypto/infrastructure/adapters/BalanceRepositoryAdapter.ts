import { injectable }     from "tsyringe";
import { BalanceModel }   from "../persistance/mongoose/BalanceModel";
import type { BalanceRepositoryPort, BalanceDocument } from "../../domain/ports/out/BalanceRepositoryPort";
import mongoose           from "mongoose";

@injectable()
export class BalanceRepositoryAdapter implements BalanceRepositoryPort {

    async findByUserId(userId: string): Promise<BalanceDocument | null> {
        const doc = await BalanceModel.findOne({
            userId: new mongoose.Types.ObjectId(userId),
        }).lean();

        if (!doc) return null;

        return {
            _id:          doc._id.toString(),
            userId:       doc.userId.toString(),
            balanceItems: (doc.balanceItems ?? []).map(item => ({
                currency:     item.currency,
                currencyName: item.currencyName,
                amountTotal:  item.amountTotal,
            })),
        };
    }

    async updateBalance(id: string, balance: BalanceDocument): Promise<void> {
        await BalanceModel.findByIdAndUpdate(
            id,
            { balanceItems: balance.balanceItems },
            { returnDocument: "after" },
        );
    }
}