
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDeleteTest = (name) => `import { Test } from '@nestjs/testing';

import { I${capitalizeFirstLetter(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput, ${capitalizeFirstLetter(name)}DeleteUsecase } from '../${name}-delete';

const successInput: ${capitalizeFirstLetter(name)}DeleteInput = {
  id: generateUUID()
};

const failureInput: ${capitalizeFirstLetter(name)}DeleteInput = {};

describe('${capitalizeFirstLetter(name)}DeleteUsecase', () => {
  let usecase: I${capitalizeFirstLetter(name)}DeleteAdapter;
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
          provide: I${capitalizeFirstLetter(name)}DeleteAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
            return new ${capitalizeFirstLetter(name)}DeleteUsecase(${name}Repository);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}DeleteAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameof('id') }]);
      }
    );
  });

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).rejects.toThrowError(ApiNotFoundException);
  });

  test('when ${name} deleted successfully, should expect a ${name} that has been deleted', async () => {
    const findByIdOutput: ${capitalizeFirstLetter(name)}DeleteOutput = new ${capitalizeFirstLetter(name)}Entity({
      id: generateUUID(),
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);
    repository.updateOne = jest.fn();

    await expect(usecase.execute(successInput)).resolves.toEqual({
      ...findByIdOutput,
      deletedAt: expect.any(Date)
    });
  });
});
`

module.exports = {
  getCoreUsecaseDeleteTest
}