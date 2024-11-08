const { dashToPascal } = require("../../../../textUtils")

const getCoreUsecaseCreate = (name) => `import { z } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { UUIDUtils } from '@/utils/uuid';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}CreateSchema = ${dashToPascal(name)}EntitySchema.pick({
  name: true
});

export type ${dashToPascal(name)}CreateInput = z.infer<typeof ${dashToPascal(name)}CreateSchema>;
export type ${dashToPascal(name)}CreateOutput = CreatedModel;

export class ${dashToPascal(name)}CreateUsecase implements IUsecase {
  constructor(
    private readonly ${name}Repository: I${dashToPascal(name)}Repository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(${dashToPascal(name)}CreateSchema)
  async execute(input: ${dashToPascal(name)}CreateInput): Promise<${dashToPascal(name)}CreateOutput> {
    const entity = new ${dashToPascal(name)}Entity({ id: UUIDUtils.create(), ...input });

    const ${name} = await this.${name}Repository.create(entity);

    this.loggerService.info({ message: '${name} created.', obj: { ${name} } });
    return ${name};
  }
}
`

module.exports = {
  getCoreUsecaseCreate
}