
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getServiceInfra = (name) => `import { Injectable } from '@nestjs/common';

import { I${capitalizeFirstLetter(name)}Adapter } from './adapter';

export type ${capitalizeFirstLetter(name)}GetInput = {};
export type ${capitalizeFirstLetter(name)}GetOutput = {};

@Injectable()
export class ${capitalizeFirstLetter(name)}Service implements I${capitalizeFirstLetter(name)}Adapter {
  get(input: ${capitalizeFirstLetter(name)}GetInput): ${capitalizeFirstLetter(name)}GetOutput {
    return input;
  }
}
`

module.exports = {
  getServiceInfra
}