import { z } from 'zod';

type Value = string | number | boolean | Value[] | { [key: string]: Value };

const valueSchema: z.ZodType<Value> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(valueSchema),
    z.record(valueSchema),
  ]),
);

const groupSchema = z.object({
  fields: z.union([z.record(valueSchema), z.array(z.record(valueSchema))]),
});

export const flowInputSchema = z.object({
  groups: z.record(groupSchema),
});

export type FlowInput = z.infer<typeof flowInputSchema>;
