import pluralize from 'pluralize'
import { dashToPascal } from '../../../textUtils.mjs'

// postgres-backed CRUD module: TypeOrmModule.forFeature() wires the real repository through
// DI (TestPostgresContainer auto-loads scaffolded schemas/migrations), so no manual
// repository override is needed here, unlike the mongo e2e test.
const getModuleControllerE2ETest = (name) => `/**
 * @see https://github.com/mikemajesty/nestjs-microservice-boilerplate-api/blob/master/guides/modules/test.md
 */
import { ZodMockSchema } from '@mikemajesty/zod-mock-schema';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ${dashToPascal(name)}CreateOutput, ${dashToPascal(name)}CreateSchema } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { IPermissionRepository } from '@/core/permission/repository/permission';
import { IRoleRepository } from '@/core/role/repository/role';
import { IUserRepository } from '@/core/user/repository/user';
import { ICacheAdapter } from '@/infra/cache';
import { ITokenAdapter } from '@/libs/token';
import { GuardsModule } from '@/middlewares/guards/module';
import { UserRequest } from '@/utils/request';
import { TestUtils } from '@/utils/test';
import { TestPostgresContainer, TestRedisContainer } from '@/utils/test/e2e/containers';
import { PermissionFixture } from '@/utils/test/e2e/fixtures/permission';
import { RoleFixture } from '@/utils/test/e2e/fixtures/role';
import { UserFixture } from '@/utils/test/e2e/fixtures/user';
import { FixtureUtils } from '@/utils/test/e2e/fixtures/utils';
import { TestEnd2EndUtils } from '@/utils/test/e2e/utils';

import { ${dashToPascal(name)}Controller } from '../controller';
import { ${dashToPascal(name)}Module } from '../module';

describe(${dashToPascal(name)}Controller.name, () => {
  let app: INestApplication;
  let redisService: ICacheAdapter;

  let roleRepository: IRoleRepository;
  let permissionRepository: IPermissionRepository;
  let userRepository: IUserRepository;

  const redisContainer = new TestRedisContainer();
  const postgresContainer = new TestPostgresContainer();

  const userFixture = new UserFixture();
  const roleFixture = new RoleFixture();
  const permissionFixture = new PermissionFixture();

  beforeAll(async () => {
    const { postgresConfig } = await postgresContainer.getPostgres();
    redisService = await redisContainer.getTestRedis();

    const moduleRef = await Test.createTestingModule({
      imports: [${dashToPascal(name)}Module, GuardsModule, TestEnd2EndUtils.getPostgresModule(postgresContainer, postgresConfig)]
    })
      .overrideProvider(ITokenAdapter)
      .useValue({
        verify: TestUtils.mockResolvedValue<UserRequest>({
          name: userFixture.entity.name,
          email: userFixture.entity.email,
          id: userFixture.entity.id
        })
      })
      .overrideProvider(ICacheAdapter)
      .useValue(redisService)
      .compile();

    app = await TestEnd2EndUtils.createApp(moduleRef);
    permissionRepository = moduleRef.get<IPermissionRepository>(IPermissionRepository);
    roleRepository = moduleRef.get<IRoleRepository>(IRoleRepository);
    userRepository = moduleRef.get<IUserRepository>(IUserRepository);

    await userFixture.down(userRepository);
    await roleFixture.down(roleRepository);
    await permissionFixture.down(permissionRepository);

    FixtureUtils.addBaseSeeds(permissionFixture, roleFixture, userFixture);
  });

  afterEach(async () => {
    await userFixture.down(userRepository);
    await roleFixture.down(roleRepository);
    await permissionFixture.down(permissionRepository);
  });

  beforeEach(async () => {
    await permissionFixture.up(permissionRepository);
    await roleFixture.up(roleRepository);
    await userFixture.up(userRepository);
  });

  it(\`/GET /v1/${pluralize(name)}\`, async () => {
    const response = await request(app.getHttpServer())
      .get('/${pluralize(name)}')
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .expect(200);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}ListOutput>('docs'));
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}ListOutput>('limit'));
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}ListOutput>('page'));
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}ListOutput>('total'));
  });

  it('/POST /${pluralize(name)} should create a ${name}', async () => {
    const mock = new ZodMockSchema(${dashToPascal(name)}CreateSchema);
    const entity = mock.generate();
    const response = await request(app.getHttpServer())
      .post('/${pluralize(name)}')
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .send(entity)
      .expect(201);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}CreateOutput>('id'));
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}CreateOutput>('created'), true);
  });

  it('/GET /${pluralize(name)}/:id should get by id', async () => {
    const mock = new ZodMockSchema(${dashToPascal(name)}CreateSchema);
    const entity = mock.generate();
    const createRes = await request(app.getHttpServer())
      .post('/${pluralize(name)}')
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .send(entity)
      .expect(201);
    const id = createRes.body.id;

    const response = await request(app.getHttpServer())
      .get(\`/${pluralize(name)}/\${id}\`)
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .expect(200);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}GetByIdOutput>('id'), id);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}GetByIdOutput>('name'), entity.name);
  });

  it('/PUT /${pluralize(name)}/:id should update ${name}', async () => {
    const mock = new ZodMockSchema(${dashToPascal(name)}CreateSchema);
    const entity = mock.generate();
    const createRes = await request(app.getHttpServer())
      .post('/${pluralize(name)}')
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .send(entity)
      .expect(201);

    const id = createRes.body.id;
    const update = new ZodMockSchema(${dashToPascal(name)}CreateSchema).generate();

    const response = await request(app.getHttpServer())
      .put(\`/${pluralize(name)}/\${id}\`)
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .send(update)
      .expect(200);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}UpdateOutput>('id'), id);
    expect(response.body).toHaveProperty(TestUtils.nameOf<${dashToPascal(name)}UpdateOutput>('name'), update.name);
  });

  it('/DELETE /${pluralize(name)}/:id should delete ${name}', async () => {
    const mock = new ZodMockSchema(${dashToPascal(name)}CreateSchema);
    const entity = mock.generate();
    const createRes = await request(app.getHttpServer())
      .post('/${pluralize(name)}')
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER)
      .send(entity)
      .expect([200, 201]);

    const id = createRes.body.id;
    const response = await request(app.getHttpServer())
      .delete(\`/${pluralize(name)}/\${id}\`)
      .set(...TestEnd2EndUtils.AUTHORIZATION_HEADER);
    expect([200, 204]).toContain(response.status);
  });

  afterAll(async () => {
    await redisContainer.close();
    await postgresContainer.close();
    await app.close();
  });
});
`

export {
  getModuleControllerE2ETest
}
