function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RedisCacheModule } from '@/infra/cache/redis';
import { LoggerModule } from '@/infra/logger';
import { TokenModule } from '@/libs/auth';
import { IsLoggedMiddleware } from '@/utils/middlewares/is-logged.middleware';

import { ${capitalizeFirstLetter(name)}Controller } from './controller';

@Module({
  imports: [TokenModule, LoggerModule, RedisCacheModule],
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