
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput, ${capitalizeFirstLetter(name)}CreateUsecase } from '../${name}-create';

const successInput: ${capitalizeFirstLetter(name)}CreateInput = {
  name: 'dummy'
};

const failureInput: ${capitalizeFirstLetter(name)}CreateInput = {};

describe('${capitalizeFirstLetter(name)}CreateUsecase', () => {
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
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameof('name') }]);
      }
    );
  });

  test('when ${name} created successfully, should expect a ${name} that has been created', async () => {
    const createOutput: ${capitalizeFirstLetter(name)}CreateOutput = { created: true, id: generateUUID() };

    repository.create = jest.fn().mockResolvedValue(createOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual(createOutput);
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}