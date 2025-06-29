import { z } from 'zod';

export const pageSchema = z.coerce.number().min(1).default(1);

export type Page = z.infer<typeof pageSchema>;
