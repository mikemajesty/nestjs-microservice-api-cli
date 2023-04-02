
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseList = (name) => `import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput, ${capitalizeFirstLetter(name)}ListSchema } from '@/modules/${name}/types';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export class ${capitalizeFirstLetter(name)}ListUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}ListSchema)
  async execute(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const ${name}s = await this.${name}Repository.paginate(input);

    return { docs: ${name}s.docs.map((u) => new ${capitalizeFirstLetter(name)}Entity(u)), limit: ${name}s.limit, page: ${name}s.page, total: ${name}s.total };
  }
}
`

module.exports = {
  getCoreUsecaseList
}