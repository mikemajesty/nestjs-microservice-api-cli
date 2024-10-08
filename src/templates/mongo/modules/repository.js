const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}, ${capitalizeFirstLetter(name)}Document } from '@/infra/database/mongo/schemas/${name}';
import { MongoRepository } from '@/infra/repository';
import { MongoRepositoryModelSessionType } from '@/utils/database/mongoose';
import { ConvertMongooseFilter, SearchTypeEnum, ValidateDatabaseSortAllowed } from '@/utils/decorators';

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository extends MongoRepository<${capitalizeFirstLetter(name)}Document> implements I${capitalizeFirstLetter(name)}Repository {
  constructor(@InjectModel(${capitalizeFirstLetter(name)}.name) readonly entity: MongoRepositoryModelSessionType<PaginateModel<${capitalizeFirstLetter(name)}Document>>) {
    super(entity);
  }

  @ConvertMongooseFilter([{ name: 'name', type: SearchTypeEnum.like }])
  @ValidateDatabaseSortAllowed('name', 'createdAt')
  async paginate({ limit, page, sort, search }: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const ${pluralize(name)} = await this.entity.paginate(search, { page, limit, sort });

    return { docs: ${pluralize(name)}.docs.map((u) => u.toObject({ virtuals: true })), limit, page, total: ${name}s.totalDocs };
  }
}
`

module.exports = {
  getModuleRepository
}