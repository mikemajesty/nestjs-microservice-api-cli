import { dashToPascal } from "../../textUtils.mjs"

const getServiceInfra = (name) => `import { Injectable } from '@nestjs/common';
import { Infer, InputValidator } from '@/utils/validator';

import { ValidateSchema } from '@/utils/decorators';

import { I${dashToPascal(name)}Adapter } from './adapter';

const ${dashToPascal(name)}Schema = InputValidator.object({ name: InputValidator.string().trim() });

@Injectable()
export class ${dashToPascal(name)}Service implements I${dashToPascal(name)}Adapter {
  @ValidateSchema(${dashToPascal(name)}Schema)
  get(input: ${dashToPascal(name)}GetInput): ${dashToPascal(name)}GetOutput {
    return input;
  }
}

export type ${dashToPascal(name)}GetInput = Infer<typeof ${dashToPascal(name)}Schema>;
export type ${dashToPascal(name)}GetOutput = ${dashToPascal(name)}GetInput;
`

export {
  getServiceInfra
}