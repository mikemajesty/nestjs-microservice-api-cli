const { dashToPascal } = require("../../../textUtils")

const getCoreSingleRepository = (name) => `import { IRepository } from '@/infra/repository';

import { ${dashToPascal(name)}Entity } from '../entity/${name}';

export abstract class I${dashToPascal(name)}Repository extends IRepository<${dashToPascal(name)}Entity> {}
`

module.exports = {
  getCoreSingleRepository
}