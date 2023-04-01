
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleController = (name) => `import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@/core/user/entity/user';
import { Roles } from '@/utils/decorators/role.decorator';
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
import {
  ${capitalizeFirstLetter(name)}CreateInput,
  ${capitalizeFirstLetter(name)}CreateOutput,
  ${capitalizeFirstLetter(name)}DeleteInput,
  ${capitalizeFirstLetter(name)}DeleteOutput,
  ${capitalizeFirstLetter(name)}GetByIDInput,
  ${capitalizeFirstLetter(name)}GetByIDOutput,
  ${capitalizeFirstLetter(name)}ListInput,
  ${capitalizeFirstLetter(name)}ListOutput,
  ${capitalizeFirstLetter(name)}UpdateInput,
  ${capitalizeFirstLetter(name)}UpdateOutput
} from './types';

@Controller()
@ApiTags('${name}')
@ApiBearerAuth()
@Roles(UserRole.BACKOFFICE)
export class ${capitalizeFirstLetter(name)}Controller {
  constructor(
    private readonly ${name}Create: I${capitalizeFirstLetter(name)}CreateAdapter,
    private readonly ${name}Update: I${capitalizeFirstLetter(name)}UpdateAdapter,
    private readonly ${name}GetByID: I${capitalizeFirstLetter(name)}GetByIDAdapter,
    private readonly ${name}List: I${capitalizeFirstLetter(name)}ListAdapter,
    private readonly ${name}Delete: I${capitalizeFirstLetter(name)}DeleteAdapter
  ) {}

  @Post('/${name}')
  @ApiResponse(SwagggerResponse.create[200])
  @ApiBody(SwagggerRequest.createBody)
  async create(@Body() input: ${capitalizeFirstLetter(name)}CreateInput): ${capitalizeFirstLetter(name)}CreateOutput {
    return await this.${name}Create.execute(input);
  }

  @Put('/${name}')
  @ApiResponse(SwagggerResponse.update[200])
  @ApiResponse(SwagggerResponse.update[404])
  @ApiBody(SwagggerRequest.updateBody)
  async update(@Body() input: ${capitalizeFirstLetter(name)}UpdateInput): ${capitalizeFirstLetter(name)}UpdateOutput {
    return await this.${name}Update.execute(input);
  }

  @Get('/${name}/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.getByID[200])
  @ApiResponse(SwagggerResponse.getByID[404])
  async getById(@Param() input: ${capitalizeFirstLetter(name)}GetByIDInput): ${capitalizeFirstLetter(name)}GetByIDOutput {
    return await this.${name}GetByID.execute(input);
  }

  @Get('/${name}')
  @ApiQuery(SwagggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwagggerRequest.listQuery.pagination.page)
  @ApiQuery(SwagggerRequest.listQuery.sort)
  @ApiQuery(SwagggerRequest.listQuery.search)
  @ApiResponse(SwagggerResponse.list[200])
  async list(@Query() input: ${capitalizeFirstLetter(name)}ListInput): ${capitalizeFirstLetter(name)}ListOutput {
    input.sort = SortHttpSchema.parse(input.sort);
    input.search = SearchHttpSchema.parse(input.search);
    return await this.${name}List.execute(input);
  }

  @Delete('/${name}/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.delete[200])
  @ApiResponse(SwagggerResponse.delete[404])
  async delete(@Param() input: ${capitalizeFirstLetter(name)}DeleteInput): ${capitalizeFirstLetter(name)}DeleteOutput {
    return await this.${name}Delete.execute(input);
  }
}
`

module.exports = {
  getModuleController
}