
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseGetByIDTest = (name) => `import { Test } from '@nestjs/testing';

import { I${capitalizeFirstLetter(name)}GetByIDAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';;

import { ${capitalizeFirstLetter(name)}Entity } from '../../entity/${name}';
import { I${capitalizeFirstLetter(name)}Repository } from '../../repository/${name}';
import { ${capitalizeFirstLetter(name)}GetByIDInput, ${capitalizeFirstLetter(name)}GetByIDOutput, ${capitalizeFirstLetter(name)}GetByIdUsecase } from '../${name}-getByID';

const successInput: ${capitalizeFirstLetter(name)}GetByIDInput = {
  id: generateUUID()
};

const failureInput: ${capitalizeFirstLetter(name)}GetByIDInput = {};


describe('${capitalizeFirstLetter(name)}GetByIdUsecase', () => {
  let usecase: I${capitalizeFirstLetter(name)}GetByIDAdapter;
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
          provide: I${capitalizeFirstLetter(name)}GetByIDAdapter,
          useFactory: (birdRepository: I${capitalizeFirstLetter(name)}Repository) => {
            return new ${capitalizeFirstLetter(name)}GetByIdUsecase(birdRepository);
          },
          inject: [I${capitalizeFirstLetter(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${capitalizeFirstLetter(name)}GetByIDAdapter);
    repository = app.get(I${capitalizeFirstLetter(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: ${capitalizeFirstLetter(name)}Entity.nameof("id") }]);
      }
    );
  });

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).rejects.toThrowError(ApiNotFoundException);
  });

  test('when ${name} found, should expect a ${name} that has been found', async () => {
    const findByIdOutput: ${capitalizeFirstLetter(name)}GetByIDOutput = new ${capitalizeFirstLetter(name)}Entity({
      id: '61cc35f3-03d9-4b7f-9c63-59f32b013ef5',
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual(findByIdOutput);
  });
});
`

module.exports = {
  getCoreUsecaseGetByIDTest
}