
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { expectZodError, getMockUUID } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput, ${capitalizeFirstLetter(name)}CreateUsecase } from '../${name}-create';

describe(${capitalizeFirstLetter(name)}CreateUsecase.name, () => {
  let usecase: I${capitalizeFirstLetter(name)}CreateAdapter;
  let repository: I${capitalizeFirstLetter(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: I${capitalizeFirstLetter(name)}Repository,
          useValue: {}
        },
        {
          provide: ILoggerAdapter,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: I${capitalizeFirstLetter(name)}CreateAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository, logger: ILoggerAdapter) => {
            return new ${capitalizeFirstLetter(name)}CreateUsecase(${name}Repository, logger);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}CreateAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameOf('name') }]);
      }
    );
  });

  const input: ${capitalizeFirstLetter(name)}CreateInput = {
    name: 'name'
  };

  test('when ${name} created successfully, should expect a ${name}', async () => {
    const createOutput: ${capitalizeFirstLetter(name)}CreateOutput = { created: true, id: getMockUUID() };

    repository.findOne = jest.fn().mockResolvedValue(null);
    repository.create = jest.fn().mockResolvedValue(createOutput);

    await expect(usecase.execute(input)).resolves.toEqual(createOutput);
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}