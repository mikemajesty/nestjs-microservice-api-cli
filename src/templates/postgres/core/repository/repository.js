
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreRepository = (name) => `import { IRepository } from '@/infra/repository';

import { ${capitalizeFirstLetter(name)}Entity } from '../entity/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '../use-cases/${name}-list';

export abstract class I${capitalizeFirstLetter(name)}Repository extends IRepository<${capitalizeFirstLetter(name)}Entity> {
  abstract paginate(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput>;
}
`

module.exports = {
  getCoreRepository
}