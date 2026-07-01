import { UserSessionDTO} from "../../../infrastructure/api/dto/UserSessionDTO";

export interface IUserSessionUseCase {
    findUserSessionByToken(token: string): Promise<UserSessionDTO | null>;
    findUserSessionByEmail(email: string): Promise<UserSessionDTO | null>;
}   