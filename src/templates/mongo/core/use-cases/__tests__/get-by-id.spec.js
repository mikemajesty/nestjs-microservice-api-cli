
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseGetByIdTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { I${capitalizeFirstLetter(name)}GetByIdAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}GetByIdInput, ${capitalizeFirstLetter(name)}GetByIdUsecase } from '../${name}-get-by-id';

describe(${capitalizeFirstLetter(name)}GetByIdUsecase.name, () => {
  let usecase: I${capitalizeFirstLetter(name)}GetByIdAdapter;
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
          provide: I${capitalizeFirstLetter(name)}GetByIdAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
            return new ${capitalizeFirstLetter(name)}GetByIdUsecase(${name}Repository);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}GetByIdAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${capitalizeFirstLetter(name)}GetByIdInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${capitalizeFirstLetter(name)}GetByIdInput = {
    id: TestUtils.getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${name} = new ${capitalizeFirstLetter(name)}Entity({
    id: '61cc35f3-03d9-4b7f-9c63-59f32b013ef5',
    name: 'dummy'
  });

  test('when ${name} found, should expect a ${name}', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name});

    await expect(usecase.execute(input)).resolves.toEqual(${name});
  });
});
`

module.exports = {
  getCoreUsecaseGetByIdTest
}