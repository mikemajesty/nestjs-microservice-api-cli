
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleControllerModule = (name) => `import { Controller, Get, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiRequest } from '@/utils/request';

import { SwaggerResponse } from './swagger';

@Controller('${pluralize(name)}')
@ApiTags('${pluralize(name)}')
export class ${capitalizeFirstLetter(name)}Controller {
  @Get()
  @ApiResponse(SwaggerResponse.get[200])
  async get(@Req() {}: ApiRequest): Promise<string> {
    return 'text';
  }
}
`

module.exports = {
  getModuleControllerModule
}