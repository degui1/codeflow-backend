import { z } from 'zod';

export const inputSchema = z.object({
  groupKey: z.string(),
  index: z.number().optional(), // use it if group has repeatable=true
  fieldKey: z.string(),
  value: z.unknown(),
});
export type InputSchema = z.infer<typeof inputSchema>;

export const inputListSchema = z.array(inputSchema);
export type InputListSchema = z.infer<typeof inputListSchema>;
