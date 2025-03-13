import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseGetByIdTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { I${dashToPascal(name)}GetByIdAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestMock } from 'test/mock';

import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}GetByIdInput, ${dashToPascal(name)}GetByIdUsecase } from '../${name}-get-by-id';
import { ${dashToPascal(name)}Entity } from './../../entity/${name}';

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
    await TestMock.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}GetByIdInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: TestMock.nameOf<${dashToPascal(name)}GetByIdInput>('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}GetByIdInput = {
    id: TestMock.getMockUUID()
  };

  test('when ${snakeToCamel(name)} not found, should expect an error', async () => {
    repository.findById = TestMock.mockResolvedValue<${dashToPascal(name)}Entity>(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${snakeToCamel(name)} = new ${dashToPascal(name)}Entity({
    id: TestMock.getMockUUID(),
    name: 'dummy'
  });

  test('when ${snakeToCamel(name)} found, should expect a ${snakeToCamel(name)}', async () => {
    repository.findById = TestMock.mockResolvedValue<${dashToPascal(name)}Entity>(${snakeToCamel(name)});

    await expect(usecase.execute(input)).resolves.toEqual(${snakeToCamel(name)});
  });
});
`

export {
  getCoreUsecaseGetByIdTest
}