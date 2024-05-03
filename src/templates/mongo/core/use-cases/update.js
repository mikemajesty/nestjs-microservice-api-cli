
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdate = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/common/decorators';
import { ILoggerAdapter } from '@/infra/logger';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}UpdateSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
}).merge(${capitalizeFirstLetter(name)}EntitySchema.omit({ id: true }).partial());

export type ${capitalizeFirstLetter(name)}UpdateInput = Partial<z.infer<typeof ${capitalizeFirstLetter(name)}UpdateSchema>>;
export type ${capitalizeFirstLetter(name)}UpdateOutput = ${capitalizeFirstLetter(name)}Entity;

export class ${capitalizeFirstLetter(name)}UpdateUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}UpdateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}UpdateInput): Promise<${capitalizeFirstLetter(name)}UpdateOutput> {
    const ${name} = await this.${name}Repository.findById(input.id);

    if (!${name}) {
      throw new ApiNotFoundException();
    }

    const ${name}Finded = new ${capitalizeFirstLetter(name)}Entity(${name});

    const entity = new ${capitalizeFirstLetter(name)}Entity({ ...${name}Finded, ...input });

    await this.${name}Repository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: '${name} updated.', obj: { ${name}: input } });

    const updated = await this.${name}Repository.findById(entity.id);

    return new ${capitalizeFirstLetter(name)}Entity(updated);
  }
}
`

module.exports = {
  getCoreUsecaseUpdate
}