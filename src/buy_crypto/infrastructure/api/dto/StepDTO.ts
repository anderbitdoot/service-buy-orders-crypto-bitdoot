import { ItemDTO } from "./ItemDTO";

export interface StepDTO {
    name: string;
    order: number;
    status: boolean;
    process: string;
    items?: ItemDTO[];

}