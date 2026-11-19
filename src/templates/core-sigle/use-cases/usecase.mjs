import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleUsecaseCreate = (name) => `import { ValidateSchema } from '@/utils/decorators';
import { InferSchema, Schema } from '@/utils/schema';
import { IUsecase } from '@/utils/usecase';

export const ${dashToPascal(name)}RenameSchema = Schema.object({ id: Schema.string() });

export class ${dashToPascal(name)}RenameUsecase implements IUsecase {
  @ValidateSchema(${dashToPascal(name)}RenameSchema)
  async execute(input: ${dashToPascal(name)}RenameUseCaseInput): Promise<${dashToPascal(name)}RenameUseCaseOutput> {
    return input;
  }
}

export type ${dashToPascal(name)}RenameUseCaseInput = InferSchema<typeof ${dashToPascal(name)}RenameSchema>;
export type ${dashToPascal(name)}RenameUseCaseOutput = ${dashToPascal(name)}RenameUseCaseInput;
`

export {
  getCoreSingleUsecaseCreate
}