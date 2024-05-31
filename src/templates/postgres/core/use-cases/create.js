
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreate = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { IUsecase } from '@/utils/usecase';

import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';
import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from './../entity/${name}';

export const ${capitalizeFirstLetter(name)}CreateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  name: true
});

export type ${capitalizeFirstLetter(name)}CreateInput = z.infer<typeof ${capitalizeFirstLetter(name)}CreateSchema>;
export type ${capitalizeFirstLetter(name)}CreateOutput = CreatedModel;

export class ${capitalizeFirstLetter(name)}CreateUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}CreateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    const entity = new ${capitalizeFirstLetter(name)}Entity(input);

    const transaction = await this.${name}Repository.startSession();
    try {
      const ${name} = await this.${name}Repository.create<DatabaseOptionsType>(entity, { transaction });

      await transaction.commit();

      this.loggerService.info({ message: '${name} created.', obj: { ${name} } });

      return ${name};
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
`

module.exports = {
  getCoreUsecaseCreate
}