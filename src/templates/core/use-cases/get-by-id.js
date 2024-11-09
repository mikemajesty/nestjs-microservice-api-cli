const { dashToPascal, snakeToCamel } = require("../../../textUtils")

const getCoreUsecaseGetById = (name) => `import { z } from 'zod';

import { ${dashToPascal(name)}EntitySchema } from '@/core/${name}/entity/${name}';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${dashToPascal(name)}Entity } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}GetByIdSchema = ${dashToPascal(name)}EntitySchema.pick({
  id: true
});

export class ${dashToPascal(name)}GetByIdUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}GetByIdSchema)
  async execute({ id }: ${dashToPascal(name)}GetByIdInput): Promise<${dashToPascal(name)}GetByIdOutput> {
    const ${snakeToCamel(name)} = await this.${snakeToCamel(name)}Repository.findById(id);

    if (!${snakeToCamel(name)}) {
      throw new ApiNotFoundException('${snakeToCamel(name)}NotFound');
    }

    return new ${dashToPascal(name)}Entity(${snakeToCamel(name)});
  }
}

export type ${dashToPascal(name)}GetByIdInput = z.infer<typeof ${dashToPascal(name)}GetByIdSchema>;
export type ${dashToPascal(name)}GetByIdOutput = ${dashToPascal(name)}Entity;
`

module.exports = {
  getCoreUsecaseGetById
}