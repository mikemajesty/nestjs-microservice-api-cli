const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const getModuleSwagger = (name) => `import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { ${capitalizeFirstLetter(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { Swagger } from '@/utils/docs/swagger';

const input = new ${capitalizeFirstLetter(name)}Entity({
  name: 'name'
});

const output = new ${capitalizeFirstLetter(name)}Entity({ ...input, updatedAt: new Date(), createdAt: new Date(), deletedAt: null });

const BASE_URL = 'api/v1/${pluralize(name)}';

export const SwaggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { created: true, id: 'uuid' } as ${capitalizeFirstLetter(name)}CreateOutput,
      description: 'create ${name}.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}UpdateOutput,
      description: 'update ${name}.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  getById: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}GetByIdOutput,
      description: 'get ${name}.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}DeleteOutput,
      description: 'delete ${name}.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL.concat('/:id'),
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { docs: [output], page: 1, limit: 1, total: 1 } as ${capitalizeFirstLetter(name)}ListOutput,
      description: 'list ${pluralize(name)}.'
    })
  }
};

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON({ ...input, id: undefined } as ${capitalizeFirstLetter(name)}Entity),
  updateBody: Swagger.defaultRequestJSON(input as ${capitalizeFirstLetter(name)}Entity),
  listQuery: Swagger.defaultRequestListJSON()
};
`

module.exports = {
  getModuleSwagger
}