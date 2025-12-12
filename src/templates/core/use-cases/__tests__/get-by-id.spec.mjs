import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseGetByIdTest = (name) => `import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { I${dashToPascal(name)}GetByIdAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/test/util';
import { ZodExceptionIssue } from '@/utils/validator';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}GetByIdInput, ${dashToPascal(name)}GetByIdUsecase } from '../${name}-get-by-id';

describe(${dashToPascal(name)}GetByIdUsecase.name, () => {
  let usecase: I${dashToPascal(name)}GetByIdAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}GetByIdAdapter,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}GetByIdUsecase(${snakeToCamel(name)}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}GetByIdAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}GetByIdInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<${dashToPascal(name)}GetByIdInput>('id')
          }
        ]);
      }
    );
  });

  test('when ${snakeToCamel(name)} not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<${dashToPascal(name)}Entity>(null);

    await expect(usecase.execute({ id: TestUtils.getMockUUID() })).rejects.toThrow(ApiNotFoundException);
  });

  const mock = new ZodMockSchema(${dashToPascal(name)}EntitySchema);
  const ${snakeToCamel(name)} = mock.generate<${dashToPascal(name)}Entity>();

  test('when ${snakeToCamel(name)} found, should expect a ${snakeToCamel(name)} found', async () => {
    repository.findById = TestUtils.mockResolvedValue<${dashToPascal(name)}Entity>(${snakeToCamel(name)});

    await expect(usecase.execute({ id: ${snakeToCamel(name)}.id })).resolves.toEqual(${snakeToCamel(name)});
  });
});
`

export {
  getCoreUsecaseGetByIdTest
}