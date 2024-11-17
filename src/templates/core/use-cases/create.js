const { dashToPascal, snakeToCamel } = require("../../../textUtils")

const getCoreUsecaseCreate = (name) => `import { z } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { UuidUtils } from '@/utils/uuid';

import { I${dashToPascal(name)}Repository } from '../repository/${name}';
import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from './../entity/${name}';

export const ${dashToPascal(name)}CreateSchema = ${dashToPascal(name)}EntitySchema.pick({
  name: true
});

export class ${dashToPascal(name)}CreateUsecase implements IUsecase {
  constructor(
    private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(${dashToPascal(name)}CreateSchema)
  async execute(input: ${dashToPascal(name)}CreateInput): Promise<${dashToPascal(name)}CreateOutput> {
    const entity = new ${dashToPascal(name)}Entity({ id: UuidUtils.generate(), ...input });

    const ${snakeToCamel(name)} = await this.${snakeToCamel(name)}Repository.create(entity);

    this.loggerService.info({ message: '${snakeToCamel(name)} created.', obj: { ${snakeToCamel(name)} } });

    return ${snakeToCamel(name)};
  }
}

export type ${dashToPascal(name)}CreateInput = z.infer<typeof ${dashToPascal(name)}CreateSchema>;
export type ${dashToPascal(name)}CreateOutput = CreatedModel;
`

module.exports = {
  getCoreUsecaseCreate
}