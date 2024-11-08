const { dashToPascal, snakeToCamel } = require("../../../../textUtils")

const getCoreUsecaseGetById = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}GetByIdSchema = ${dashToPascal(name)}EntitySchema.pick({
  id: true
});
export type ${dashToPascal(name)}GetByIdInput = z.infer<typeof ${dashToPascal(name)}GetByIdSchema>;
export type ${dashToPascal(name)}GetByIdOutput = ${dashToPascal(name)}Entity;

export class ${dashToPascal(name)}GetByIdUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}GetByIdSchema)
  async execute({ id }: ${dashToPascal(name)}GetByIdInput): Promise<${dashToPascal(name)}GetByIdOutput> {
    const ${snakeToCamel(name)} = await this.${snakeToCamel(name)}Repository.findById(id);

    if (!${snakeToCamel(name)}) {
      throw new ApiNotFoundException('${snakeToCamel(name)}NotFound');
    }

    const entity = new ${dashToPascal(name)}Entity(${snakeToCamel(name)});

    return entity;
  }
}
`

module.exports = {
  getCoreUsecaseGetById
}