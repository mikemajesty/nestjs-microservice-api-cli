import { dashToPascal } from "../../textUtils.mjs"

const getAdapterInfra = (name) => `import { ${dashToPascal(name)}GetInput, ${dashToPascal(name)}GetOutput } from './service';

export abstract class I${dashToPascal(name)}Adapter {
  abstract get(input: ${dashToPascal(name)}GetInput): ${dashToPascal(name)}GetOutput;
}
`

export default {
  getAdapterInfra
}