const { dashToPascal } = require("../../../../../textUtils")

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { I${dashToPascal(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}UpdateInput, ${dashToPascal(name)}UpdateUsecase } from '../${name}-update';
import { ${dashToPascal(name)}Entity } from './../../entity/${name}';

describe(${dashToPascal(name)}UpdateUsecase.name, () => {
  let usecase: I${dashToPascal(name)}UpdateAdapter;
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
          provide: I${dashToPascal(name)}UpdateAdapter,
          useFactory: (${name}Repository: I${dashToPascal(name)}Repository, logger: ILoggerAdapter) => {
            return new ${dashToPascal(name)}UpdateUsecase(${name}Repository, logger);
          },
          inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}UpdateAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}UpdateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: ${dashToPascal(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}UpdateInput = {
    id: TestUtils.getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${name} = new ${dashToPascal(name)}Entity({
    id: TestUtils.getMockUUID(),
    name: 'dummy'
  });

  test('when ${name} updated successfully, should expect an ${name}', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name});
    repository.updateOne = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).resolves.toEqual(${name});
  });
});
`

module.exports = {
  getCoreUsecaseUpdateTest
}