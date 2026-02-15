import { dashToPascal, snakeToCamel } from "../../../../textUtils.mjs"

const getCoreUsecaseCreateTest = (name) => `import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { Test } from '@nestjs/testing';

import { CreatedModel } from '@/infra/repository';
import { I${dashToPascal(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { ApiInternalServerException } from '@/utils/exception';
import { TestUtils } from '@/utils/test/utils';
import { ZodExceptionIssue } from '@/utils/validator';

import { ${dashToPascal(name)}EntitySchema } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}CreateInput, ${dashToPascal(name)}CreateUsecase } from '../${name}-create';

describe(${dashToPascal(name)}CreateUsecase.name, () => {
  let usecase: I${dashToPascal(name)}CreateAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}CreateAdapter,
          useFactory: (${snakeToCamel(name)}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}CreateUsecase(${snakeToCamel(name)}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}CreateAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}CreateInput),
      (issues: ZodExceptionIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Invalid input: expected string, received undefined',
            path: TestUtils.nameOf<${dashToPascal(name)}CreateInput>('name')
          }
        ]);
      }
    );
  });

  const mock = new ZodMockSchema(${dashToPascal(name)}EntitySchema);
  const input = mock.generate();

  test('when ${snakeToCamel(name)} created successfully, should expect a ${snakeToCamel(name)} created', async () => {
    repository.create = TestUtils.mockResolvedValue<CreatedModel>(input);

    await expect(usecase.execute(input)).resolves.toEqual(input);
  });

  test('when transaction throw an error, should expect an error', async () => {
    repository.create = TestUtils.mockRejectedValue(new ApiInternalServerException());

    await expect(usecase.execute(input)).rejects.toThrow(ApiInternalServerException);
  });
});
`

export {
  getCoreUsecaseCreateTest
}