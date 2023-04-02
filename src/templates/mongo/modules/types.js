
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleType = (name) => `import { z } from 'zod';

import { ${capitalizeFirstLetter(name)}EntitySchema } from '@/core/${name}/entity/${name}';
import { CreatedModel } from '@/infra/repository';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';

type Schema = z.infer<typeof ${capitalizeFirstLetter(name)}EntitySchema>;

export const ${capitalizeFirstLetter(name)}CreateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  name: true
});

export type ${capitalizeFirstLetter(name)}CreateInput = z.infer<typeof ${capitalizeFirstLetter(name)}CreateSchema>;
export type ${capitalizeFirstLetter(name)}CreateOutput = Promise<CreatedModel>;

export const ${capitalizeFirstLetter(name)}UpdateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
}).merge(${capitalizeFirstLetter(name)}CreateSchema.partial());
export type ${capitalizeFirstLetter(name)}UpdateInput = z.infer<typeof ${capitalizeFirstLetter(name)}UpdateSchema>;
export type ${capitalizeFirstLetter(name)}UpdateOutput = Promise<Schema>;

export const ${capitalizeFirstLetter(name)}ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type ${capitalizeFirstLetter(name)}ListInput = PaginationInput<Schema>;
export type ${capitalizeFirstLetter(name)}ListOutput = Promise<{ docs: Schema[] } & PaginationOutput>;

export const ${capitalizeFirstLetter(name)}DeleteSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});
export type ${capitalizeFirstLetter(name)}DeleteInput = z.infer<typeof ${capitalizeFirstLetter(name)}DeleteSchema>;
export type ${capitalizeFirstLetter(name)}DeleteOutput = Promise<Schema>;

export const ${capitalizeFirstLetter(name)}GetByIdSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});
export type ${capitalizeFirstLetter(name)}GetByIDInput = z.infer<typeof ${capitalizeFirstLetter(name)}GetByIdSchema>;
export type ${capitalizeFirstLetter(name)}GetByIDOutput = Promise<Schema>;
`

module.exports = {
  getModuleType
}