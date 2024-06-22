
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseList = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';

import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type ${capitalizeFirstLetter(name)}ListInput = PaginationInput<${capitalizeFirstLetter(name)}Entity>;
export type ${capitalizeFirstLetter(name)}ListOutput = PaginationOutput<${capitalizeFirstLetter(name)}Entity>;

export class ${capitalizeFirstLetter(name)}ListUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}ListSchema)
  async execute(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    return await this.${name}Repository.paginate(input);
  }
}
`

module.exports = {
  getCoreUsecaseList
}