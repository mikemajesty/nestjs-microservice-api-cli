import { dashToPascal } from "../../../textUtils.mjs"

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';
import { ConvertTypeOrmFilter, SearchTypeEnum, ValidateDatabaseSortAllowed } from '@/utils/decorators';
import { IEntity } from '@/utils/entity';
import { PaginationUtils } from '@/utils/pagination';

@Injectable()
export class ${dashToPascal(name)}Repository extends TypeORMRepository<Model> implements I${dashToPascal(name)}Repository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }

  @ConvertTypeOrmFilter<${dashToPascal(name)}Entity>([{ name: 'name', type: SearchTypeEnum.like }])
  @ValidateDatabaseSortAllowed<${dashToPascal(name)}Entity>({ name: 'name' }, { name: 'createdAt' })
  async paginate(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    const skip = PaginationUtils.calculateSkip(input);

    const [docs, total] = await this.repository.findAndCount({
      take: input.limit,
      skip,
      order: input.sort as FindOptionsOrder<IEntity>,
      where: input.search as FindOptionsWhere<IEntity>
    });

    return { docs, total, page: input.page, limit: input.limit };
  }
}

type Model = ${dashToPascal(name)}Schema & ${dashToPascal(name)}Entity;
`

export {
  getModuleRepository
}