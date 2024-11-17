const pluralize = require('pluralize')
const { dashToPascal, snakeToCamel } = require('../../../textUtils')

const getModuleController = (name) => `import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('/${pluralize(name)}')
@ApiTags('${pluralize(name)}')
@ApiBearerAuth()
export class ${dashToPascal(name)}Controller {
  constructor(
    private readonly ${snakeToCamel(name)}CreateUsecase: I${dashToPascal(name)}CreateAdapter,
    private readonly ${snakeToCamel(name)}UpdateUsecase: I${dashToPascal(name)}UpdateAdapter,
    private readonly ${snakeToCamel(name)}DeleteUsecase: I${dashToPascal(name)}DeleteAdapter,
    private readonly ${snakeToCamel(name)}ListUsecase: I${dashToPascal(name)}ListAdapter,
    private readonly ${snakeToCamel(name)}GetByIdUsecase: I${dashToPascal(name)}GetByIdAdapter
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Req() { body }: ApiRequest): Promise<${dashToPascal(name)}CreateOutput> {
    return this.${snakeToCamel(name)}CreateUsecase.execute(body as ${dashToPascal(name)}CreateInput);
  }

  @Put(':id')
  @ApiResponse(SwaggerResponse.update[200])
  @ApiResponse(SwaggerResponse.update[404])
  @ApiBody(SwaggerRequest.updateBody)
  @ApiParam({ name: 'id', required: true })
  async update(@Req() { body, params }: ApiRequest): Promise<${dashToPascal(name)}UpdateOutput> {
    return this.${snakeToCamel(name)}UpdateUsecase.execute({ ...body, id: params.id } as ${dashToPascal(name)}UpdateInput);
  }

  @Get()
  @ApiQuery(SwaggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwaggerRequest.listQuery.pagination.page)
  @ApiQuery(SwaggerRequest.listQuery.sort)
  @ApiQuery(SwaggerRequest.listQuery.search)
  @ApiResponse(SwaggerResponse.list[200])
  @ApiResponse(SwaggerResponse.list[400])
  async list(@Req() { query }: ApiRequest): Promise<${dashToPascal(name)}ListOutput> {
    const input: ${dashToPascal(name)}ListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search) || {},
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.${snakeToCamel(name)}ListUsecase.execute(input);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.getById[200])
  @ApiResponse(SwaggerResponse.getById[404])
  async getById(@Req() { params }: ApiRequest): Promise<${dashToPascal(name)}GetByIdOutput> {
    return await this.${snakeToCamel(name)}GetByIdUsecase.execute(params as ${dashToPascal(name)}GetByIdInput);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[404])
  async delete(@Req() { params }: ApiRequest): Promise<${dashToPascal(name)}DeleteOutput> {
    return await this.${snakeToCamel(name)}DeleteUsecase.execute(params as ${dashToPascal(name)}DeleteInput);
  }
}
`

module.exports = {
  getModuleController
}