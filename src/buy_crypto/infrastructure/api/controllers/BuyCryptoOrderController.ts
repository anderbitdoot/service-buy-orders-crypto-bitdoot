import { Hono, type Context } from "hono";
import { container }          from "tsyringe";
import { validateBody }       from "../../../../shared/utils/middleware/validator";
import { authMiddleware }     from "../../../../shared/utils/middleware/auth";
import { ApiResponseBuilder } from "../../../../shared/types/ApiResponse";
import { ErrorHandler }       from "../../../../shared/utils/error/errorHandler";
import { createBuyCryptoOrderSchema, type CreateBuyCryptoOrderSchemaType } from "../../../domain/schemas/BuyCryptoOrderSchema";
import { BuyCryptoOrderTokens } from "../../di/BuyCryptoOrderTokens";
import type { CreateBuyCryptoOrderUseCase }         from "../../../domain/ports/in/CreateBuyCryptoOrderUseCase";
import type { SimulatePaymentApprovalUseCaseImpl }  from "../../../application/use-case/SimulatePaymentApprovalUseCaseImpl";
import type { BuyCryptoOrderRepositoryPort }        from "../../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import { BuyCryptoOrderMapper } from "../../mappers/BuyCryptoOrderMapper";
import { createLogger }         from "../../../../shared/utils/logs/Logger";
import type { UserSessionDTO }  from "../dto/UserSessionDTO";

const logger = createLogger("BuyCryptoOrderController");

type BuyCryptoOrderContext = Context<{
    Variables: {
        validatedData: CreateBuyCryptoOrderSchemaType;
        user: UserSessionDTO;
    };
}>;

export const buyCryptoOrderRouter = new Hono();

// POST /buy_crypto/quote — crear orden
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
            logger.error("Failed to create buy crypto order", error);
            return ErrorHandler.handle(c, error);
        }
    }
);

// GET /buy_crypto/:orderId — consultar orden
buyCryptoOrderRouter.get(
    "/:orderId",
    authMiddleware,
    async (c) => {
        try {
            const { orderId } = c.req.param();

            const repository = container.resolve<BuyCryptoOrderRepositoryPort>(
                BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort
            );

            const order = await repository.findByOrderId(orderId);

            if (!order) {
                if (!order) {
                    return c.json(ApiResponseBuilder.error({ code: "404", message: `Order '${orderId}' not found` }), 404);
                }
            }

            return c.json(ApiResponseBuilder.success(BuyCryptoOrderMapper.toResponse(order)), 200);
        } catch (error) {
            logger.error("Failed to fetch order", error);
            return ErrorHandler.handle(c, error);
        }
    }
);

// POST /buy_crypto/:orderId/simulate-payment — simular aprobación de pago
buyCryptoOrderRouter.post(
    "/:orderId/simulate-payment",
    authMiddleware,
    async (c) => {
        try {
            const { orderId } = c.req.param();

            const useCase = container.resolve<SimulatePaymentApprovalUseCaseImpl>(
                BuyCryptoOrderTokens.SimulatePaymentApprovalUseCase
            );

            const order = await useCase.execute(orderId);

            return c.json(ApiResponseBuilder.success(BuyCryptoOrderMapper.toResponse(order)), 200);
        } catch (error) {
            logger.error("Failed to simulate payment approval", error);
            return ErrorHandler.handle(c, error);
        }
    }
);