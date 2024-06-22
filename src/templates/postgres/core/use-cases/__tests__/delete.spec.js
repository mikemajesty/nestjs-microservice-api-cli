
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDeleteTest = (name) => `import { Test } from '@nestjs/testing';

import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput, ${capitalizeFirstLetter(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { I${capitalizeFirstLetter(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, getMockUUID } from '@/utils/tests';

import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}Entity } from './../../entity/${name}';

describe(${capitalizeFirstLetter(name)}DeleteUsecase.name, () => {
  let usecase: I${capitalizeFirstLetter(name)}DeleteAdapter;
  let repository: I${capitalizeFirstLetter(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
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
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${capitalizeFirstLetter(name)}DeleteInput = {
    id: getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  test('when ${name} deleted successfully, should expect a ${name}', async () => {
    const findByIdOutput: ${capitalizeFirstLetter(name)}DeleteOutput = new ${capitalizeFirstLetter(name)}Entity({
      id: getMockUUID(),
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);
    repository.updateOne = jest.fn();

    await expect(usecase.execute(input)).resolves.toEqual({
      ...findByIdOutput,
      deletedAt: expect.any(Date)
    });
  });
});
`

module.exports = {
  getCoreUsecaseDeleteTest
}