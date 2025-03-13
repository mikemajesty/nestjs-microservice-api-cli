import { dashToPascal } from "../../../textUtils.mjs"

const getModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ${dashToPascal(name)}Schema } from '@/infra/database/postgres/schemas/${name}';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';
import { AuthenticationMiddleware } from '@/middlewares/middlewares';

import {
  I${dashToPascal(name)}CreateAdapter,
  I${dashToPascal(name)}DeleteAdapter,
  I${dashToPascal(name)}GetByIdAdapter,
  I${dashToPascal(name)}ListAdapter,
  I${dashToPascal(name)}UpdateAdapter
} from './adapter';
import { ${dashToPascal(name)}Controller } from './controller';
import { ${dashToPascal(name)}Repository } from './repository';

@Module({
  imports: [TokenLibModule, LoggerModule, RedisCacheModule, TypeOrmModule.forFeature([${dashToPascal(name)}Schema])],
  controllers: [${dashToPascal(name)}Controller],
  providers: [
    {
      provide: I${dashToPascal(name)}Repository,
      useFactory: (repository: Repository<${dashToPascal(name)}Schema & ${dashToPascal(name)}Entity>) => {
        return new ${dashToPascal(name)}Repository(repository);
      },
      inject: [getRepositoryToken(${dashToPascal(name)}Schema)]
    },
    {
      provide: I${dashToPascal(name)}CreateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}CreateUsecase(repository, logger),
      inject: [ILoggerAdapter, I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}UpdateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}UpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}GetByIdAdapter,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}GetByIdUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}ListAdapter,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}ListUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}DeleteAdapter,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}DeleteUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    }
  ],
  exports: []
})
export class ${dashToPascal(name)}Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(${dashToPascal(name)}Controller);
  }
}
`

export {
  getModule
}