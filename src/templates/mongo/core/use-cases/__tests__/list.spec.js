
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseListTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { I${capitalizeFirstLetter(name)}ListAdapter } from '@/modules/${name}/adapter';
import { TestUtils } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput, ${capitalizeFirstLetter(name)}ListUsecase } from '../${name}-list';

describe(${capitalizeFirstLetter(name)}ListUsecase.name, () => {
  let usecase: I${capitalizeFirstLetter(name)}ListAdapter;
  let repository: I${capitalizeFirstLetter(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: I${capitalizeFirstLetter(name)}Repository,
          useValue: {}
        },
        {
          provide: I${capitalizeFirstLetter(name)}ListAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
            return new ${capitalizeFirstLetter(name)}ListUsecase(${name}Repository);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}ListAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('when sort input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${capitalizeFirstLetter(name)}ListInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: 'sort' },
          { message: 'Required', path: 'search' }
        ]);
      }
    );
  });

  const input: ${capitalizeFirstLetter(name)}ListInput = { limit: 1, page: 1, search: {}, sort: { createdAt: -1 } };

  const ${name} = new ${capitalizeFirstLetter(name)}Entity({
    id: TestUtils.getMockUUID(),
    name: 'dummy',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const ${pluralize(name)} = [${name}];

  test('when ${name} are found, should expect an ${name} list', async () => {
    const output: ${capitalizeFirstLetter(name)}ListOutput = { docs: ${pluralize(name)}, page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute(input)).resolves.toEqual({
      docs: ${pluralize(name)},
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when ${name} not found, should expect an empty list', async () => {
    const output: ${capitalizeFirstLetter(name)}ListOutput = { docs: [], page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute(input)).resolves.toEqual(output);
  });
});
`

module.exports = {
  getCoreUsecaseListTest
}