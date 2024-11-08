const pluralize = require('pluralize')
const { dashToPascal, snakeToCamel } = require('../../../../textUtils')

const getCoreUsecaseList = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';

import { ${dashToPascal(name)}Entity } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type ${dashToPascal(name)}ListInput = PaginationInput<${dashToPascal(name)}Entity>;
export type ${dashToPascal(name)}ListOutput = PaginationOutput<${dashToPascal(name)}Entity>;

export class ${dashToPascal(name)}ListUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}ListSchema)
  async execute(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    const ${pluralize(snakeToCamel(name))} = await this.${snakeToCamel(name)}Repository.paginate(input);

    return {
      docs: ${pluralize(snakeToCamel(name))}.docs.map((u) => new ${dashToPascal(name)}Entity(u)),
      limit: ${pluralize(snakeToCamel(name))}.limit,
      page: ${pluralize(snakeToCamel(name))}.page,
      total: ${pluralize(snakeToCamel(name))}.total
    };
  }
}
`

module.exports = {
  getCoreUsecaseList
}