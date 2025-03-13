import { dashToPascal } from "../../../textUtils.mjs"

const getCoreRepository = (name) => `import { IRepository } from '@/infra/repository';

import { ${dashToPascal(name)}Entity } from '../entity/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '../use-cases/${name}-list';

export abstract class I${dashToPascal(name)}Repository extends IRepository<${dashToPascal(name)}Entity> {
  abstract paginate(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput>;
}
`

export {
  getCoreRepository
}