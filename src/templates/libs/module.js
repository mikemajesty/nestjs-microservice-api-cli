
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleLib = (name) => `import { Module } from '@nestjs/common';

import { I${capitalizeFirstLetter(name)}Adapter } from './adapter';
import { ${capitalizeFirstLetter(name)}Service } from './service';

@Module({
  imports: [],
  providers: [
    {
      provide: I${capitalizeFirstLetter(name)}Adapter,
      useFactory: () => new ${capitalizeFirstLetter(name)}Service()
    }
  ],
  exports: [I${capitalizeFirstLetter(name)}Adapter]
})
export class ${capitalizeFirstLetter(name)}LibModule {}
`

module.exports = {
  getModuleLib
}