import { z } from 'zod';

export const FieldTypeEnum = z.enum([
  'string',
  'number',
  'boolean',
  'list',
  'object',
]);
export type FieldType = z.infer<typeof FieldTypeEnum>;

export const RuleSchema = z.object({
  description: z.string(),
  condition: z.string(),
  error: z.string(),
});
export type Rule = z.infer<typeof RuleSchema>;

export type Field = {
  type: FieldType;
  nameableKey?: boolean;
  label?: string;
  help?: string;
  defaultValues?: string[];
  itemType?: FieldType;
  rules?: Record<string, Rule>;
  required?: boolean;
  fields?: Record<string, Field>;
};

const FieldSchema: z.ZodType<Field> = z.lazy(() =>
  z.object({
    type: FieldTypeEnum,
    // label: z.string().optional(),
    help: z.string().optional(),
    defaultValues: z.array(z.string()).optional(),
    itemType: FieldTypeEnum.optional(),
    rules: z.record(RuleSchema).optional(),
    nameableKey: z.boolean().optional(),
    required: z.boolean().optional(),
    fields: z.record(FieldSchema).optional(),
  }),
);

export const GroupSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  rules: z.record(RuleSchema).optional(),
  fields: z.record(FieldSchema).optional(),
});
export type Group = z.infer<typeof GroupSchema>;

export const yamlSchema = z.object({
  name: z.string(),
  groups: z.record(GroupSchema),
  rules: z.record(RuleSchema).optional(),
});
export type YamlSchema = z.infer<typeof yamlSchema>;
