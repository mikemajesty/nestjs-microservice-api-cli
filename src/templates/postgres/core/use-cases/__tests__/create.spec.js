
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseCreateTest = (name) => `import { Test } from '@nestjs/testing';

import { I${capitalizeFirstLetter(name)}CreateAdapter } from '@/modules/${name}/adapter';
import { expectZodError } from '@/utils/tests';

import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}CreateUsecase } from '../${name}-create';

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
          provide: I${capitalizeFirstLetter(name)}CreateAdapter,
          useFactory: (${name}Repository: I${capitalizeFirstLetter(name)}Repository) => {
            return new ${capitalizeFirstLetter(name)}CreateUsecase(${name}Repository);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository]
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

  test('should ${name} create successfully', async () => {
    const ${name} = { name: 'dummy' };
    repository.create = jest.fn().mockResolvedValue(${name});
    await expect(usecase.execute(${name})).resolves.toEqual(${name});
  });
});
`

module.exports = {
  getCoreUsecaseCreateTest
}