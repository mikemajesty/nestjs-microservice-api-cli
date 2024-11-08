const pluralize = require('pluralize')
const { dashToPascal } = require('../../../textUtils')


const getModuleSwagger = (name) => `import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { ${dashToPascal(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { Swagger } from '@/utils/docs/swagger';
import { TestUtils } from '@/utils/tests';

const input = new ${dashToPascal(name)}Entity({
  id: TestUtils.getMockUUID(),
  name: 'name'
});

const output = new ${dashToPascal(name)}Entity({ ...input, updatedAt: new Date(), createdAt: new Date(), deletedAt: null });

const BASE_URL = 'api/v1/${pluralize(name)}';

export const SwaggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON<${dashToPascal(name)}CreateOutput>({
      status: 200,
      json: { created: true, id: 'uuid' },
      description: '${name} created.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON<${dashToPascal(name)}UpdateOutput>({
      status: 200,
      json: output,
      description: '${name} updated.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  getById: {
    200: Swagger.defaultResponseJSON<${dashToPascal(name)}GetByIdOutput>({
      status: 200,
      json: output,
      description: '${name} found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON<${dashToPascal(name)}DeleteOutput>({
      status: 200,
      json: output,
      description: '${name} deleted.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON<${dashToPascal(name)}ListOutput>({
      status: 200,
      json: { docs: [output], page: 1, limit: 1, total: 1 },
      description: 'list ${pluralize(name)}.'
    })
  }
};

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON<${dashToPascal(name)}Entity>(input),
  updateBody: Swagger.defaultRequestJSON<${dashToPascal(name)}Entity>(input),
  listQuery: Swagger.defaultRequestListJSON()
};
`

module.exports = {
  getModuleSwagger
}