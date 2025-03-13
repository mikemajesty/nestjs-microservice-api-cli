import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getCoreUsecaseDelete = (name) => `import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';

import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { Infer } from '@/utils/validator';
import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../entity/${name}';

export const ${dashToPascal(name)}DeleteSchema = ${dashToPascal(name)}EntitySchema.pick({
  id: true
});

export class ${dashToPascal(name)}DeleteUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}DeleteSchema)
  async execute({ id }: ${dashToPascal(name)}DeleteInput): Promise<${dashToPascal(name)}DeleteOutput> {
    const model = await this.${snakeToCamel(name)}Repository.findById(id);

    if (!model) {
      throw new ApiNotFoundException('${snakeToCamel(name)}NotFound');
    }

    const ${snakeToCamel(name)} = new ${dashToPascal(name)}Entity(model);

    ${snakeToCamel(name)}.deactivated();

    await this.${snakeToCamel(name)}Repository.updateOne({ id: ${snakeToCamel(name)}.id }, ${snakeToCamel(name)});

    return ${snakeToCamel(name)};
  }
}

export type ${dashToPascal(name)}DeleteInput = Infer<typeof ${dashToPascal(name)}DeleteSchema>;
export type ${dashToPascal(name)}DeleteOutput = ${dashToPascal(name)}Entity;
`

export {
  getCoreUsecaseDelete
}