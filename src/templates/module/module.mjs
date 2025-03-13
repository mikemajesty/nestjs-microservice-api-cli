import { dashToPascal } from "../../textUtils.mjs"

const getModuleModule = (name) => `import { Module } from '@nestjs/common';

import { ${dashToPascal(name)}Controller } from './controller';

@Module({
  imports: [],
  controllers: [${dashToPascal(name)}Controller]
})
export class ${dashToPascal(name)}Module {}
`

export {
  getModuleModule
}