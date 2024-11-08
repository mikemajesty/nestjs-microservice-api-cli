
const pluralize = require('pluralize')
const { dashToPascal } = require('../../../../../textUtils')

const getCoreUsecaseListTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { I${dashToPascal(name)}ListAdapter } from '@/modules/${name}/adapter';
import { TestUtils } from '@/utils/tests';

import { ${dashToPascal(name)}Entity } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput, ${dashToPascal(name)}ListUsecase } from '../${name}-list';

describe(${dashToPascal(name)}ListUsecase.name, () => {
  let usecase: I${dashToPascal(name)}ListAdapter;
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
          provide: I${dashToPascal(name)}ListAdapter,
          useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}ListUsecase(${name}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}ListAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when sort input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}ListInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: 'sort' },
          { message: 'Required', path: 'search' }
        ]);
      }
    );
  });

  const input: ${dashToPascal(name)}ListInput = { limit: 1, page: 1, search: {}, sort: { createdAt: -1 } };

  const ${name} = new ${dashToPascal(name)}Entity({
    id: TestUtils.getMockUUID(),
    name: 'dummy',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const ${pluralize(name)} = [${name}];

  test('when ${name} are found, should expect an ${name} list', async () => {
    const output: ${dashToPascal(name)}ListOutput = { docs: ${pluralize(name)}, page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute(input)).resolves.toEqual({
      docs: ${pluralize(name)},
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when ${name} not found, should expect an empty list', async () => {
    const output: ${dashToPascal(name)}ListOutput = { docs: [], page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
`

module.exports = {
  getCoreUsecaseListTest
}