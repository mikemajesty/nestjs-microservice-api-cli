
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDelete = (name) => `import { z } from 'zod';

import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}EntitySchema } from '../entity/${name}';

export const ${capitalizeFirstLetter(name)}DeleteSchema = ${capitalizeFirstLetter(name)}EntitySchema.pick({
  id: true
});

export type ${capitalizeFirstLetter(name)}DeleteInput = z.infer<typeof ${capitalizeFirstLetter(name)}DeleteSchema>;
export type ${capitalizeFirstLetter(name)}DeleteOutput = ${capitalizeFirstLetter(name)}Entity;

export class ${capitalizeFirstLetter(name)}DeleteUsecase implements IUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}DeleteSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}DeleteInput): Promise<${capitalizeFirstLetter(name)}DeleteOutput> {
    const model = await this.${name}Repository.findById(id);

    if (!model) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    const ${name} = new ${capitalizeFirstLetter(name)}Entity(model);

    ${name}.setDeleted();

    await this.${name}Repository.updateOne({ id: ${name}.id }, ${name});

    return ${name};
  }
}
`

module.exports = {
  getCoreUsecaseDelete
}