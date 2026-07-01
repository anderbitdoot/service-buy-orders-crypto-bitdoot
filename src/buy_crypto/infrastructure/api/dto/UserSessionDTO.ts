import { StepDTO} from "./StepDTO";

export interface UserSessionDTO {
    _id?: string;
    email: string;
    password?: string;
    securityLevel: number;
    token: string;
    cellphone?: string;
    steps?: StepDTO[];
}