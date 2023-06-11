
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests';

import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}UpdateUsecase } from '../${name}-update';
import { ${capitalizeFirstLetter(name)}Entity } from './../../entity/${name}';

const ${name}Response = {
  id: generateUUID(),
  name: 'dummy'
} as ${capitalizeFirstLetter(name)}Entity;

describe('${capitalizeFirstLetter(name)}UpdateUsecase', () => {
  let usecase: I${capitalizeFirstLetter(name)}UpdateAdapter;
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
          provide: I${capitalizeFirstLetter(name)}UpdateAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository, logger: ILoggerAdapter) => {
            return new ${capitalizeFirstLetter(name)}UpdateUsecase(${name}Repository, logger);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}UpdateAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('should throw error when invalid parameters', async () => {
    await expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: 'id' }]);
      }
    );
  });

  test('should throw error when ${name} not found', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: generateUUID() })).rejects.toThrowError(ApiNotFoundException);
  });

  test('should update successfully', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name}Response);
    repository.updateOne = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: generateUUID() })).resolves.toEqual(${name}Response);
  });
});
`

module.exports = {
  getCoreUsecaseUpdateTest
}