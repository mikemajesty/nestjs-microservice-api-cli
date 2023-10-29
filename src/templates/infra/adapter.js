
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getAdapterInfra = (name) => `import { ${capitalizeFirstLetter(name)}GetInput, ${capitalizeFirstLetter(name)}GetOutput } from './service';

export abstract class I${capitalizeFirstLetter(name)}Adapter {
  abstract get(input: ${capitalizeFirstLetter(name)}GetInput): ${capitalizeFirstLetter(name)}GetOutput;
}
`

module.exports = {
  getAdapterInfra
}