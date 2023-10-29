
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleInfa = (name) => `import { Module } from '@nestjs/common';

import { I${capitalizeFirstLetter(name)}Adapter } from './adapter';
import { ${capitalizeFirstLetter(name)}Service } from './service';

@Module({
  imports: [],
  providers: [
    {
      provide: I${capitalizeFirstLetter(name)}Adapter,
      useClass: ${capitalizeFirstLetter(name)}Service
    }
  ],
  exports: [I${capitalizeFirstLetter(name)}Adapter]
})
export class ${capitalizeFirstLetter(name)}Module {}
`

module.exports = {
  getModuleInfa
}