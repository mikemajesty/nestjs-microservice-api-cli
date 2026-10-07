import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseUpdateTest = (name) => `import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { UpdatedModel } from '@/infra/repository';
import { I${dashToPascal(name)}Update } from '@/modules/${name}/interfaces';
import { ApiNotFoundException } from '@/utils/exception';
import { MockUtils, TestUtils } from '@/utils/test';
import { ZodExceptionIssue } from '@/utils/validator';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}UpdateInput, ${dashToPascal(name)}UpdateUsecase } from '../${name}-update';

describe(${dashToPascal(name)}UpdateUsecase.name, () => {
  let usecase: I${dashToPascal(name)}Update;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestUtils.mockProvider(I${dashToPascal(name)}Repository),
        {
          provide: I${dashToPascal(name)}Update,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository, logger: ILoggerAdapter) => {
            return new ${dashToPascal(name)}UpdateUsecase(${snakeToCamel(name)}Repository, logger);
          },
          inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}Update);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}UpdateInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<${dashToPascal(name)}UpdateInput>('id')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(${dashToPascal(name)}EntitySchema);
  const input = mock.generate({
    overrides: {
      updatedAt: null,
      createdAt: null,
      deletedAt: null
    },
    factory: (data) => new ${dashToPascal(name)}Entity(data)
  });

  test('when ${snakeToCamel(name)} not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<${dashToPascal(name)}Entity>(null);

    await expect(usecase.execute({ id: MockUtils.UUID() })).rejects.toThrow(ApiNotFoundException);
  });

  test('when ${snakeToCamel(name)} updated successfully, should expect a ${snakeToCamel(name)} updated', async () => {
    repository.findById = TestUtils.mockResolvedValueOnce<${dashToPascal(name)}Entity>(input.clone()).mockResolvedValue(input.clone());
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute({ id: MockUtils.UUID() })).resolves.toEqual(input.toData());
  });
});
`

export {
  getCoreUsecaseUpdateTest
}