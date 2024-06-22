const getModuleSwaggerModule = (name) => `import { Swagger } from '@/utils/docs/swagger';

export const SwaggerResponse = {
  get: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: 'text',
      description: 'get ${name}.'
    })
  }
};

export const SwaggerRequest = {};
`

module.exports = {
  getModuleSwaggerModule
}