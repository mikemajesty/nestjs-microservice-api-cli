
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseListTest = (name) => `import { Test } from '@nestjs/testing';

import { I${capitalizeFirstLetter(name)}ListAdapter } from '@/modules/${name}/adapter';
import { expectZodError, getMockUUID } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput, ${capitalizeFirstLetter(name)}ListUsecase } from '../${name}-list';

const successInput: ${capitalizeFirstLetter(name)}ListInput = { limit: 1, page: 1, search: {}, sort: { createdAt: -1 } };

const failureInput: ${capitalizeFirstLetter(name)}ListInput = { search: null, sort: null, limit: 10, page: 1 };

describe('${capitalizeFirstLetter(name)}ListUsecase', () => {
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
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Expected object, received null', path: 'sort' }]);
      }
    );
  });

  test('when ${name} are found, should expect an ${name} list', async () => {
    const doc = new ${capitalizeFirstLetter(name)}Entity({
      id: getMockUUID(),
      name: 'dummy',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const paginateOutput: ${capitalizeFirstLetter(name)}ListOutput = { docs: [doc], page: 1, limit: 1, total: 1 };

    repository.paginate = jest.fn().mockResolvedValue(paginateOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual({
      docs: [doc],
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when ${name} not found, should expect an empty list', async () => {
    const paginateOutput: ${capitalizeFirstLetter(name)}ListOutput = { docs: [], page: 1, limit: 1, total: 1 };

    repository.paginate = jest.fn().mockResolvedValue(paginateOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual(paginateOutput);
  });
});
`

module.exports = {
  getCoreUsecaseListTest
}