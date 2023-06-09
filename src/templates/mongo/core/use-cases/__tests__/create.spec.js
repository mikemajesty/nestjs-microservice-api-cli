
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { ApiInternalServerException } from '@/utils/exception';
import { expectZodError } from '@/utils/tests';

import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateUsecase } from '../${name}-create';

const ${name} = {
  name: 'dummy'
} as ${capitalizeFirstLetter(name)}CreateInput;

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

  test('should throw error when invalid parameters', async () => {
    await expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: 'name' }]);
      }
    );
  });

  test('should create successfully', async () => {
    repository.findOne = jest.fn().mockResolvedValue(null);
    repository.create = jest.fn().mockResolvedValue(${name});
    repository.startSession = jest.fn().mockResolvedValue({
      commitTransaction: jest.fn()
    });
    await expect(usecase.execute(${name})).resolves.toEqual(${name});
  });

  test('should throw error when create exception', async () => {
    repository.findOne = jest.fn().mockResolvedValue(null);
    repository.create = jest.fn().mockRejectedValue(new ApiInternalServerException('error'));
    repository.startSession = jest.fn().mockResolvedValue({
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn()
    });
    await expect(usecase.execute(${name})).rejects.toThrow(ApiInternalServerException);
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}