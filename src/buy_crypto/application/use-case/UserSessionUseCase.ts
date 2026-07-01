import "reflect-metadata";

import { inject, injectable } from "tsyringe";
import type { IUserSessionUseCase} from "../../domain/ports/in/IUserSessionUSeCase";
import type { UserSessionRepositoryPort} from "../../domain/ports/out/UserSessionRepositoryPort";
import { UserSessionDTO} from "../../infrastructure/api/dto/UserSessionDTO";
import { UserSessionMapper} from "../../infrastructure/api/mapper/UserSessionMapper";


@injectable()
export class UserSessionUseCase implements IUserSessionUseCase {
    constructor(
        @inject("UserSessionRepositoryAdapter") private userSessionRepositoryPort: UserSessionRepositoryPort
    ) {
        this.userSessionRepositoryPort = userSessionRepositoryPort;
    }

    async findUserSessionByToken(token: string): Promise<UserSessionDTO | null> {
        return this.userSessionRepositoryPort.findUserSessionByToken(token).then(userSession => {
            if (userSession === null) {
                return null;
            }
            return UserSessionMapper.toDTO(userSession);
        });
    }

    async findUserSessionByEmail(email: string): Promise<UserSessionDTO | null> {

        return this.userSessionRepositoryPort.findUserSessionByEmail(email).then(userSession => {
            if (userSession === null) {
                return null;
            }
            return UserSessionMapper.toDTO(userSession);
        });
    }

}