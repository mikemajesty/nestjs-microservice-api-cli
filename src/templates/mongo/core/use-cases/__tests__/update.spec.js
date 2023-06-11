
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}UpdateInput } from '../${name}-update';
import { ${capitalizeFirstLetter(name)}UpdateUsecase } from '../${name}-update';

const ${name}Body = {
  id: generateUUID(),
  name: 'dummy'
} as ${capitalizeFirstLetter(name)}UpdateInput;

const ${name}Response = {
  id: generateUUID(),
  name: 'dummy'
} as ${capitalizeFirstLetter(name)}Entity;

describe('${capitalizeFirstLetter(name)}UpdateUsecase', () => {
  let usecase: I${capitalizeFirstLetter(name)}UpdateAdapter;
  let repository: I${capitalizeFirstLetter(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: I${capitalizeFirstLetter(name)}Repository,
          useValue: {}
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

  test('should update successfully', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name}Response);
    repository.updateOne = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute(${name}Body)).resolves.toEqual(${name}Response);
  });

  test('should throw error when ${name} not found', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute(${name}Body)).rejects.toThrowError(ApiNotFoundException);
  });
});
`

module.exports = {
  getCoreUsecaseUpdateTest
}