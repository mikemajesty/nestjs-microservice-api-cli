import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { CreatedModel } from '@/infra/repository';
import { IDdCreate } from '@/modules/dd/interfaces';
import { ApiInternalServerException } from '@/utils/exception';
import { TestUtils } from '@/utils/test/utils';
import { ZodExceptionIssue } from '@/utils/validator';

import { DdEntitySchema } from '../../entity/dd';
import { IDdRepository } from '../../repository/dd';
import { DdCreateInput, DdCreateUsecase } from '../dd-create';

describe(DdCreateUsecase.name, () => {
  let usecase: IDdCreate;
  let repository: IDdRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        TestUtils.mockProvider(IDdRepository),
        {
          provide: IDdCreate,
          useFactory: (ddRepository: IDdRepository) => {
            return new DdCreateUsecase(ddRepository);
          },
          inject: [IDdRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDdCreate);
    repository = app.get(IDdRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as DdCreateInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<DdCreateInput>('name')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(DdEntitySchema);
  const input = mock.generate();

  test('when dd created successfully, should expect a dd created', async () => {
    repository.create = TestUtils.mockResolvedValue<CreatedModel>(input);

    await expect(usecase.execute(input)).resolves.toEqual(input);
  });

  test('when transaction throw an error, should expect an error', async () => {
    repository.create = TestUtils.mockRejectedValue(new ApiInternalServerException());

    await expect(usecase.execute(input)).rejects.toThrow(ApiInternalServerException);
  });
});
