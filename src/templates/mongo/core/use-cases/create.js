
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreate = (name) => `import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput, ${capitalizeFirstLetter(name)}CreateSchema } from '@/modules/${name}/types';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export class ${capitalizeFirstLetter(name)}CreateUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}CreateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    const entity = new ${capitalizeFirstLetter(name)}Entity(input);

    const ${name} = await this.${name}Repository.create(entity);

    return ${name};
  }
}
`

module.exports = {
  getCoreUsecaseCreate
}