const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleController = (name) => `import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIdInput, ${capitalizeFirstLetter(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import {
  I${capitalizeFirstLetter(name)}CreateAdapter,
  I${capitalizeFirstLetter(name)}DeleteAdapter,
  I${capitalizeFirstLetter(name)}GetByIdAdapter,
  I${capitalizeFirstLetter(name)}ListAdapter,
  I${capitalizeFirstLetter(name)}UpdateAdapter
} from './adapter';
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('/${pluralize(name)}')
@ApiTags('${pluralize(name)}')
@ApiBearerAuth()
export class ${capitalizeFirstLetter(name)}Controller {
  constructor(
    private readonly ${name}CreateUsecase: I${capitalizeFirstLetter(name)}CreateAdapter,
    private readonly ${name}UpdateUsecase: I${capitalizeFirstLetter(name)}UpdateAdapter,
    private readonly ${name}DeleteUsecase: I${capitalizeFirstLetter(name)}DeleteAdapter,
    private readonly ${name}ListUsecase: I${capitalizeFirstLetter(name)}ListAdapter,
    private readonly ${name}GetByIdUsecase: I${capitalizeFirstLetter(name)}GetByIdAdapter
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Req() { body }: ApiRequest): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    return this.${name}CreateUsecase.execute(body as ${capitalizeFirstLetter(name)}CreateInput);
  }

  @Put(':id')
  @ApiResponse(SwaggerResponse.update[200])
  @ApiResponse(SwaggerResponse.update[404])
  @ApiBody(SwaggerRequest.updateBody)
  @ApiParam({ name: 'id', required: true })
  async update(@Req() { body, params }: ApiRequest): Promise<${capitalizeFirstLetter(name)}UpdateOutput> {
    return this.${name}UpdateUsecase.execute({ ...body, id: params.id } as ${capitalizeFirstLetter(name)}UpdateInput);
  }

  @Get()
  @ApiQuery(SwaggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwaggerRequest.listQuery.pagination.page)
  @ApiQuery(SwaggerRequest.listQuery.sort)
  @ApiQuery(SwaggerRequest.listQuery.search)
  @ApiResponse(SwaggerResponse.list[200])
  async list(@Req() { query }: ApiRequest): Promise<${capitalizeFirstLetter(name)}ListOutput> {
    const input: ${capitalizeFirstLetter(name)}ListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.${name}ListUsecase.execute(input);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.getById[200])
  @ApiResponse(SwaggerResponse.getById[404])
  async getById(@Req() { params }: ApiRequest): Promise<${capitalizeFirstLetter(name)}GetByIdOutput> {
    return await this.${name}GetByIdUsecase.execute(params as ${capitalizeFirstLetter(name)}GetByIdInput);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[404])
  async delete(@Req() { params }: ApiRequest): Promise<${capitalizeFirstLetter(name)}DeleteOutput> {
    return await this.${name}DeleteUsecase.execute(params as ${capitalizeFirstLetter(name)}DeleteInput);
  }
}
`

module.exports = {
  getModuleController
}