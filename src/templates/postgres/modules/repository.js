
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { PostgresRepository } from '@/infra/repository/postgres/repository';
import { ValidateDatabaseSort } from '@/utils/decorators/validate-allowed-sort-order.decorator';
import { SearchTypeEnum, ValidatePostgresFilter } from '@/utils/decorators/validate-postgres-filter.decorator';
import { calucaleSkip } from '@/utils/pagination';

import { ${capitalizeFirstLetter(name)}Schema } from './schema';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from './types';

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository
  extends PostgresRepository<${capitalizeFirstLetter(name)}Schema & ${capitalizeFirstLetter(name)}Entity>
  implements Omit<I${capitalizeFirstLetter(name)}Repository, 'updateMany' | 'seed'>
{
  constructor(readonly repository: Repository<${capitalizeFirstLetter(name)}Schema & ${capitalizeFirstLetter(name)}Entity>) {
    super(repository);
  }

  @ValidatePostgresFilter([{ name: 'name', type: SearchTypeEnum.like }])
  @ValidateDatabaseSort(['createdAt', 'name'])
  async paginate(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const skip = calucaleSkip(input);

    const [docs, total] = await this.repository.findAndCount({
      take: input.limit,
      skip,
      order: input.sort,
      where: input.search
    });

    return { docs, total, page: input.page, limit: input.limit };
  }
}
`

module.exports = {
  getModuleRepository
}