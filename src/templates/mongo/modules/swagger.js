const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const getModuleSwagger = (name) => `import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';
import { ${capitalizeFirstLetter(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIDOutput } from '@/core/${name}/use-cases/${name}-getByID';
import { ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { Swagger } from '@/utils/docs/swagger';

const input = new ${capitalizeFirstLetter(name)}Entity({
  name: '<name>'
});

const output = new ${capitalizeFirstLetter(name)}Entity({ ...input, updatedAt: new Date(), createdAt: new Date(), deletedAt: null });

export const SwagggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { created: true, id: '<uuid>' } as ${capitalizeFirstLetter(name)}CreateOutput,
      description: '${name} created.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}UpdateOutput,
      description: '${name} updated.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/${pluralize(name)}',
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  getByID: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}GetByIDOutput,
      description: '${name} found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/${pluralize(name)}/:id',
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as ${capitalizeFirstLetter(name)}DeleteOutput,
      description: '${name} found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/${pluralize(name)}/:id',
      message: '${name}NotFound',
      description: '${name} not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { docs: [output], page: 1, limit: 1, total: 1 } as ${capitalizeFirstLetter(name)}ListOutput,
      description: '${name} created.'
    })
  }
};

export const SwagggerRequest = {
  createBody: Swagger.defaultRequestJSON({ ...input, id: undefined } as ${capitalizeFirstLetter(name)}Entity),
  updateBody: Swagger.defaultRequestJSON({ ...input, id: '<id>' } as ${capitalizeFirstLetter(name)}Entity),
  listQuery: {
    pagination: {
      limit: Swagger.defaultApiQueryOptions({ example: 10, name: 'limit', required: false }),
      page: Swagger.defaultApiQueryOptions({ example: 1, name: 'page', required: false })
    },
    sort: Swagger.defaultApiQueryOptions({
      name: 'sort',
      required: false,
      description: '<b>createdAt:desc,name:asc'
    }),
    search: Swagger.defaultApiQueryOptions({
      name: 'search',
      required: false,
      description: '<b>name:miau'
    })
  }
};
`

module.exports = {
  getModuleSwagger
}