const { dashToPascal } = require("../../textUtils")

const getServiceInfra = (name) => `import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { I${dashToPascal(name)}Adapter } from './adapter';

const ${dashToPascal(name)}Schema = z.object({ name: z.string().trim() });

@Injectable()
export class ${dashToPascal(name)}Service implements I${dashToPascal(name)}Adapter {
  @ValidateSchema(${dashToPascal(name)}Schema)
  get(input: ${dashToPascal(name)}GetInput): ${dashToPascal(name)}GetOutput {
    return input;
  }
}

export type ${dashToPascal(name)}GetInput = z.infer<typeof ${dashToPascal(name)}Schema>;
export type ${dashToPascal(name)}GetOutput = ${dashToPascal(name)}GetInput;
`

module.exports = {
  getServiceInfra
}