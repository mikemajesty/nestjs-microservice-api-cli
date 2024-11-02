
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreate = (name) => `import { z } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { UUIDUtils } from '@/utils/uuid';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}CreateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  name: true
});

export type ${capitalizeFirstLetter(name)}CreateInput = z.infer<typeof ${capitalizeFirstLetter(name)}CreateSchema>;
export type ${capitalizeFirstLetter(name)}CreateOutput = CreatedModel;

export class ${capitalizeFirstLetter(name)}CreateUsecase implements IUsecase {
  constructor(
    private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}CreateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    const entity = new ${capitalizeFirstLetter(name)}Entity({ id: UUIDUtils.create(), ...input });

    const ${name} = await this.${name}Repository.create(entity);

    this.loggerService.info({ message: '${name} created.', obj: { ${name} } });
    return ${name};
  }
}
`

module.exports = {
  getCoreUsecaseCreate
}