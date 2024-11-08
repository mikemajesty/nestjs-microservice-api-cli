const { dashToPascal } = require("../../../../textUtils")

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

export type ${dashToPascal(name)}GetByIdInput = z.infer<typeof ${dashToPascal(name)}GetByIdSchema>;
export type ${dashToPascal(name)}GetByIdOutput = ${dashToPascal(name)}Entity;

export class ${dashToPascal(name)}GetByIdUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}GetByIdSchema)
  async execute({ id }: ${dashToPascal(name)}GetByIdInput): Promise<${dashToPascal(name)}GetByIdOutput> {
    const ${name} = await this.${name}Repository.findById(id);

    if (!${name}) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    return new ${dashToPascal(name)}Entity(${name});
  }
}
`

module.exports = {
  getCoreUsecaseGetById
}