import { z } from 'zod';

export type Value =
  | string
  | number
  | boolean
  | Value[]
  | { [key: string]: Value };

export const valueSchema: z.ZodType<Value> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(valueSchema),
    z.record(valueSchema),
  ]),
);

export const inputSchema = z.union([
  z.record(valueSchema),
  z.array(z.record(valueSchema)),
]);

export type Input = z.infer<typeof inputSchema>;

const groupSchema = z.object({
  fields: z.record(inputSchema),
});

export const flowInputSchema = z.object({
  groups: z.record(groupSchema),
});

export type FlowInput = z.infer<typeof flowInputSchema>;
