
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { PostgresRepository } from '@/infra/repository/postgres/repository';
import { ValidatePostgresFilter } from '@/utils/decorators/database/postgres/validate-typeorm-filter.decorator';
import { ValidateDatabaseSortAllowed } from '@/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from '@/utils/decorators/types';
import { calucaleSkip } from '@/utils/pagination';

type Model = ${capitalizeFirstLetter(name)}Schema & ${capitalizeFirstLetter(name)}Entity;

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository extends PostgresRepository<Model> implements I${capitalizeFirstLetter(name)}Repository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }

  @ValidateDatabaseSortAllowed<${capitalizeFirstLetter(name)}Entity>('createdAt', 'name')
  @ValidatePostgresFilter<${capitalizeFirstLetter(name)}Entity>([{ name: 'name', type: SearchTypeEnum.like }])
  async paginate(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const skip = calucaleSkip(input);

    const [docs, total] = await this.repository.findAndCount({
      take: input.limit,
      skip,
      order: input.sort,
      where: input.search as FindOptionsWhere<${capitalizeFirstLetter(name)}Entity>
    });

    return { docs, total, page: input.page, limit: input.limit };
  }
}
`

module.exports = {
  getModuleRepository
}