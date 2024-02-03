
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreate = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/common/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}CreateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  name: true
});

export type ${capitalizeFirstLetter(name)}CreateInput = z.infer<typeof ${capitalizeFirstLetter(name)}CreateSchema>;
export type ${capitalizeFirstLetter(name)}CreateOutput = CreatedModel;

export class ${capitalizeFirstLetter(name)}CreateUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository, private readonly loggerServide: ILoggerAdapter) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}CreateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    const entity = new ${capitalizeFirstLetter(name)}Entity(input);

    const session = await this.${name}Repository.startSession();

    try {
      const ${name} = await this.${name}Repository.create(entity, { session });

      await session.commitTransaction();

      this.loggerServide.info({ message: '${name} created.', obj: { ${name} } });
      return ${name};
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
`

module.exports = {
  getCoreUsecaseCreate
}