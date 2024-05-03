
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseGetByID = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/common/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}GetByIdSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});
export type ${capitalizeFirstLetter(name)}GetByIDInput = z.infer<typeof ${capitalizeFirstLetter(name)}GetByIdSchema>;
export type ${capitalizeFirstLetter(name)}GetByIDOutput = ${capitalizeFirstLetter(name)}Entity;

export class ${capitalizeFirstLetter(name)}GetByIdUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}GetByIdSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}GetByIDInput): Promise<${capitalizeFirstLetter(name)}GetByIDOutput> {
    const ${name} = await this.${name}Repository.findById(id);

    if (!${name}) {
      throw new ApiNotFoundException();
    }

    const entity = new ${capitalizeFirstLetter(name)}Entity(${name});

    return entity;
  }
}
`

module.exports = {
  getCoreUsecaseGetByID
}