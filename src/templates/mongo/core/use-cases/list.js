const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseList = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/common/decorators';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type ${capitalizeFirstLetter(name)}ListInput = PaginationInput<${capitalizeFirstLetter(name)}Entity>;
export type ${capitalizeFirstLetter(name)}ListOutput = PaginationOutput<${capitalizeFirstLetter(name)}Entity>;

export class ${capitalizeFirstLetter(name)}ListUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}ListSchema)
  async execute(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const ${pluralize(name)} = await this.${name}Repository.paginate(input);

    return {
      docs: ${pluralize(name)}.docs.map((u) => new ${capitalizeFirstLetter(name)}Entity(u)),
      limit: ${pluralize(name)}.limit,
      page: ${pluralize(name)}.page,
      total: ${pluralize(name)}.total
    };
  }
}
`

module.exports = {
  getCoreUsecaseList
}