const { dashToPascal } = require("../../textUtils")

const getAdapterLib = (name) => `import { ${dashToPascal(name)}Input, ${dashToPascal(name)}Output } from './service';

export abstract class I${dashToPascal(name)}Adapter {
  abstract get(input: ${dashToPascal(name)}Input): ${dashToPascal(name)}Output;
}
`

module.exports = {
  getAdapterLib
}