import { Queue, Worker } from "bullmq";
import { ENV } from "../../../../config/env";

export const bullMQConnection = {
    host:                 ENV.REDIS_HOST,
    port:                 ENV.REDIS_PORT,
    password:             ENV.REDIS_PASSWORD,
    maxRetriesPerRequest: null,   // requerido por BullMQ
    enableReadyCheck:     false,  // requerido por BullMQ
} as const;

export function createQueue(name: string): Queue {
    return new Queue(name, { connection: bullMQConnection });
}

export function createWorker(
    name:      string,
    processor: (job: any) => Promise<void>,
): Worker {
    return new Worker(name, processor, {
        connection:  bullMQConnection,
        concurrency: 1,
    });
}