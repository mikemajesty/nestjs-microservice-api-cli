import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseDeleteTest = (name) => `import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { ${dashToPascal(name)}DeleteInput, ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { LoggerModule } from '@/infra/logger';
import { UpdatedModel } from '@/infra/repository';
import { I${dashToPascal(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/test/util';
import { ZodExceptionIssue } from '@/utils/validator';

import { ${dashToPascal(name)}Entity, ${dashToPascal(name)}EntitySchema } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';

describe(${dashToPascal(name)}DeleteUsecase.name, () => {
  let usecase: I${dashToPascal(name)}DeleteAdapter;
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
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}DeleteInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<${dashToPascal(name)}DeleteInput>('id')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(${dashToPascal(name)}EntitySchema);
  const ${snakeToCamel(name)} = mock.generate<${dashToPascal(name)}Entity>();

  test('when ${snakeToCamel(name)} not found, should expect an error', async () => {
    repository.findById = TestUtils.mockResolvedValue<${dashToPascal(name)}Entity>(null);

    await expect(usecase.execute({ id: TestUtils.getMockUUID() })).rejects.toThrow(ApiNotFoundException);
  });

  test('when ${snakeToCamel(name)} deleted successfully, should expect a ${snakeToCamel(name)} deleted', async () => {
    repository.findById = TestUtils.mockResolvedValue<${dashToPascal(name)}Entity>(${snakeToCamel(name)});
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();

    await expect(usecase.execute({ id: ${snakeToCamel(name)}.id })).resolves.toEqual({
      ...${snakeToCamel(name)},
      deletedAt: expect.any(Date)
    });
  });
});
`

export {
  getCoreUsecaseDeleteTest
}