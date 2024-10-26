
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateUsecase } from '../${name}-update';
import { ${capitalizeFirstLetter(name)}Entity } from './../../entity/${name}';

describe(${capitalizeFirstLetter(name)}UpdateUsecase.name, () => {
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

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${capitalizeFirstLetter(name)}UpdateInput = {
    id: TestUtils.getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${name} = new ${capitalizeFirstLetter(name)}Entity({
    id: TestUtils.getMockUUID(),
    name: 'dummy'
  });

  test('when ${name} updated successfully, should expect an ${name}', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name});
    repository.updateOne = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).resolves.toEqual(${name});
  });
});
`

module.exports = {
  getCoreUsecaseUpdateTest
}