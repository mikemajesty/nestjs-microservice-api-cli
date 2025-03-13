import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getCoreUsecaseUpdate = (name) => `import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';;

import { ILoggerAdapter } from '@/infra/logger';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { Infer } from '@/utils/validator';
import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from './../entity/${name}';

export const ${dashToPascal(name)}UpdateSchema = ${dashToPascal(name)}EntitySchema.pick({
  id: true
}).merge(${dashToPascal(name)}EntitySchema.omit({ id: true }).partial());

export class ${dashToPascal(name)}UpdateUsecase implements IUsecase {
  constructor(
    private readonly ${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(${dashToPascal(name)}UpdateSchema)
  async execute(input: ${dashToPascal(name)}UpdateInput): Promise<${dashToPascal(name)}UpdateOutput> {
    const ${snakeToCamel(name)} = await this.${snakeToCamel(name)}Repository.findById(input.id);

    if (!${snakeToCamel(name)}) {
      throw new ApiNotFoundException('${snakeToCamel(name)}NotFound');
    }

    const ${snakeToCamel(name)}Found = new ${dashToPascal(name)}Entity(${snakeToCamel(name)});

    const entity = new ${dashToPascal(name)}Entity({ ...${snakeToCamel(name)}Found, ...input });

    await this.${snakeToCamel(name)}Repository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: '${snakeToCamel(name)} updated.', obj: { ${snakeToCamel(name)}: input } });

    const updated = await this.${snakeToCamel(name)}Repository.findById(entity.id);

    return new ${dashToPascal(name)}Entity(updated as ${dashToPascal(name)}Entity);
  }
}

export type ${dashToPascal(name)}UpdateInput = Infer<typeof ${dashToPascal(name)}UpdateSchema>;
export type ${dashToPascal(name)}UpdateOutput = ${dashToPascal(name)}Entity;
`

export {
  getCoreUsecaseUpdate
}