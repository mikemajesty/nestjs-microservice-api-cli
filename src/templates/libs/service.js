
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getServiceLib = (name) => `import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { I${capitalizeFirstLetter(name)}Adapter } from './adapter';

const ${capitalizeFirstLetter(name)}Schema = z.object({ name: z.string().trim() });

export type ${capitalizeFirstLetter(name)}Input = z.infer<typeof ${capitalizeFirstLetter(name)}Schema>;

export type ${capitalizeFirstLetter(name)}Output = string;

@Injectable()
export class ${capitalizeFirstLetter(name)}Service implements I${capitalizeFirstLetter(name)}Adapter {
  @ValidateSchema(${capitalizeFirstLetter(name)}Schema)
  get({ name }: ${capitalizeFirstLetter(name)}Input): ${capitalizeFirstLetter(name)}Output {
    return name;
  }
}
`

module.exports = {
  getServiceLib
}