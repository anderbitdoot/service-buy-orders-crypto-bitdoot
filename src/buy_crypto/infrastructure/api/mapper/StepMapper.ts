import { StepDocument} from "../../repository/models/StepModel";
import { StepDTO } from '../dto/StepDTO';
import { ItemMapper } from './ItemMapper';
import { ItemDocument} from "../../repository/models/ItemModel";

export class StepMapper {

    static toDTO(step: StepDocument): StepDTO {
        return {
          name: step.name,
          order: step.order,
          status: step.status,
          process: step.process,
          items: step.items?.map(item => ItemMapper.toDTO(item))
        };
    }

    static toDocument(step: StepDTO): Partial<StepDocument> {
        return {
            name: step.name,
            order: step.order,
            status: step.status,
            process: step.process,
            items: step.items?.map(item => ItemMapper.toDocument(item) as ItemDocument)
        };
    }

    static toDTOArray(steps: StepDocument[]): StepDTO[] {
        return steps.map(this.toDTO);
    }
}