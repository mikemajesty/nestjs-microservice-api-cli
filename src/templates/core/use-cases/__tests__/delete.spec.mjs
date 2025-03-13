import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseDeleteTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ${dashToPascal(name)}DeleteInput, ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { UpdatedModel } from '@/infra/repository';
import { I${dashToPascal(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestMock } from 'test/mock';

import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}Entity } from './../../entity/${name}';

describe(${dashToPascal(name)}DeleteUsecase.name, () => {
  let usecase: I${dashToPascal(name)}DeleteAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}DeleteAdapter,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}DeleteUsecase(${snakeToCamel(name)}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}DeleteAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestMock.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}DeleteInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: TestMock.nameOf<${dashToPascal(name)}DeleteInput>('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}DeleteInput = {
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

  test('when ${snakeToCamel(name)} deleted successfully, should expect a ${snakeToCamel(name)}', async () => {
    repository.findById = TestMock.mockResolvedValue<${dashToPascal(name)}Entity>(${snakeToCamel(name)});
    repository.updateOne = TestMock.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute(input)).resolves.toEqual({
      ...${snakeToCamel(name)},
      deletedAt: expect.any(Date)
    });
  });
});
`

export {
  getCoreUsecaseDeleteTest
}