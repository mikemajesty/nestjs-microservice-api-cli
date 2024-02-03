
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { IsLoggedMiddleware } from '@/common/middlewares';
import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${capitalizeFirstLetter(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ConnectionName } from '@/infra/database/enum';
import { ${capitalizeFirstLetter(name)}, ${capitalizeFirstLetter(name)}Document, ${capitalizeFirstLetter(name)}Schema } from '@/infra/database/mongo/schemas/${name}';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';
import { TokenModule } from '@/libs/auth';
import { MongoRepositoryModelSessionType } from '@/utils/database/mongoose';

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
  imports: [TokenModule, SecretsModule, LoggerModule, RedisCacheModule],
  controllers: [${capitalizeFirstLetter(name)}Controller],
  providers: [
    {
      provide: I${capitalizeFirstLetter(name)}Repository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<${capitalizeFirstLetter(name)}Document>;

        // use if you want transaction
        const repository: MongoRepositoryModelSessionType<PaginateModel<${capitalizeFirstLetter(name)}Document>> = connection.model<
          ${capitalizeFirstLetter(name)}Document,
          Model
        >(${capitalizeFirstLetter(name)}.name, ${capitalizeFirstLetter(name)}Schema as Schema);

        repository.connection = connection;

        // use if you not want transaction
        // const repository: PaginateModel<${capitalizeFirstLetter(name)}Document> = connection.model<${capitalizeFirstLetter(name)}Document, Model>(${capitalizeFirstLetter(name)}.name, ${capitalizeFirstLetter(name)}Schema as Schema);

        return new ${capitalizeFirstLetter(name)}Repository(repository);
      },
      inject: [getConnectionToken(ConnectionName.USER)]
    },
    {
      provide: I${capitalizeFirstLetter(name)}CreateAdapter,
      useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository, loggerService: ILoggerAdapter) => {
        return new ${capitalizeFirstLetter(name)}CreateUsecase(${name}Repository, loggerService);
      },
      inject: [I${capitalizeFirstLetter(name)}Repository, ILoggerAdapter]
    },
    {
      provide: I${capitalizeFirstLetter(name)}UpdateAdapter,
      useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository, loggerService: ILoggerAdapter) => {
        return new ${capitalizeFirstLetter(name)}UpdateUsecase(${name}Repository, loggerService);
      },
      inject: [I${capitalizeFirstLetter(name)}Repository, ILoggerAdapter]
    },
    {
      provide: I${capitalizeFirstLetter(name)}ListAdapter,
      useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
        return new ${capitalizeFirstLetter(name)}ListUsecase(${name}Repository);
      },
      inject: [I${capitalizeFirstLetter(name)}Repository]
    },
    {
      provide: I${capitalizeFirstLetter(name)}DeleteAdapter,
      useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
        return new ${capitalizeFirstLetter(name)}DeleteUsecase(${name}Repository);
      },
      inject: [I${capitalizeFirstLetter(name)}Repository]
    },
    {
      provide: I${capitalizeFirstLetter(name)}GetByIDAdapter,
      useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
        return new ${capitalizeFirstLetter(name)}GetByIdUsecase(${name}Repository);
      },
      inject: [I${capitalizeFirstLetter(name)}Repository]
    }
  ],
  exports: [
    I${capitalizeFirstLetter(name)}Repository,
    I${capitalizeFirstLetter(name)}CreateAdapter,
    I${capitalizeFirstLetter(name)}UpdateAdapter,
    I${capitalizeFirstLetter(name)}ListAdapter,
    I${capitalizeFirstLetter(name)}DeleteAdapter,
    I${capitalizeFirstLetter(name)}GetByIDAdapter
  ]
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