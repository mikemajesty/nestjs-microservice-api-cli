
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreRepository = (name) => `import { IRepository } from '@/infra/repository';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/modules/${name}/types';
import { DatabaseOptionsType } from '@/utils/database/sequelize';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';

export abstract class I${capitalizeFirstLetter(name)}Repository extends IRepository<${capitalizeFirstLetter(name)}Entity> {
  abstract paginate<TOptions = DatabaseOptionsType>(input: ${capitalizeFirstLetter(name)}ListInput, options?: TOptions): Promise<${capitalizeFirstLetter(name)}ListOutput>;
}
`

module.exports = {
  getCoreRepository
}