
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { ApiInternalServerException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput, ${capitalizeFirstLetter(name)}CreateUsecase } from '../${name}-create';

const successInput: ${capitalizeFirstLetter(name)}CreateInput = {
  name: 'name'
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
          useFactory: (birdRepository: I${capitalizeFirstLetter(name)}Repository, logger: ILoggerAdapter) => {
            return new ${capitalizeFirstLetter(name)}CreateUsecase(birdRepository, logger);
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

    repository.findOne = jest.fn().mockResolvedValue(null);
    repository.create = jest.fn().mockResolvedValue(createOutput);
    repository.startSession = jest.fn().mockResolvedValue({
      commitTransaction: jest.fn()
    });

    await expect(usecase.execute(successInput)).resolves.toEqual(createOutput);
  });

  test('when transaction throw an error, should expect an error', async () => {
    repository.findOne = jest.fn().mockResolvedValue(null);
    repository.create = jest.fn().mockRejectedValue(new ApiInternalServerException());
    repository.startSession = jest.fn().mockResolvedValue({
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn()
    });

    await expect(usecase.execute(successInput)).rejects.toThrow(ApiInternalServerException);
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}