const { dashToPascal } = require("../../../../textUtils")

const getCoreUsecaseUpdate = (name) => `import { z } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}UpdateSchema = ${dashToPascal(name)}EntitySchema.pick({
  id: true
}).merge(${dashToPascal(name)}EntitySchema.omit({ id: true }).partial());

export type ${dashToPascal(name)}UpdateInput = Partial<z.infer<typeof ${dashToPascal(name)}UpdateSchema>>;
export type ${dashToPascal(name)}UpdateOutput = ${dashToPascal(name)}Entity;

export class ${dashToPascal(name)}UpdateUsecase implements IUsecase {
  constructor(
    private readonly ${name}Repository: I${dashToPascal(name)}Repository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(${dashToPascal(name)}UpdateSchema)
  async execute(input: ${dashToPascal(name)}UpdateInput): Promise<${dashToPascal(name)}UpdateOutput> {
    const ${name} = await this.${name}Repository.findById(input.id as string);

    if (!${name}) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    const ${name}Found = new ${dashToPascal(name)}Entity(${name});

    const entity = new ${dashToPascal(name)}Entity({ ...${name}Found, ...input });

    await this.${name}Repository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: '${name} updated.', obj: { ${name}: input } });

    const updated = await this.${name}Repository.findById(entity.id);

    return new ${dashToPascal(name)}Entity(updated as ${dashToPascal(name)}Entity);
  }
}
`

module.exports = {
  getCoreUsecaseUpdate
}