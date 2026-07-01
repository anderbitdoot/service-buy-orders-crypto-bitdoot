import { Context, Next } from 'hono';

export const sanitizeHeaders = () => {
    return async (c: Context, next: Next) => {
        const suspiciousHeaders = ['x-forwarded-host', 'x-original-url'];

        for (const header of suspiciousHeaders) {
            const value = c.req.header(header);
            if (value && !isValidHeaderValue(value)) {
                return c.json({
                    error: 'Invalid headers detected'
                }, 400);
            }
        }

        await next();

        c.header('X-Content-Type-Options', 'nosniff');
        c.header('X-Frame-Options', 'DENY');
        c.header('X-XSS-Protection', '1; mode=block');
    };
};

function isValidHeaderValue(value: string): boolean {
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /<iframe/i,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(value));
}

export const constantTimeResponse = () => {
    return async (c: Context, next: Next) => {
        const start = Date.now();
        await next();
        const elapsed = Date.now() - start;
        const minDelay = 100;
        if (elapsed < minDelay) {
            await new Promise(resolve =>
                setTimeout(resolve, minDelay - elapsed + Math.random() * 50)
            );
        }
    };
};