function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

<<<<<<< HEAD
const getModuleModule = (name) => `import { Module } from '@nestjs/common';
=======
const getModuleModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { IsLoggedMiddleware } from '@/observables/middlewares';
import { RedisCacheModule } from '@/infra/cache/redis';
import { LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';
>>>>>>> 4620d9e9fb7378a4428710f30a5e36d07508a3b8

import { ${capitalizeFirstLetter(name)}Controller } from './controller';

@Module({
<<<<<<< HEAD
  imports: [],
=======
  imports: [TokenLibModule, LoggerModule, RedisCacheModule],
>>>>>>> 4620d9e9fb7378a4428710f30a5e36d07508a3b8
  controllers: [${capitalizeFirstLetter(name)}Controller]
})
export class ${capitalizeFirstLetter(name)}Module {}
`

module.exports = {
  getModuleModule
}