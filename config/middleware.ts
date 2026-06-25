import type { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const ALLOWED_ORIGINS_PROD = [
    'https://api.bitdoot.dev',
    'https://app.bitdoot.dev',
] as const;

export function registerMiddlewares(app: Hono): void {
    app.use('*', logger());
    app.use('*', cors({
        origin: process.env.NODE_ENV === 'production'
            ? [...ALLOWED_ORIGINS_PROD]
            : '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    }));
}