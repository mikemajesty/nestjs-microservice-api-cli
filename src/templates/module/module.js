function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { IsLoggedMiddleware } from '@/observables/middlewares';
import { RedisCacheModule } from '@/infra/cache/redis';
import { LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';

import { ${capitalizeFirstLetter(name)}Controller } from './controller';

@Module({
  imports: [TokenLibModule, LoggerModule, RedisCacheModule],
  controllers: [${capitalizeFirstLetter(name)}Controller]
})
export class ${capitalizeFirstLetter(name)}Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(${capitalizeFirstLetter(name)}Controller);
  }
}
`

module.exports = {
  getModuleModule
}