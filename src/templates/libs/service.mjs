import { dashToPascal } from "../../textUtils.mjs"

const getServiceLib = (name) => `import { Injectable } from '@nestjs/common';
import { Infer, InputValidator } from '@/utils/validator';

import { ValidateSchema } from '@/utils/decorators';

import { I${dashToPascal(name)}Adapter } from './adapter';

const ${dashToPascal(name)}Schema = InputValidator.object({ name: InputValidator.string().trim() });

@Injectable()
export class ${dashToPascal(name)}Service implements I${dashToPascal(name)}Adapter {
  @ValidateSchema(${dashToPascal(name)}Schema)
  get(input: ${dashToPascal(name)}Input): ${dashToPascal(name)}Output {
    return input;
  }
}

export type ${dashToPascal(name)}Input = Infer<typeof ${dashToPascal(name)}Schema>;
export type ${dashToPascal(name)}Output = ${dashToPascal(name)}Input;
`

export {
  getServiceLib
}