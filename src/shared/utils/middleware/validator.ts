import { Context, Next } from 'hono';
import { z } from 'zod';
import { ApiResponseBuilder} from "../../types/ApiResponse";
import { ErrorCodes} from "../../enums/ErrorCodes";
import { DANGEROUS_FIELDS} from "../../enums/dangerousFieldsRequest";

interface ValidatorOptions {
    sanitize?: boolean;
    strictContentType?: boolean;
}

export const validateBody = <T extends z.ZodTypeAny>(
    schema: T,
    options?: ValidatorOptions
) => {
    const {
        sanitize = true,
        strictContentType = true,
    } = options || {};

    return async (
        c: Context<{ Variables: { validatedData: z.infer<T> } }>,
        next: Next
    ) => {
        try {
            if (strictContentType) {
                const contentType = c.req.header('Content-Type');
                if (!contentType || !contentType.toLowerCase().includes('application/json')) {
                    return c.json(ApiResponseBuilder.error({
                        code: ErrorCodes.VALIDATION_ERROR,
                        message: 'Missing or invalid Content-Type. Se requiere: application/json',
                    }), 415);
                }
            }

            const rawBody = await c.req.text();

            if (!rawBody || rawBody.trim().length === 0) {
                return c.json(ApiResponseBuilder.error({
                    code: ErrorCodes.VALIDATION_ERROR,
                    message: 'The payload cannot be empty',
                }), 400);
            }

            let body: unknown;

            try {
                body = JSON.parse(rawBody);
            } catch {
                return c.json(ApiResponseBuilder.error({
                    code: ErrorCodes.VALIDATION_ERROR,
                    message: 'The request body is not valid JSON',
                }), 400);
            }

            if (typeof body === 'object' && body !== null) {
                const dangerousFieldsFound = detectDangerousFields(body);

                if (dangerousFieldsFound.length > 0) {
                    return c.json(ApiResponseBuilder.error({
                        code: ErrorCodes.SECURITY_VIOLATION,
                        message: `Campos no permitidos detectados: ${dangerousFieldsFound.join(', ')}`,
                    }), 400);
                }
            }

            if (sanitize && typeof body === 'object' && body !== null) {
                body = sanitizeObject(body);
            }

            const validated = schema.parse(body);
            c.set('validatedData', validated);
            await next();

        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.issues
                    .map((issue) => {
                        if (issue.code === 'unrecognized_keys') {
                            const keys = (issue as any).keys || [];
                            return `Campos no reconocidos: ${keys.join(', ')}`;
                        }
                        return `${issue.path.join('.')}: ${issue.message}`;
                    })
                    .join(' | ');

                return c.json(ApiResponseBuilder.error({
                    code: ErrorCodes.VALIDATION_ERROR,
                    message: messages,
                }), 400);
            }

            console.error('Error inesperado en validación:', error);
            return c.json(ApiResponseBuilder.error({
                code: ErrorCodes.INTERNAL_ERROR,
                message: 'No se pudo procesar la petición',
            }), 500);
        }
    };
};

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
    return async (
        c: Context<{ Variables: { validatedQuery: z.infer<T> } }>,
        next: Next
    ) => {
        try {
            const queryParams = c.req.query();
            const validated = schema.parse(queryParams);
            c.set('validatedQuery', validated);
            await next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(' | ');

                return c.json(ApiResponseBuilder.error({
                    code: ErrorCodes.VALIDATION_ERROR,
                    message: messages,
                }), 400);
            }
            throw error;
        }
    };
};

export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
    return async (
        c: Context<{ Variables: { validatedParams: z.infer<T> } }>,
        next: Next
    ) => {
        try {
            const params = c.req.param();
            const validated = schema.parse(params);
            c.set('validatedParams', validated);
            await next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(' | ');

                return c.json(ApiResponseBuilder.error({
                    code: ErrorCodes.VALIDATION_ERROR,
                    message: messages,
                }), 400);
            }
            throw error;
        }
    };
};

function detectDangerousFields(obj: any, prefix: string = ''): string[] {
    const dangerous: string[] = [];

    if (typeof obj !== 'object' || obj === null) return dangerous;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const fullPath = prefix ? `${prefix}.${key}` : key;

            if (DANGEROUS_FIELDS.includes(key.toLowerCase())) {
                dangerous.push(fullPath);
            }

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                dangerous.push(...detectDangerousFields(obj[key], fullPath));
            }
        }
    }

    return dangerous;
}

function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));

    if (typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string') {
                    sanitized[key] = value.trim();
                } else if (typeof value === 'object') {
                    sanitized[key] = sanitizeObject(value);
                } else {
                    sanitized[key] = value;
                }
            }
        }
        return sanitized;
    }

    if (typeof obj === 'string') return obj.trim();

    return obj;
}