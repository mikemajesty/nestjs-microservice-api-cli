import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { DdDeleteInput, DdDeleteUsecase } from '@/core/dd/use-cases/dd-delete';
import { LoggerModule } from '@/infra/logger';
import { UpdatedModel } from '@/infra/repository';
import { IDdDelete } from '@/modules/dd/interfaces';
import { ApiNotFoundException } from '@/utils/exception';
import { MockUtils, TestUtils } from '@/utils/test';
import { ZodExceptionIssue } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../../entity/dd';
import { IDdRepository } from '../../repository/dd';

describe(DdDeleteUsecase.name, () => {
  let usecase: IDdDelete;
  let repository: IDdRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestUtils.mockProvider(IDdRepository),
        {
          provide: IDdDelete,
          useFactory: (ddRepository: IDdRepository) => {
            return new DdDeleteUsecase(ddRepository);
          },
          inject: [IDdRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDdDelete);
    repository = app.get(IDdRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as DdDeleteInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<DdDeleteInput>('id')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(DdEntitySchema);
  const dd = mock.generate<DdEntity>();

  test('when dd not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(null);

    await expect(usecase.execute({ id: MockUtils.UUID() })).rejects.toThrow(ApiNotFoundException);
  });

  test('when dd deleted successfully, should expect a dd deleted', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(dd);
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute({ id: dd.id })).resolves.toEqual({
      ...dd,
      deletedAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });
});
