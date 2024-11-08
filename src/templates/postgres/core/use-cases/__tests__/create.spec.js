const { dashToPascal, snakeToCamel } = require("../../../../../textUtils")

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { I${dashToPascal(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { TestUtils } from '@/utils/tests';

import { ${dashToPascal(name)}Entity } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}CreateInput, ${dashToPascal(name)}CreateOutput, ${dashToPascal(name)}CreateUsecase } from '../${name}-create';

describe(${dashToPascal(name)}CreateUsecase.name, () => {
  let usecase: I${dashToPascal(name)}CreateAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: ILoggerAdapter,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: I${dashToPascal(name)}CreateAdapter,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository, logger: ILoggerAdapter) => {
            return new ${dashToPascal(name)}CreateUsecase(${snakeToCamel(name)}Repository, logger);
          },
          inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}CreateAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}CreateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: ${dashToPascal(name)}Entity.nameOf('name') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}CreateInput = {
    name: 'dummy'
  };

  test('when ${snakeToCamel(name)} created successfully, should expect a ${snakeToCamel(name)}', async () => {
    const output: ${dashToPascal(name)}CreateOutput = { created: true, id: TestUtils.getMockUUID() };
    repository.create = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}