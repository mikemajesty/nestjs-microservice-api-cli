import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleUsecaseCreate = (name) => `import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';

export const ${dashToPascal(name)}RenameSchema = z.object({ id: z.string() });

export class ${dashToPascal(name)}RenameUsecase implements IUsecase {
  @ValidateSchema(${dashToPascal(name)}RenameSchema)
  async execute(input: ${dashToPascal(name)}RenameUseCaseInput): Promise<${dashToPascal(name)}RenameUseCaseOutput> {
    return input;
  }
}

export type ${dashToPascal(name)}RenameUseCaseInput = z.infer<typeof ${dashToPascal(name)}RenameSchema>;
export type ${dashToPascal(name)}RenameUseCaseOutput = ${dashToPascal(name)}RenameUseCaseInput;
`

export {
  getCoreSingleUsecaseCreate
}