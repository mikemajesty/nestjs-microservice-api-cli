
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { MongoRepository } from '@/infra/repository';
import { ValidateDatabaseSort } from '@/utils/decorators/validate-allowed-sort-order.decorator';
import { SearchTypeEnum, ValidateMongoFilter } from '@/utils/decorators/validate-mongo-filter.decorator';

import { ${capitalizeFirstLetter(name)}, ${capitalizeFirstLetter(name)}Document } from './schema';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from './types';

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository extends MongoRepository<${capitalizeFirstLetter(name)}Document> implements I${capitalizeFirstLetter(name)}Repository {
  constructor(@InjectModel(${capitalizeFirstLetter(name)}.name) readonly entity: PaginateModel<${capitalizeFirstLetter(name)}Document>) {
    super(entity);
  }

  @ValidateMongoFilter([{ name: 'name', type: SearchTypeEnum.like }])
  @ValidateDatabaseSort(['name', 'createdAt'])
  async paginate({ limit, page, sort, search }: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const ${name}s = await this.entity.paginate(search, { page, limit, sort });

    return { docs: ${name}s.docs.map((u) => u.toObject({ virtuals: true })), limit, page, total: ${name}s.totalDocs };
  }
}
`

module.exports = {
  getModuleRepository
}