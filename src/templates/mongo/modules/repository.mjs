import { dashToPascal } from '../../../textUtils.mjs'

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}, ${dashToPascal(name)}Document } from '@/infra/database/mongo/schemas/${name}';
import { MongoRepository } from '@/infra/repository';
import { SearchTypeEnum, TransformMongooseSearch, TransformSort } from '@/utils/decorators';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

@Injectable()
export class ${dashToPascal(name)}Repository extends MongoRepository<${dashToPascal(name)}Document, ${dashToPascal(name)}Entity> implements I${dashToPascal(name)}Repository {
  constructor(@InjectModel(${dashToPascal(name)}.name) readonly entity: MongoRepositoryModelSessionType<PaginateModel<${dashToPascal(name)}Document>>) {
    super(entity, ${dashToPascal(name)}Entity);
  }

  @TransformSort<${dashToPascal(name)}Entity>({ name: 'createdAt' }, { name: 'name' })
  @TransformMongooseSearch<${dashToPascal(name)}Entity>([{ name: 'name', type: SearchTypeEnum.like }])
  async paginate(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    return this.applyPagination(input);
  }
}
`

export {
  getModuleRepository
}