
import pluralize from 'pluralize'
import { dashToPascal, snakeToCamel } from '../../../../textUtils.mjs'

const getCoreUsecaseListTest = (name) => `import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput, ${dashToPascal(name)}ListSchema, ${dashToPascal(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { I${dashToPascal(name)}ListAdapter } from '@/modules/${name}/adapter';
import { TestUtils } from '@/utils/test/utils';
import { ZodExceptionIssue } from '@/utils/validator';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';

describe(${dashToPascal(name)}ListUsecase.name, () => {
  let usecase: I${dashToPascal(name)}ListAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}ListAdapter,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}ListUsecase(${snakeToCamel(name)}Repository);
          },
          inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}ListAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}ListInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<${dashToPascal(name)}ListInput>('search')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(${dashToPascal(name)}EntitySchema);
  const docs = mock.generateMany(2, {
    overrides: {
      deletedAt: null
    }
  });

  const input = new ZodMockSchema(${dashToPascal(name)}ListSchema).generate();
  test('when ${pluralize(snakeToCamel(name))} are found, should expect an user list', async () => {
    const output = { docs: docs as ${dashToPascal(name)}Entity[], page: 1, limit: 1, total: 1 };
    repository.paginate = TestUtils.mockResolvedValue<${dashToPascal(name)}ListOutput>(output);

    await expect(usecase.execute(input)).resolves.toEqual({
      docs: output.docs,
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when ${pluralize(snakeToCamel(name))} not found, should expect an empty list', async () => {
    const output = { docs: docs as ${dashToPascal(name)}Entity[], page: 1, limit: 1, total: 1 };
    repository.paginate = TestUtils.mockResolvedValue<${dashToPascal(name)}ListOutput>(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
`

export {
  getCoreUsecaseListTest
}