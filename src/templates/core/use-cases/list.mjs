import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getCoreUsecaseList = (name) => `import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';;

import { ValidateSchema } from '@/utils/decorators';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';

import { InputValidator } from '@/utils/validator';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}ListSchema = InputValidator.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export class ${dashToPascal(name)}ListUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}ListSchema)
  async execute(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    return await this.${snakeToCamel(name)}Repository.paginate(input);
  }
}

export type ${dashToPascal(name)}ListInput = PaginationInput<${dashToPascal(name)}Entity>;
export type ${dashToPascal(name)}ListOutput = PaginationOutput<${dashToPascal(name)}Entity>;
`

export {
  getCoreUsecaseList
}