
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';
import { SearchTypeEnum, ValidateDatabaseSortAllowed, ValidateMongooseFilter } from '@/utils/decorators';
import { calculateSkip } from '@/utils/pagination';

type Model = ${capitalizeFirstLetter(name)}Schema & ${capitalizeFirstLetter(name)}Entity;

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository extends TypeORMRepository<Model> implements I${capitalizeFirstLetter(name)}Repository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }

  @ValidateMongooseFilter<${capitalizeFirstLetter(name)}Entity>([
    { name: 'name', type: SearchTypeEnum.like },
  ])
  @ValidateDatabaseSortAllowed<${capitalizeFirstLetter(name)}Entity>('name', 'createdAt')
  async paginate(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const skip = calculateSkip(input);

    const [docs, total] = await this.repository.findAndCount({
      take: input.limit,
      skip,
      order: input.sort,
      where: input.search as FindOptionsWhere<unknown>
    });

    return { docs, total, page: input.page, limit: input.limit };
  }
}
`

module.exports = {
  getModuleRepository
}