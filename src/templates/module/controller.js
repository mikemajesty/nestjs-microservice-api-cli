
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleControllerModule = (name) => `import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiRequest } from '@/utils/request';

import { SwagggerResponse } from './swagger';

@Controller('${pluralize(name)}')
@ApiTags('${name}')
@ApiBearerAuth()
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