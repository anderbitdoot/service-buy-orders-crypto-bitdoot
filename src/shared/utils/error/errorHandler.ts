import { Context } from 'hono';
import {
    DomainError,
    RateLimitError,
    OtpExpiredError,
    OtpNotFoundError,
    InvalidOtpError,
    MaxAttemptsError,
    InvalidPhoneError,
    InvalidAuthenticationError,
    InvalidParametersError,
    InvalidConfirmPasswordError,
    NotCompletedOnboardingError,
    NotFoundReferralCodeError,
    UserRegistrationError
} from "../exceptionTypes/DomainErrors";
import { ApiResponseBuilder} from "../../types/ApiResponse";
import { ErrorCodes} from "../../enums/ErrorCodes";
import { ErrorCodeCatalog} from "../../enums/ErrorCodeCatalog";
import { ErrorDescriptionCatalog} from "../../enums/ErrorDescriptionCatalog";

export class ErrorHandler {
    static handle(c: Context, error: unknown) {
        console.error('Error caught:', error);


        if (error instanceof RateLimitError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
                        message: 'Límite de solicitudes excedido',
                    }
                ),
                429
            );
        }

        if (error instanceof OtpExpiredError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.OTP_EXPIRED,
                        message: 'El código de verificación ha expirado',

                    }
                ),
                400
            );
        }

        if (error instanceof InvalidParametersError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD001,
                        message: ErrorDescriptionCatalog.BD001
                    }
                ),
                400
            );
        }

        if (error instanceof OtpNotFoundError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.OTP_NOT_FOUND,
                        message: 'No se encontró código de verificación'
                    }
                ),
                404
            );
        }

        if (error instanceof InvalidOtpError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD007,
                        message: ErrorDescriptionCatalog.BD007
                    }
                ),
                400
            );
        }

        if (error instanceof MaxAttemptsError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD009,
                        message: ErrorDescriptionCatalog.BD009
                    }
                ),
                429
            );
        }

        if (error instanceof InvalidPhoneError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.INVALID_PHONE,
                        message: 'Número de teléfono inválido'

                    },
                ),
                400
            );
        }

        if (error instanceof DomainError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.VALIDATION_ERROR,
                        message: 'Error en la validación de datos',
                    },
                ),
                400
            );
        }

        if (error instanceof InvalidConfirmPasswordError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodes.VALIDATION_ERROR,
                        message: 'Las claves que ingresaste no coinciden',
                    },
                ),
                400
            );
        }


        if (error instanceof InvalidAuthenticationError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD004,
                        message: ErrorDescriptionCatalog.BD004,

                    },
                ),
                401
            );
        }

        if (error instanceof UserRegistrationError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD006,
                        message: ErrorDescriptionCatalog.BD006
                    }
                ),
                409
            );
        }

        if (error instanceof NotCompletedOnboardingError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD010,
                        message: ErrorDescriptionCatalog.BD010,

                    },
                ),
                409
            );
        }

        if (error instanceof NotFoundReferralCodeError) {
            return c.json(
                ApiResponseBuilder.error(
                    {
                        code: ErrorCodeCatalog.BD011,
                        message: ErrorDescriptionCatalog.BD011,
                    },
                ),
                404
            );
        }

        return c.json(
            ApiResponseBuilder.error(
                {
                    code: ErrorCodeCatalog.BD003,
                    message: ErrorDescriptionCatalog.BD003
                }
            ),
            500
        );
    }
} 