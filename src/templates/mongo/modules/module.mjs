import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getModule = (name) => `import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, PaginateModel } from 'mongoose';

import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { CacheRedisModule } from '@/infra/cache/redis';
import { MongoConnectionName } from '@/infra/database';
import { ${dashToPascal(name)}, ${dashToPascal(name)}Document } from '@/infra/database/mongo/schemas/${name}';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

import {
  I${dashToPascal(name)}Create,
  I${dashToPascal(name)}Delete,
  I${dashToPascal(name)}GetById,
  I${dashToPascal(name)}List,
  I${dashToPascal(name)}Update
} from './interfaces';
import { ${dashToPascal(name)}Controller } from './controller';
import { ${dashToPascal(name)}Repository } from './repository';

@Module({
  imports: [TokenLibModule, LoggerModule, CacheRedisModule],
  controllers: [${dashToPascal(name)}Controller],
  providers: [
    {
      provide: I${dashToPascal(name)}Repository,
      useFactory: async (connection: Connection) => {
        const repository: MongoRepositoryModelSessionType<PaginateModel<${dashToPascal(name)}Document>> = new ${dashToPascal(name)}().repository(connection);

        repository.connection = connection;

        // use if you not want transaction
        // const repository = new ${dashToPascal(name)}().repository(connection);

        return new ${dashToPascal(name)}Repository(repository);
      },
      inject: [getConnectionToken(MongoConnectionName.MONGO)]
    },
    {
      provide: I${dashToPascal(name)}Create,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}CreateUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}Update,
      useFactory: (logger: ILoggerAdapter, repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}UpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}GetById,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}GetByIdUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}List,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}ListUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}Delete,
      useFactory: (repository: I${dashToPascal(name)}Repository) => new ${dashToPascal(name)}DeleteUsecase(repository),
      inject: [I${dashToPascal(name)}Repository]
    }
  ],
  exports: [
    I${dashToPascal(name)}Repository,
    I${dashToPascal(name)}Create,
    I${dashToPascal(name)}Update,
    I${dashToPascal(name)}GetById,
    I${dashToPascal(name)}List,
    I${dashToPascal(name)}Delete
  ]
})
export class ${dashToPascal(name)}Module {}
`

export {
  getModule
}