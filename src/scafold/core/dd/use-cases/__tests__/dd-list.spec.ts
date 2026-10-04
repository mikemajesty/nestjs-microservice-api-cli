import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { DdListInput, DdListOutput, DdListSchema, DdListUsecase } from '@/core/dd/use-cases/dd-list';
import { IDdList } from '@/modules/dd/interfaces';
import { TestUtils } from '@/utils/test/utils';
import { ZodExceptionIssue } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../../entity/dd';
import { IDdRepository } from '../../repository/dd';

describe(DdListUsecase.name, () => {
  let usecase: IDdList;
  let repository: IDdRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        TestUtils.mockProvider(IDdRepository),
        {
          provide: IDdList,
          useFactory: (ddRepository: IDdRepository) => {
            return new DdListUsecase(ddRepository);
          },
          inject: [IDdRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDdList);
    repository = app.get(IDdRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as DdListInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<DdListInput>('search')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(DdEntitySchema);
  const docs = mock.generateMany(2, {
    overrides: {
      deletedAt: null
    }
  });

  const input = new ZodMockSchema(DdListSchema).generate();
  test('when dds are found, should expect an user list', async () => {
    const output = { docs: docs as DdEntity[], page: 1, limit: 1, total: 1 };
    repository.paginate = TestUtils.mockResolvedValue<DdListOutput>(output);

    await expect(usecase.execute(input)).resolves.toEqual({
      docs: output.docs,
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when dds not found, should expect an empty list', async () => {
    const output = { docs: docs as DdEntity[], page: 1, limit: 1, total: 1 };
    repository.paginate = TestUtils.mockResolvedValue<DdListOutput>(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
