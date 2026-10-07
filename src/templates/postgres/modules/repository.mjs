import { dashToPascal } from "../../../textUtils.mjs"

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';
import { SearchTypeEnum, TransformSort, TransformTypeOrmSearch } from '@/utils/decorators';

@Injectable()
export class ${dashToPascal(name)}Repository extends TypeORMRepository<Model, ${dashToPascal(name)}Entity> implements I${dashToPascal(name)}Repository {
  constructor(readonly repository: Repository<Model>) {
    super(repository, ${dashToPascal(name)}Entity);
  }

  @TransformSort<${dashToPascal(name)}Entity>({ name: 'name' }, { name: 'createdAt' })
  @TransformTypeOrmSearch<${dashToPascal(name)}Entity>([{ name: 'name', type: SearchTypeEnum.like }])
  async paginate(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    return this.applyPagination(input);
  }
}

type Model = ${dashToPascal(name)}Schema & ${dashToPascal(name)}Entity;
`

export {
  getModuleRepository
}