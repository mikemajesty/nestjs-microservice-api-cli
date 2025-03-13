import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { I${dashToPascal(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { TestMock } from 'test/mock';

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
    await TestMock.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}CreateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: TestMock.nameOf<${dashToPascal(name)}CreateInput>('name') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}CreateInput = {
    name: 'dummy'
  };

  test('when ${snakeToCamel(name)} created successfully, should expect a ${snakeToCamel(name)}', async () => {
    const output: ${dashToPascal(name)}CreateOutput = { created: true, id: TestMock.getMockUUID() };
    repository.create = TestMock.mockResolvedValue<${dashToPascal(name)}CreateOutput>(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
`

export {
  getCoreUsecaseCreateTest
}