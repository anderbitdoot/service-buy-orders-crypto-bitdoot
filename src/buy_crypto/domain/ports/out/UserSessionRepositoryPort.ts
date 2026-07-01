import { UserSessionDocument} from "../../../infrastructure/repository/models/UserSessionModel";

export interface UserSessionRepositoryPort {
    findUserSessionByToken(token: string): Promise<UserSessionDocument | null>;
    findUserSessionByEmail(email: string): Promise<UserSessionDocument | null>;
}