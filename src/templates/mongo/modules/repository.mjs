import pluralize from 'pluralize'
import { dashToPascal, snakeToCamel } from '../../../textUtils.mjs'

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel } from 'mongoose';
import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';

import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}, ${dashToPascal(name)}Document } from '@/infra/database/mongo/schemas/${name}';
import { MongoRepository } from '@/infra/repository';
import { ConvertMongooseFilter, SearchTypeEnum, ValidateDatabaseSortAllowed } from '@/utils/decorators';
import { IEntity } from '@/utils/entity';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

@Injectable()
export class ${dashToPascal(name)}Repository extends MongoRepository<${dashToPascal(name)}Document> implements I${dashToPascal(name)}Repository {
  constructor(@InjectModel(${dashToPascal(name)}.name) readonly entity: MongoRepositoryModelSessionType<PaginateModel<${dashToPascal(name)}Document>>) {
    super(entity);
  }

  @ConvertMongooseFilter([{ name: 'name', type: SearchTypeEnum.like }])
  @ValidateDatabaseSortAllowed({ name: 'name' }, { name: 'createdAt' })
  async paginate({ limit, page, sort, search }: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput> {
    const ${pluralize(snakeToCamel(name))} = await this.entity.paginate(search as FilterQuery<IEntity>, {
      page,
      limit,
      sort: sort as object
    });

    return { docs: ${pluralize(snakeToCamel(name))}.docs.map((u) => new ${dashToPascal(name)}Entity(u.toObject({ virtuals: true }))), limit, page, total: ${snakeToCamel(name)}s.totalDocs };
  }
}
`

export {
  getModuleRepository
}