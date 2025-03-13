import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { UpdatedModel } from '@/infra/repository';
import { I${dashToPascal(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestMock } from 'test/mock';

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
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository, logger: ILoggerAdapter) => {
            return new ${dashToPascal(name)}UpdateUsecase(${snakeToCamel(name)}Repository, logger);
          },
          inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}UpdateAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestMock.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}UpdateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: TestMock.nameOf<${dashToPascal(name)}UpdateInput>('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}UpdateInput = {
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

  test('when ${snakeToCamel(name)} updated successfully, should expect an ${snakeToCamel(name)}', async () => {
    repository.findById = TestMock.mockResolvedValue<${dashToPascal(name)}Entity>(${snakeToCamel(name)});
    repository.updateOne = TestMock.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute(input)).resolves.toEqual(${snakeToCamel(name)});
  });
});
`

export {
  getCoreUsecaseUpdateTest
}