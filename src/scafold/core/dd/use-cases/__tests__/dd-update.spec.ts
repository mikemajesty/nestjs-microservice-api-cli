import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { UpdatedModel } from '@/infra/repository';
import { IDdUpdate } from '@/modules/dd/interfaces';
import { ApiNotFoundException } from '@/utils/exception';
import { MockUtils, TestUtils } from '@/utils/test';
import { ZodExceptionIssue } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../../entity/dd';
import { IDdRepository } from '../../repository/dd';
import { DdUpdateInput, DdUpdateUsecase } from '../dd-update';

describe(DdUpdateUsecase.name, () => {
  let usecase: IDdUpdate;
  let repository: IDdRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestUtils.mockProvider(IDdRepository),
        {
          provide: IDdUpdate,
          useFactory: (ddRepository: IDdRepository, logger: ILoggerAdapter) => {
            return new DdUpdateUsecase(ddRepository, logger);
          },
          inject: [IDdRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDdUpdate);
    repository = app.get(IDdRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as DdUpdateInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<DdUpdateInput>('id')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(DdEntitySchema);
  const input = mock.generate<DdEntity>({
    overrides: {
      updatedAt: null,
      createdAt: null,
      deletedAt: null
    }
  });

  test('when dd not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(null);

    await expect(usecase.execute({ id: MockUtils.UUID() })).rejects.toThrow(ApiNotFoundException);
  });

  test('when dd updated successfully, should expect a dd updated', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(input);
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute({ id: MockUtils.UUID() })).resolves.toEqual(input);
  });
});
