import "reflect-metadata"; 

import { inject, injectable } from "tsyringe";

import type { IUserSessionRepository } from "../types/UserSessionTypes";
import { UserSessionDocument } from "../models/UserSessionModel.js";
import type { UserSessionRepositoryPort} from "../../../domain/ports/out/UserSessionRepositoryPort";


@injectable()
export class UserSessionRepositoryAdapter implements UserSessionRepositoryPort {
    constructor(@inject("UserSessionRepository") private userSessionRepository: IUserSessionRepository,
    ) {
        this.userSessionRepository = userSessionRepository;
    }

    async findUserSessionByToken(token: string): Promise<UserSessionDocument | null> {
        return this.userSessionRepository.findByToken(token);
    }

    async findUserSessionByEmail(email: string): Promise<UserSessionDocument | null> {
        return this.userSessionRepository.findByEmail(email);
    }
}