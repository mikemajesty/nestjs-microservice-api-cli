import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getCoreUsecaseCreate = (name) => `import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { IDGeneratorUtils } from '@/utils/id-generator';
import { IUsecase } from '@/utils/usecase';
import { Infer } from '@/utils/validator';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../repository/${name}';

export const ${dashToPascal(name)}CreateSchema = ${dashToPascal(name)}EntitySchema.pick({
  name: true
});

export class ${dashToPascal(name)}CreateUsecase implements IUsecase {
  constructor(private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) {}

  @ValidateSchema(${dashToPascal(name)}CreateSchema)
  async execute(input: ${dashToPascal(name)}CreateInput): Promise<${dashToPascal(name)}CreateOutput> {
    const entity = new ${dashToPascal(name)}Entity({ id: IDGeneratorUtils.uuid(), ...input });

    const created = await this.${snakeToCamel(name)}Repository.create(entity.toObject());

    return created;
  }
}

export type ${dashToPascal(name)}CreateInput = Infer<typeof ${dashToPascal(name)}CreateSchema>;
export type ${dashToPascal(name)}CreateOutput = CreatedModel;
`

export {
  getCoreUsecaseCreate
}