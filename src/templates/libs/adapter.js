
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getAdapterLib = (name) => `import { ${capitalizeFirstLetter(name)}Input, ${capitalizeFirstLetter(name)}Output } from './service';

export abstract class I${capitalizeFirstLetter(name)}Adapter {
  abstract get(input: ${capitalizeFirstLetter(name)}Input): ${capitalizeFirstLetter(name)}Output;
}
`

module.exports = {
  getAdapterLib
}