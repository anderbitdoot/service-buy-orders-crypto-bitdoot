import { z } from "zod";

export const createBuyCryptoOrderSchema = z.object({
    from: z.string().trim().toLowerCase().min(1, "from is required"),
    to: z.string().trim().toLowerCase().min(1, "to is required"),
    amount: z.coerce.number().positive("amount must be greater than zero"),
});

export type CreateBuyCryptoOrderSchemaType = z.infer<typeof createBuyCryptoOrderSchema>;