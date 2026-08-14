import { injectable } from "tsyringe";
import { SequenceModel } from "../persistance/mongoose/SequenceModel";
import type { SequenceRepositoryPort } from "../../domain/ports/out/SequenceRepositoryPort";

@injectable()
export class SequenceRepositoryAdapter implements SequenceRepositoryPort {

    async getNextOpCode(): Promise<string> {
        const sequence = await SequenceModel.findOneAndUpdate(
            {},
            { $inc: { sequenceValue: 1 } },
            { new: true, upsert: true },
        );

        return String(sequence.sequenceValue).padStart(9, "0");
    }
}
