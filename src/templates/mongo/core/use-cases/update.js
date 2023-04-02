
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdate = (name) => `import { ILoggerAdapter } from '@/infra/logger';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput, ${capitalizeFirstLetter(name)}UpdateSchema } from '@/modules/${name}/types';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../repository/${name}';

export class ${capitalizeFirstLetter(name)}UpdateUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository, private readonly loggerServide: ILoggerAdapter) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}UpdateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}UpdateInput): Promise<${capitalizeFirstLetter(name)}UpdateOutput> {
    const ${name} = await this.${name}Repository.findById(input.id);

    if (!${name}) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    const ${name}Finded = new ${capitalizeFirstLetter(name)}Entity(${name});

    const entity = new ${capitalizeFirstLetter(name)}Entity({ ...${name}Finded, ...input });

    await this.${name}Repository.updateOne({ id: entity.id }, entity);

    this.loggerServide.info({ message: '${name} updated.', obj: { ${name}: input } });

    const updated = await this.${name}Repository.findById(entity.id);

    return new ${capitalizeFirstLetter(name)}Entity(updated);
  }
}
`

module.exports = {
  getCoreUsecaseUpdate
}