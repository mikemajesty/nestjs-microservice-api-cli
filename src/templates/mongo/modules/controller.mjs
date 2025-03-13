import pluralize from 'pluralize'
import { dashToPascal, snakeToCamel } from '../../../textUtils.mjs'

const getModuleController = (name) => `import { Controller, Delete, Get, HttpCode, Post, Put, Req, Version } from '@nestjs/common';

import { ${dashToPascal(name)}CreateInput, ${dashToPascal(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteInput, ${dashToPascal(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdInput, ${dashToPascal(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateInput, ${dashToPascal(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import {
  I${dashToPascal(name)}CreateAdapter,
  I${dashToPascal(name)}DeleteAdapter,
  I${dashToPascal(name)}GetByIdAdapter,
  I${dashToPascal(name)}ListAdapter,
  I${dashToPascal(name)}UpdateAdapter
} from './adapter';

@Controller('/${pluralize(name)}')
export class ${dashToPascal(name)}Controller {
  constructor(
    private readonly ${snakeToCamel(name)}CreateUsecase: I${dashToPascal(name)}CreateAdapter,
    private readonly ${snakeToCamel(name)}UpdateUsecase: I${dashToPascal(name)}UpdateAdapter,
    private readonly ${snakeToCamel(name)}DeleteUsecase: I${dashToPascal(name)}DeleteAdapter,
    private readonly ${snakeToCamel(name)}ListUsecase: I${dashToPascal(name)}ListAdapter,
    private readonly ${snakeToCamel(name)}GetByIdUsecase: I${dashToPascal(name)}GetByIdAdapter
  ) {}

  @Post()
  @Version('1')
  @HttpCode(201)
  async create(@Req() { body }: ApiRequest): Promise<${dashToPascal(name)}CreateOutput> {
    return this.${snakeToCamel(name)}CreateUsecase.execute(body as ${dashToPascal(name)}CreateInput);
  }

  @Put(':id')
  @Version('1')
  async update(@Req() { body, params }: ApiRequest): Promise<${dashToPascal(name)}UpdateOutput> {
    return this.${snakeToCamel(name)}UpdateUsecase.execute({ ...body, id: params.id } as ${dashToPascal(name)}UpdateInput);
  }

  @Get()
  @Version('1')
  async list(@Req() { query }: ApiRequest): Promise<${dashToPascal(name)}ListOutput> {
    const input: ${dashToPascal(name)}ListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.${snakeToCamel(name)}ListUsecase.execute(input);
  }

  @Get('/:id')
  @Version('1')
  async getById(@Req() { params }: ApiRequest): Promise<${dashToPascal(name)}GetByIdOutput> {
    return await this.${snakeToCamel(name)}GetByIdUsecase.execute(params as ${dashToPascal(name)}GetByIdInput);
  }

  @Delete('/:id')
  @Version('1')
  async delete(@Req() { params }: ApiRequest): Promise<${dashToPascal(name)}DeleteOutput> {
    return await this.${snakeToCamel(name)}DeleteUsecase.execute(params as ${dashToPascal(name)}DeleteInput);
  }
}
`

export {
  getModuleController
}