
const pluralize = require('pluralize')
const { dashToPascal } = require('../../textUtils')

const getModuleControllerModule = (name) => `import { Controller, Get, Req, Version } from '@nestjs/common';

import { ApiRequest } from '@/utils/request';

@Controller('${pluralize(name)}')
export class ${dashToPascal(name)}Controller {
  @Get()
  @Version('1')
  async get(@Req() {}: ApiRequest): Promise<string> {
    return 'text';
  }
}
`

module.exports = {
  getModuleControllerModule
}