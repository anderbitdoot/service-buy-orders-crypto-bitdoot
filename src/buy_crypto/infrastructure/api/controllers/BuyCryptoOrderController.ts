import { Hono, type Context } from "hono";
import { container } from "tsyringe";
import { validateBody } from "../../../../shared/utils/middleware/validator";
import { authMiddleware } from "../../../../shared/utils/middleware/auth";
import { ApiResponseBuilder } from "../../../../shared/types/ApiResponse";
import { ErrorHandler } from "../../../../shared/utils/error/errorHandler";
import { createBuyCryptoOrderSchema, type CreateBuyCryptoOrderSchemaType } from "../../../domain/schemas/BuyCryptoOrderSchema";
import { BuyCryptoOrderTokens } from "../../di/BuyCryptoOrderTokens";
import type { CreateBuyCryptoOrderUseCase } from "../../../domain/ports/in/CreateBuyCryptoOrderUseCase";
import { BuyCryptoOrderMapper } from "../../mappers/BuyCryptoOrderMapper";
import { createLogger } from "../../../../shared/utils/logs/Logger";
import type { UserSessionDTO } from "../dto/UserSessionDTO";

const logger = createLogger("BuyCryptoOrderController");

type BuyCryptoOrderContext = Context<{
    Variables: {
        validatedData: CreateBuyCryptoOrderSchemaType;
        user: UserSessionDTO;
    };
}>;

export const buyCryptoOrderRouter = new Hono();

buyCryptoOrderRouter.post(
    "/quote",
    validateBody(createBuyCryptoOrderSchema),
    authMiddleware,
    async (c: BuyCryptoOrderContext) => {
        try {
            const { from, to, amount } = c.get("validatedData");
            const user = c.get("user");

            const useCase = container.resolve<CreateBuyCryptoOrderUseCase>(
                BuyCryptoOrderTokens.CreateBuyCryptoOrderUseCase
            );

            const order = await useCase.execute({
                userId: user?._id,
                from,
                to,
                amount,
            });

            return c.json(ApiResponseBuilder.success(BuyCryptoOrderMapper.toResponse(order)), 200);
        } catch (error) {
            logger.error("Failed to create buy crypto order", false, error);
            return ErrorHandler.handle(c, error);
        }
    }
);