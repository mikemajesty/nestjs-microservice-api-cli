import { dashToPascal, snakeToCamel } from "../../../textUtils.mjs"

const getModule = (name) => `import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ConnectionName } from '@/infra/database/enum';
import { ${dashToPascal(name)}, ${dashToPascal(name)}Document, ${dashToPascal(name)}Schema } from '@/infra/database/mongo/schemas/${name}';
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
  imports: [TokenLibModule, LoggerModule, RedisCacheModule],
  controllers: [${dashToPascal(name)}Controller],
  providers: [
    {
      provide: I${dashToPascal(name)}Repository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<${dashToPascal(name)}Document>;

        //  use if you want transaction
        const repository: MongoRepositoryModelSessionType<PaginateModel<${dashToPascal(name)}Document>> = connection.model<
          ${dashToPascal(name)}Document,
          Model
        >(${dashToPascal(name)}.name, ${dashToPascal(name)}Schema as Schema);

        repository.connection = connection;

        // use if you not want transaction
        // const repository: PaginateModel<UserDocument> = connection.model<UserDocument, Model>(
        //   User.name,
        //   UserSchema as Schema
        // );

        return new ${dashToPascal(name)}Repository(repository);
      },
      inject: [getConnectionToken(ConnectionName.CATS)]
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