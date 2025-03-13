import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleRepository = (name) => `import { IRepository } from '@/infra/repository';

import { ${dashToPascal(name)}Entity } from '../entity/${name}';

export abstract class I${dashToPascal(name)}Repository extends IRepository<${dashToPascal(name)}Entity> {}
`

export {
  getCoreSingleRepository
}