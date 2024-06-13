
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseGetById = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ${capitalizeFirstLetter(name)}EntitySchema } from '@/core/${name}/entity/${name}';
;
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}GetByIdSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});

export type ${capitalizeFirstLetter(name)}GetByIdInput = z.infer<typeof ${capitalizeFirstLetter(name)}GetByIdSchema>;
export type ${capitalizeFirstLetter(name)}GetByIdOutput = ${capitalizeFirstLetter(name)}Entity;

export class ${capitalizeFirstLetter(name)}GetByIdUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}GetByIdSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}GetByIdInput): Promise<${capitalizeFirstLetter(name)}GetByIdOutput> {
    const ${name} = await this.${name}Repository.findById(id);

    if (!${name}) {
      throw new ApiNotFoundException();
    }

    return new ${capitalizeFirstLetter(name)}Entity(${name});
  }
}
`

module.exports = {
  getCoreUsecaseGetById
}