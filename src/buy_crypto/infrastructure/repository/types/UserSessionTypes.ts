import type { Repository } from "../generics/RepositoryTypes.js";
import { UserSessionDocument } from "../models/UserSessionModel.js";

export interface IUserSessionRepository extends Repository<UserSessionDocument> {

  findByEmail(email: string): Promise<UserSessionDocument| null>;

  findByToken(token: string): Promise<UserSessionDocument | null>;

}
