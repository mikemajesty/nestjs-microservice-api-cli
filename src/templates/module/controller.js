
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleControllerModule = (name) => `import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/utils/decorators';
import { UserRole } from '@/core/user/entity/user';
import { ApiRequest } from '@/utils/request';

import { SwagggerResponse } from './swagger';

@Controller('${pluralize(name)}')
@ApiTags('${name}')
@ApiBearerAuth()
@Roles(UserRole.USER)
export class ${capitalizeFirstLetter(name)}Controller {
  @Get()
  @ApiResponse(SwagggerResponse.get[200])
  async get(@Req() {}: ApiRequest): Promise<string> {
    return 'text';
  }
}
`

module.exports = {
  getModuleControllerModule
}