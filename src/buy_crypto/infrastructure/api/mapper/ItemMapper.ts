import { ItemDTO } from '../dto/ItemDTO';
import { ItemDocument} from "../../repository/models/ItemModel";


export class ItemMapper {

  static toDTO(item: ItemDocument): ItemDTO {
    return {
      name: item.name,
      value: item.value
    };
  } 

  static toDocument(item: ItemDTO): Partial<ItemDocument> {
    return {
      name: item.name,
      value: item.value
    };
  }

  static toDTOArray(items: ItemDocument[]): ItemDTO[] {
    return items.map(this.toDTO);
  }


}