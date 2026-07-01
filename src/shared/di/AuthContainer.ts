import { container } from "tsyringe";
import { UserSessionRepository } from "../../buy_crypto/infrastructure/repository/UserSessionRepository";
import { UserSessionRepositoryAdapter } from "../../buy_crypto/infrastructure/repository/adapter/UserSessionRepositoryAdapter";

export function registerAuthDependencies(): void {
    container.registerSingleton("UserSessionRepository", UserSessionRepository);
    container.registerSingleton("UserSessionRepositoryAdapter", UserSessionRepositoryAdapter);
}