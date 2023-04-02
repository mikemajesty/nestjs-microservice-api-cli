
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseDeleteTest = (name) => `import { Test } from '@nestjs/testing';

import { I${capitalizeFirstLetter(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests';

import { ${capitalizeFirstLetter(name)}Entity, ${capitalizeFirstLetter(name)}Role } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}DeleteUsecase } from '../${name}-delete';

const ${name}Response = {
  id: generateUUID(),
  name: 'dummy'
} as ${capitalizeFirstLetter(name)}Entity;

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

  test('should throw error when invalid parameters', async () => {
    await expectZodError(
      () => usecase.execute({ id: 'uuid' }),
      (issues) => {
        expect(issues).toEqual([{ message: 'Invalid uuid', path: 'id' }]);
      }
    );
  });

  test('should throw error when ${name} not found', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: generateUUID() })).rejects.toThrowError(ApiNotFoundException);
  });

  test('should delete successfully', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name}Response);
    repository.updateOne = jest.fn();
    await expect(usecase.execute({ id: generateUUID() })).resolves.toEqual({
      ...${name}Response,
      deletedAt: expect.any(Date)
    });
  });
});
`

module.exports = {
  getCoreUsecaseDeleteTest
}