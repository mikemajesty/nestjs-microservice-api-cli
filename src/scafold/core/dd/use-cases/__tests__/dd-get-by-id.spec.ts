import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { IDdGetById } from '@/modules/dd/interfaces';
import { ApiNotFoundException } from '@/utils/exception';
import { MockUtils, TestUtils } from '@/utils/test';
import { ZodExceptionIssue } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../../entity/dd';
import { IDdRepository } from '../../repository/dd';
import { DdGetByIdInput, DdGetByIdUsecase } from '../dd-get-by-id';

describe(DdGetByIdUsecase.name, () => {
  let usecase: IDdGetById;
  let repository: IDdRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        TestUtils.mockProvider(IDdRepository),
        {
          provide: IDdGetById,
          useFactory: (ddRepository: IDdRepository) => {
            return new DdGetByIdUsecase(ddRepository);
          },
          inject: [IDdRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDdGetById);
    repository = app.get(IDdRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as DdGetByIdInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<DdGetByIdInput>('id')
          }
        ]);
      }
    );
  });

  test('when dd not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(null);

    await expect(usecase.execute({ id: MockUtils.UUID() })).rejects.toThrow(ApiNotFoundException);
  });

  const mock = new ZodMockSchema(DdEntitySchema);
  const dd = mock.generate<DdEntity>();

  test('when dd found, should expect a dd found', async () => {
    repository.findById = TestUtils.mockResolvedValue<DdEntity>(dd);

    await expect(usecase.execute({ id: dd.id })).resolves.toEqual(dd);
  });
});
