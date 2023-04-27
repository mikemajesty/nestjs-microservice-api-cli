
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreRepository = (name) => `import { Transaction } from 'sequelize';

import { IRepository } from '@/infra/repository';
import { DatabaseOptionsType } from '@/utils/database/sequelize';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '../use-cases/${name}-list';

export abstract class I${capitalizeFirstLetter(name)}Repository extends IRepository<${capitalizeFirstLetter(name)}Entity> {
  abstract paginate<TOptions = DatabaseOptionsType>(input: ${capitalizeFirstLetter(name)}ListInput, options?: TOptions): Promise<${capitalizeFirstLetter(name)}ListOutput>;
  abstract startSession<TTransaction = Transaction>(): Promise<TTransaction>;
}
`

module.exports = {
  getCoreRepository
}