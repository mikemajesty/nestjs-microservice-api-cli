
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseGetByID = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/common/decorators';
import { ${capitalizeFirstLetter(name)}EntitySchema } from '@/core/${name}/entity/${name}';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ApiNotFoundException } from '@/utils/exception';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export const ${capitalizeFirstLetter(name)}GetByIdSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});

export type ${capitalizeFirstLetter(name)}GetByIDInput = z.infer<typeof ${capitalizeFirstLetter(name)}GetByIdSchema>;
export type ${capitalizeFirstLetter(name)}GetByIDOutput = ${capitalizeFirstLetter(name)}Entity;

export class ${capitalizeFirstLetter(name)}GetByIdUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}GetByIdSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}GetByIDInput): Promise<${capitalizeFirstLetter(name)}GetByIDOutput> {
    const ${name} = await this.${name}Repository.findById<DatabaseOptionsType>(id);

    if (!${name}) {
      throw new ApiNotFoundException();
    }

    return new ${capitalizeFirstLetter(name)}Entity(${name});
  }
}
`

module.exports = {
  getCoreUsecaseGetByID
}