const { dashToPascal } = require("../../textUtils")

const getServiceLib = (name) => `import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { I${dashToPascal(name)}Adapter } from './adapter';

const ${dashToPascal(name)}Schema = z.object({ name: z.string().trim() });

export type ${dashToPascal(name)}Input = z.infer<typeof ${dashToPascal(name)}Schema>;

export type ${dashToPascal(name)}Output = string;

@Injectable()
export class ${dashToPascal(name)}Service implements I${dashToPascal(name)}Adapter {
  @ValidateSchema(${dashToPascal(name)}Schema)
  get({ name }: ${dashToPascal(name)}Input): ${dashToPascal(name)}Output {
    return name;
  }
}
`

module.exports = {
  getServiceLib
}