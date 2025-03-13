import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleUsecaseCreate = (name) => `import { ValidateSchema } from '@/utils/decorators';;

import { Infer, InputValidator } from '@/utils/validator';
import { IUsecase } from '@/utils/usecase';

export const ${dashToPascal(name)}RenameSchema = InputValidator.object({ id: InputValidator.string() });

export class ${dashToPascal(name)}RenameUsecase implements IUsecase {
  @ValidateSchema(${dashToPascal(name)}RenameSchema)
  async execute(input: ${dashToPascal(name)}RenameUseCaseInput): Promise<${dashToPascal(name)}RenameUseCaseOutput> {
    return input;
  }
}

export type ${dashToPascal(name)}RenameUseCaseInput = Infer<typeof ${dashToPascal(name)}RenameSchema>;
export type ${dashToPascal(name)}RenameUseCaseOutput = ${dashToPascal(name)}RenameUseCaseInput;
`

export {
  getCoreSingleUsecaseCreate
}