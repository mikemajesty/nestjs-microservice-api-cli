const { dashToPascal } = require("../../textUtils")

const getModuleModule = (name) => `import { Module } from '@nestjs/common';

import { ${dashToPascal(name)}Controller } from './controller';

@Module({
  imports: [],
  controllers: [${dashToPascal(name)}Controller]
})
export class ${dashToPascal(name)}Module {}
`

module.exports = {
  getModuleModule
}