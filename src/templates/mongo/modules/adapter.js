
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleAdapter = (name) => `import {
  ${capitalizeFirstLetter(name)}CreateInput,
  ${capitalizeFirstLetter(name)}CreateOutput,
  ${capitalizeFirstLetter(name)}DeleteInput,
  ${capitalizeFirstLetter(name)}DeleteOutput,
  ${capitalizeFirstLetter(name)}GetByIDInput,
  ${capitalizeFirstLetter(name)}GetByIDOutput,
  ${capitalizeFirstLetter(name)}ListInput,
  ${capitalizeFirstLetter(name)}ListOutput,
  ${capitalizeFirstLetter(name)}UpdateInput,
  ${capitalizeFirstLetter(name)}UpdateOutput
} from './types';

export abstract class I${capitalizeFirstLetter(name)}CreateAdapter {
  abstract execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}UpdateAdapter {
  abstract execute(input: ${capitalizeFirstLetter(name)}UpdateInput): Promise<${capitalizeFirstLetter(name)}UpdateOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}ListAdapter {
  abstract execute(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}DeleteAdapter {
  abstract execute(input: ${capitalizeFirstLetter(name)}DeleteInput): Promise<${capitalizeFirstLetter(name)}DeleteOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}GetByIDAdapter {
  abstract execute(input: ${capitalizeFirstLetter(name)}GetByIDInput): Promise<${capitalizeFirstLetter(name)}GetByIDOutput>;
}
`

module.exports = {
  getModuleAdapter
}