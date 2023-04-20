
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleRepository = (name) => `import { Injectable } from '@nestjs/common';
import { ModelCtor } from 'sequelize-typescript';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { SequelizeRepository } from '@/infra/repository/postgres/repository';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/modules/${name}/types';
import { DatabaseOptionsSchema, DatabaseOptionsType } from '@/utils/database/sequelize';
import { ConvertPaginateInputToSequelizeFilter } from '@/utils/decorators/database/postgres/convert-paginate-input-to-sequelize-filter.decorator';
import { ValidateDatabaseSortAllowed } from '@/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from '@/utils/decorators/types';

type Model = ModelCtor<${capitalizeFirstLetter(name)}Schema> & ${capitalizeFirstLetter(name)}Entity;

@Injectable()
export class ${capitalizeFirstLetter(name)}Repository extends SequelizeRepository<Model> implements I${capitalizeFirstLetter(name)}Repository {
  constructor(readonly repository: Model) {
    super(repository);
  }

  @ValidateDatabaseSortAllowed(['createdAt', 'name', 'breed', 'age'])
  @ConvertPaginateInputToSequelizeFilter([
    { name: 'name', type: SearchTypeEnum.like },
    { name: 'breed', type: SearchTypeEnum.like },
    { name: 'age', type: SearchTypeEnum.equal }
  ])
  async paginate(input: ${capitalizeFirstLetter(name)}ListInput, options: DatabaseOptionsType): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const { schema } = DatabaseOptionsSchema.parse(options);

    const list = await this.repository.schema(schema).findAndCountAll(input);

    return { docs: list.rows, limit: input.limit, page: input.page, total: list.count };
  }
}
`

module.exports = {
  getModuleRepository
}