const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleController = (name) => `import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIDInput, ${capitalizeFirstLetter(name)}GetByIDOutput } from '@/core/${name}/use-cases/${name}-getByID';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { UserRole } from '@/core/user/entity/user';
import { Roles } from '@/utils/decorators/role.decorator';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import {
  I${capitalizeFirstLetter(name)}CreateAdapter,
  I${capitalizeFirstLetter(name)}DeleteAdapter,
  I${capitalizeFirstLetter(name)}GetByIDAdapter,
  I${capitalizeFirstLetter(name)}ListAdapter,
  I${capitalizeFirstLetter(name)}UpdateAdapter
} from './adapter';
import { SwagggerRequest, SwagggerResponse } from './swagger';

@Controller('/${pluralize(name)}')
@ApiTags('${pluralize(name)}')
@ApiBearerAuth()
@Roles(UserRole.USER)
export class ${capitalizeFirstLetter(name)}Controller {
  constructor(
    private readonly ${name}CreateUsecase: I${capitalizeFirstLetter(name)}CreateAdapter,
    private readonly ${name}UpdateUsecase: I${capitalizeFirstLetter(name)}UpdateAdapter,
    private readonly ${name}DeleteUsecase: I${capitalizeFirstLetter(name)}DeleteAdapter,
    private readonly ${name}ListUsecase: I${capitalizeFirstLetter(name)}ListAdapter,
    private readonly ${name}GetByIDUsecase: I${capitalizeFirstLetter(name)}GetByIDAdapter
  ) {}

  @Post()
  @ApiResponse(SwagggerResponse.create[200])
  @ApiBody(SwagggerRequest.createBody)
  async create(@Req() { body }: ApiRequest): Promise<${capitalizeFirstLetter(name)}CreateOutput> {
    return this.${name}CreateUsecase.execute(body as ${capitalizeFirstLetter(name)}CreateInput);
  }

  @Put()
  @ApiResponse(SwagggerResponse.update[200])
  @ApiResponse(SwagggerResponse.update[404])
  @ApiBody(SwagggerRequest.updateBody)
  async update(@Req() { body }: ApiRequest): Promise<${capitalizeFirstLetter(name)}UpdateOutput> {
    return this.${name}UpdateUsecase.execute(body as ${capitalizeFirstLetter(name)}UpdateInput);
  }

  @Get()
  @ApiQuery(SwagggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwagggerRequest.listQuery.pagination.page)
  @ApiQuery(SwagggerRequest.listQuery.sort)
  @ApiQuery(SwagggerRequest.listQuery.search)
  @ApiResponse(SwagggerResponse.list[200])
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
  @ApiResponse(SwagggerResponse.getByID[200])
  @ApiResponse(SwagggerResponse.getByID[404])
  async getById(@Req() { params }: ApiRequest): Promise<${capitalizeFirstLetter(name)}GetByIDOutput> {
    return await this.${name}GetByIDUsecase.execute(params as ${capitalizeFirstLetter(name)}GetByIDInput);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.delete[200])
  @ApiResponse(SwagggerResponse.delete[404])
  async delete(@Req() { params }: ApiRequest): Promise<${capitalizeFirstLetter(name)}DeleteOutput> {
    return await this.${name}DeleteUsecase.execute(params as ${capitalizeFirstLetter(name)}DeleteInput);
  }
}
`

module.exports = {
  getModuleController
}