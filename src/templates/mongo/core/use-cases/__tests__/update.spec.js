
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdateTest = (name) => `import { Test } from '@nestjs/testing';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { I${capitalizeFirstLetter(name)}UpdateAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, getMockUUID } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput } from '../${name}-update';
import { ${capitalizeFirstLetter(name)}UpdateUsecase } from '../${name}-update';

const successInput: ${capitalizeFirstLetter(name)}UpdateInput = {
  id: getMockUUID()
};

const failureInput: ${capitalizeFirstLetter(name)}UpdateInput = {};

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

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameOf('id') }]);
      }
    );
  });

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).rejects.toThrowError(ApiNotFoundException);
  });

  test('when ${name} updated successfully, should expect an ${name} that has been updated', async () => {
    const findByIdOutput: ${capitalizeFirstLetter(name)}UpdateOutput = new ${capitalizeFirstLetter(name)}Entity({
      id: getMockUUID(),
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);
    repository.updateOne = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).resolves.toEqual(findByIdOutput);
  });
});
`

module.exports = {
  getCoreUsecaseUpdateTest
}