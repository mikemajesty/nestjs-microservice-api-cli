import { dashToPascal } from "../../textUtils.mjs"

const getModuleLib = (name) => `import { Module } from '@nestjs/common';

import { I${dashToPascal(name)}Adapter } from './adapter';
import { ${dashToPascal(name)}Service } from './service';

@Module({
  imports: [],
  providers: [
    {
      provide: I${dashToPascal(name)}Adapter,
      useFactory: () => new ${dashToPascal(name)}Service()
    }
  ],
  exports: [I${dashToPascal(name)}Adapter]
})
export class ${dashToPascal(name)}LibModule {}
`

export {
  getModuleLib
}