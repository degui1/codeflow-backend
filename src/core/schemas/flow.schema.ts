import { z } from 'zod';

export const FieldTypeEnum = z.enum([
  'string',
  'number',
  'boolean',
  'list',
  'object',
]);
export type FieldType = z.infer<typeof FieldTypeEnum>;

export type Field = {
  type: FieldType;
  label?: string;
  help?: string;
  required?: boolean;
  itemType?: FieldType;
  fields?: Record<string, Field>;
};

const FieldSchema: z.ZodType<Field> = z.lazy(() =>
  z.object({
    type: FieldTypeEnum,
    label: z.string().optional(),
    help: z.string().optional(),
    required: z.boolean().optional(),
    itemType: FieldTypeEnum.optional(),
    fields: z.record(FieldSchema).optional(),
  }),
);

export const GroupSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  fields: z.record(FieldSchema),
  repeatable: z.boolean().optional(),
});
export type Group = z.infer<typeof GroupSchema>;

export const RuleSchema = z.object({
  description: z.string(),
  condition: z.string(),
  error: z.string(),
});
export type Rule = z.infer<typeof RuleSchema>;

export const yamlSchema = z.object({
  name: z.string(),
  groups: z.record(GroupSchema),
  rules: z.array(RuleSchema).optional(),
});
export type YamlSchema = z.infer<typeof yamlSchema>;
