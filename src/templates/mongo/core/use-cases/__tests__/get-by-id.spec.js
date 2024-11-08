const { dashToPascal } = require("../../../../../textUtils")

const getCoreUsecaseGetByIdTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { I${dashToPascal(name)}GetByIdAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { ${dashToPascal(name)}Entity } from '../../entity/${name}';
import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}GetByIdInput, ${dashToPascal(name)}GetByIdUsecase } from '../${name}-get-by-id';

describe(${dashToPascal(name)}GetByIdUsecase.name, () => {
  let usecase: I${dashToPascal(name)}GetByIdAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}GetByIdAdapter,
          useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}GetByIdUsecase(${name}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}GetByIdAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}GetByIdInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: ${dashToPascal(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}GetByIdInput = {
    id: TestUtils.getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${name} = new ${dashToPascal(name)}Entity({
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