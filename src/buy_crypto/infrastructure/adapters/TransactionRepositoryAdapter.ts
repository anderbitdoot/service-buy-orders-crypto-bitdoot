import { injectable } from "tsyringe";
import mongoose        from "mongoose";
import { TransactionModel } from "../persistance/mongoose/TransactionModel";
import type { TransactionRepositoryPort, CreateTransactionInput } from "../../domain/ports/out/TransactionRepositoryPort";

@injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    async createTransaction(input: CreateTransactionInput): Promise<void> {
        await TransactionModel.create({
            userId:   new mongoose.Types.ObjectId(input.userId),
            amount:   input.amount,
            currency: input.currency,
            from:     input.from,
            to:       input.to,
            hash:     input.hash,
            type:     input.type,
            refId:    new mongoose.Types.ObjectId(input.refId),
            status:   input.status,
            opCode:   input.opCode,
        });
    }
}
