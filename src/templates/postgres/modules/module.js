
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-getByID';
import { ${capitalizeFirstLetter(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ${capitalizeFirstLetter(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { TokenModule } from '@/libs/auth';
import { IsLoggedMiddleware } from '@/utils/middlewares/is-logged.middleware';

import {
  I${capitalizeFirstLetter(name)}CreateAdapter,
  I${capitalizeFirstLetter(name)}DeleteAdapter,
  I${capitalizeFirstLetter(name)}GetByIDAdapter,
  I${capitalizeFirstLetter(name)}ListAdapter,
  I${capitalizeFirstLetter(name)}UpdateAdapter
} from './adapter';
import { ${capitalizeFirstLetter(name)}Controller } from './controller';
import { ${capitalizeFirstLetter(name)}Repository } from './repository';

@Module({
  imports: [TokenModule, LoggerModule, TypeOrmModule.forFeature([${capitalizeFirstLetter(name)}Schema]), RedisCacheModule],
  controllers: [${capitalizeFirstLetter(name)}Controller],
  providers: [
    {
      provide: I${capitalizeFirstLetter(name)}Repository,
      useFactory: (repository: Repository<${capitalizeFirstLetter(name)}Schema & ${capitalizeFirstLetter(name)}Entity>) => {
        return new ${capitalizeFirstLetter(name)}Repository(repository);
      },
      inject: [getRepositoryToken(${capitalizeFirstLetter(name)}Schema)]
    },
    {
      provide: I${capitalizeFirstLetter(name)}CreateAdapter,
      useFactory: (repository: I${capitalizeFirstLetter(name)}Repository, logger: ILoggerAdapter) => new ${capitalizeFirstLetter(name)}CreateUsecase(repository, logger),
      inject: [I${capitalizeFirstLetter(name)}Repository, ILoggerAdapter]
    },
    {
      provide: I${capitalizeFirstLetter(name)}UpdateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: I${capitalizeFirstLetter(name)}Repository) => new ${capitalizeFirstLetter(name)}UpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, I${capitalizeFirstLetter(name)}Repository]
    },
    {
      provide: I${capitalizeFirstLetter(name)}GetByIDAdapter,
      useFactory: (repository: I${capitalizeFirstLetter(name)}Repository) => new ${capitalizeFirstLetter(name)}GetByIdUsecase(repository),
      inject: [I${capitalizeFirstLetter(name)}Repository]
    },
    {
      provide: I${capitalizeFirstLetter(name)}ListAdapter,
      useFactory: (repository: I${capitalizeFirstLetter(name)}Repository) => new ${capitalizeFirstLetter(name)}ListUsecase(repository),
      inject: [I${capitalizeFirstLetter(name)}Repository]
    },
    {
      provide: I${capitalizeFirstLetter(name)}DeleteAdapter,
      useFactory: (repository: I${capitalizeFirstLetter(name)}Repository) => new ${capitalizeFirstLetter(name)}DeleteUsecase(repository),
      inject: [I${capitalizeFirstLetter(name)}Repository]
    }
  ],
  exports: []
})
export class ${capitalizeFirstLetter(name)}Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(${capitalizeFirstLetter(name)}Controller);
  }
}
`

module.exports = {
  getModule
}