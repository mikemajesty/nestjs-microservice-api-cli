function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleModule = (name) => `import { Module } from '@nestjs/common';

import { ${capitalizeFirstLetter(name)}Controller } from './controller';

@Module({
  imports: [],
  controllers: [${capitalizeFirstLetter(name)}Controller]
})
export class ${capitalizeFirstLetter(name)}Module {}
`

module.exports = {
  getModuleModule
}