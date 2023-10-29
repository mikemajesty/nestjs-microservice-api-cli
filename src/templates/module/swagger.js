const getModuleSwaggerModule = (name) => `import { Swagger } from '@/utils/docs/swagger';

export const SwagggerResponse = {
  get: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: 'text',
      description: '${name} get.'
    })
  }
};

export const SwagggerRequest = {};
`

module.exports = {
  getModuleSwaggerModule
}