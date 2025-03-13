
import pluralize from 'pluralize'
import { dashToPascal } from '../../textUtils.mjs'

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

export {
  getModuleControllerModule
}