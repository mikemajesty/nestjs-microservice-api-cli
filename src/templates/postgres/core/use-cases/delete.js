
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDelete = (name) => `import { z } from 'zod';

import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';

export const ${capitalizeFirstLetter(name)}DeleteSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});

export type ${capitalizeFirstLetter(name)}DeleteInput = z.infer<typeof ${capitalizeFirstLetter(name)}DeleteSchema>;
export type ${capitalizeFirstLetter(name)}DeleteOutput = Promise<${capitalizeFirstLetter(name)}Entity>;

export class ${capitalizeFirstLetter(name)}DeleteUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}DeleteSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}DeleteInput): Promise<${capitalizeFirstLetter(name)}DeleteOutput> {
    const model = await this.${name}Repository.findById<DatabaseOptionsType>(id);

    if (!model) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    const ${name} = new ${capitalizeFirstLetter(name)}Entity(model);

    ${name}.setDelete();

    await this.${name}Repository.updateOne({ id: ${name}.id }, ${name});

    return ${name};
  }
}
`

module.exports = {
  getCoreUsecaseDelete
}