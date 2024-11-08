const { dashToPascal } = require("../../textUtils")

const getServiceInfra = (name) => `import { Injectable } from '@nestjs/common';

import { I${dashToPascal(name)}Adapter } from './adapter';

export type ${dashToPascal(name)}GetInput = {};
export type ${dashToPascal(name)}GetOutput = {};

@Injectable()
export class ${dashToPascal(name)}Service implements I${dashToPascal(name)}Adapter {
  get(input: ${dashToPascal(name)}GetInput): ${dashToPascal(name)}GetOutput {
    return input;
  }
}
`

module.exports = {
  getServiceInfra
}