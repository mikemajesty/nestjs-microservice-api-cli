
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDelete = (name) => `import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput, ${capitalizeFirstLetter(name)}DeleteSchema } from '@/modules/${name}/types';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';

export class ${capitalizeFirstLetter(name)}DeleteUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}DeleteSchema)
  async execute({ id }: ${capitalizeFirstLetter(name)}DeleteInput): Promise<${capitalizeFirstLetter(name)}DeleteOutput> {
    const model = await this.${name}Repository.findById(id);

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