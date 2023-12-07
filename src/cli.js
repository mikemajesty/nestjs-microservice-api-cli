import { getIndexInfra } from './templates/infra';
import { getAdapterInfra } from './templates/infra/adapter';
import { getModuleInfa } from './templates/infra/module';
import { getServiceInfra } from './templates/infra/service';
import { getIndexLib } from './templates/libs';
import { getAdapterLib } from './templates/libs/adapter';
import { getModuleLib } from './templates/libs/module';
import { getServiceLib } from './templates/libs/service';
import { getModuleControllerModule } from './templates/module/controller';
import { getModuleModule } from './templates/module/module';
import { getModuleSwaggerModule } from './templates/module/swagger';

const fs = require('fs');
const { bold, green, red } = require('colorette');
const fse = require('fs-extra');
const path = require('path');
const cliSelect = require('cli-select');
const prompt = require('prompt-sync')();

const { getCoreUsecaseCreateTest } = require('./templates/postgres/core/use-cases/__tests__/create.spec');
const { getCoreUsecaseUpdateTest } = require('./templates/postgres/core/use-cases/__tests__/update.spec');
const { getCoreUsecaseDeleteTest } = require('./templates/postgres/core/use-cases/__tests__/delete.spec');
const { getCoreUsecaseListTest } = require('./templates/postgres/core/use-cases/__tests__/list.spec');
const { getCoreUsecaseGetByIDTest } = require('./templates/postgres/core/use-cases/__tests__/getByID.spec');
const { getCoreUsecaseGetByID } = require('./templates/postgres/core/use-cases/getByID');
const { getCoreUsecaseList } = require('./templates/postgres/core/use-cases/list');
const { getCoreEntity } = require('./templates/postgres/core/entity/entity');
const { getCoreRepository } = require('./templates/postgres/core/repository/repository');
const { getCoreUsecaseCreate } = require('./templates/postgres/core/use-cases/create');
const { getCoreUsecaseDelete } = require('./templates/postgres/core/use-cases/delete');
const { getCoreUsecaseUpdate } = require('./templates/postgres/core/use-cases/update');

const { getModuleAdapter } = require('./templates/postgres/modules/adapter');
const { getModuleController } = require('./templates/postgres/modules/controller');
const { getModule } = require('./templates/postgres/modules/module');
const { getModuleRepository } = require('./templates/postgres/modules/repository');
const { getModuleSchema } = require('./templates/postgres/schemas/schema');
const { getModuleSwagger } = require('./templates/postgres/modules/swagger');

const { getCoreUsecaseCreateTest: getCoreUsecaseCreateMongoTest } = require('./templates/mongo/core/use-cases/__tests__/create.spec');
const { getCoreUsecaseUpdateTest: getCoreUsecaseUpdateMongoTest } = require('./templates/mongo/core/use-cases/__tests__/update.spec');
const { getCoreUsecaseDeleteTest: getCoreUsecaseDeleteMongoTest } = require('./templates/mongo/core/use-cases/__tests__/delete.spec');
const { getCoreUsecaseListTest: getCoreUsecaseListMongoTest } = require('./templates/mongo/core/use-cases/__tests__/list.spec');
const { getCoreUsecaseGetByIDTest: getCoreUsecaseGetByIDMongoTest } = require('./templates/mongo/core/use-cases/__tests__/getByID.spec');
const { getCoreUsecaseGetByID: getCoreUsecaseGetByIDMongo } = require('./templates/mongo/core/use-cases/getByID');
const { getCoreUsecaseList: getCoreUsecaseListMongo } = require('./templates/mongo/core/use-cases/list');
const { getCoreEntity: getCoreEntityMongo } = require('./templates/mongo/core/entity/entity');
const { getCoreRepository: getCoreRepositoryMongo } = require('./templates/mongo/core/repository/repository');
const { getCoreUsecaseCreate: getCoreUsecaseCreateMongo } = require('./templates/mongo/core/use-cases/create');
const { getCoreUsecaseDelete: getCoreUsecaseDeleteMongo } = require('./templates/mongo/core/use-cases/delete');
const { getCoreUsecaseUpdate: getCoreUsecaseUpdateMongo } = require('./templates/mongo/core/use-cases/update');

const { getModuleAdapter: getModuleAdapterMongo } = require('./templates/mongo/modules/adapter');
const { getModuleController: getModuleControllerMongo } = require('./templates/mongo/modules/controller');
const { getModule: getModuleMongo } = require('./templates/mongo/modules/module');
const { getModuleRepository: getModuleRepositoryMongo } = require('./templates/mongo/modules/repository');
const { getModuleSchema: getModuleSchemaMongo } = require('./templates/mongo/schemas/schema');
const { getModuleSwagger: getModuleSwaggerMongo } = require('./templates/mongo/modules/swagger');

const createModule = async (name) => { 
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()
  const dirRoot = `${__dirname}/scafold/module/${name}`

  console.log("dirRoot", dirRoot)
  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/controller.ts`, getModuleControllerModule(name))
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleModule(name))
    fs.writeFileSync(`${dirRoot}/swagger.ts`, getModuleSwaggerModule(name))

    return `${name}`
  } catch (error) {
    console.log('errorCreateModule', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }
}

const createInfra = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()
  const dirRoot = `${__dirname}/scafold/infra/${name}`

  console.log("dirRoot", dirRoot)
  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/adapter.ts`, getAdapterInfra(name))
    fs.writeFileSync(`${dirRoot}/index.ts`, getIndexInfra(name))
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleInfa(name))
    fs.writeFileSync(`${dirRoot}/service.ts`, getServiceInfra(name))

    return `${name}`
  } catch (error) {
    console.log('errorCreateInfra', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }
 }

const createLib = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()
  const dirRoot = `${__dirname}/scafold/libs/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/adapter.ts`, getAdapterLib(name))
    fs.writeFileSync(`${dirRoot}/index.ts`, getIndexLib(name))
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleLib(name))
    fs.writeFileSync(`${dirRoot}/service.ts`, getServiceLib(name))

    return `${name}`
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }
}

const createPostgresCrud = async (name) => {
  name = getName(name);

  const dirRoot = `${__dirname}/scafold/postgres/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.mkdirSync(`${dirRoot}/modules`)

    fs.mkdirSync(`${dirRoot}/core`)

    const dirCore = `${dirRoot}/core/${name}`;
    fs.mkdirSync(dirCore)

    const entityPath = `${dirCore}/entity`;
    const repositoryPath = `${dirCore}/repository`;
    const useCasesPath = `${dirCore}/use-cases`;

    fs.mkdirSync(entityPath)
    fs.mkdirSync(repositoryPath)
    fs.mkdirSync(useCasesPath)

    fs.writeFileSync(`${entityPath}/${name}.ts`, getCoreEntity(name))
    fs.writeFileSync(`${repositoryPath}/${name}.ts`, getCoreRepository(name))


    fs.writeFileSync(`${useCasesPath}/${name}-create.ts`, getCoreUsecaseCreate(name))
    fs.writeFileSync(`${useCasesPath}/${name}-delete.ts`, getCoreUsecaseDelete(name))
    fs.writeFileSync(`${useCasesPath}/${name}-getByID.ts`, getCoreUsecaseGetByID(name))
    fs.writeFileSync(`${useCasesPath}/${name}-list.ts`, getCoreUsecaseList(name))
    fs.writeFileSync(`${useCasesPath}/${name}-update.ts`, getCoreUsecaseUpdate(name))

    const useCasesPathTest = `${useCasesPath}/__tests__`
    fs.mkdirSync(useCasesPathTest)
    fs.writeFileSync(`${useCasesPathTest}/${name}-create.spec.ts`, getCoreUsecaseCreateTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-update.spec.ts`, getCoreUsecaseUpdateTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-delete.spec.ts`, getCoreUsecaseDeleteTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-list.spec.ts`, getCoreUsecaseListTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-getByID.spec.ts`, getCoreUsecaseGetByIDTest(name))

    const schemasPath = `${__dirname}/scafold/postgres/schemas`;
    if (fs.existsSync(schemasPath)) {
      fs.rmSync(schemasPath, { recursive: true });
    }
    fs.mkdirSync(schemasPath)
    fs.writeFileSync(`${schemasPath}/${name}.ts`, getModuleSchema(name))

    const modulesPath = `${dirRoot}/modules/${name}`;
    fs.mkdirSync(modulesPath)
    fs.writeFileSync(`${modulesPath}/adapter.ts`, getModuleAdapter(name))
    fs.writeFileSync(`${modulesPath}/controller.ts`, getModuleController(name))
    fs.writeFileSync(`${modulesPath}/module.ts`, getModule(name))
    fs.writeFileSync(`${modulesPath}/repository.ts`, getModuleRepository(name))
    fs.writeFileSync(`${modulesPath}/swagger.ts`, getModuleSwagger(name))

    return `${name}`
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }

}

const createMongoCrud = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()

  const dirRoot = `${__dirname}/scafold/mongo/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.mkdirSync(`${dirRoot}/modules`)

    fs.mkdirSync(`${dirRoot}/core`)

    const dirCore = `${dirRoot}/core/${name}`;
    fs.mkdirSync(dirCore)

    const entityPath = `${dirCore}/entity`;
    const repositoryPath = `${dirCore}/repository`;
    const useCasesPath = `${dirCore}/use-cases`;

    fs.mkdirSync(entityPath)
    fs.mkdirSync(repositoryPath)
    fs.mkdirSync(useCasesPath)

    fs.writeFileSync(`${entityPath}/${name}.ts`, getCoreEntityMongo(name))
    fs.writeFileSync(`${repositoryPath}/${name}.ts`, getCoreRepositoryMongo(name))


    fs.writeFileSync(`${useCasesPath}/${name}-create.ts`, getCoreUsecaseCreateMongo(name))
    fs.writeFileSync(`${useCasesPath}/${name}-delete.ts`, getCoreUsecaseDeleteMongo(name))
    fs.writeFileSync(`${useCasesPath}/${name}-getByID.ts`, getCoreUsecaseGetByIDMongo(name))
    fs.writeFileSync(`${useCasesPath}/${name}-list.ts`, getCoreUsecaseListMongo(name))
    fs.writeFileSync(`${useCasesPath}/${name}-update.ts`, getCoreUsecaseUpdateMongo(name))

    const useCasesPathTest = `${useCasesPath}/__tests__`
    fs.mkdirSync(useCasesPathTest)

    fs.writeFileSync(`${useCasesPathTest}/${name}-create.spec.ts`, getCoreUsecaseCreateMongoTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-update.spec.ts`, getCoreUsecaseUpdateMongoTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-delete.spec.ts`, getCoreUsecaseDeleteMongoTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-list.spec.ts`, getCoreUsecaseListMongoTest(name))
    fs.writeFileSync(`${useCasesPathTest}/${name}-getByID.spec.ts`, getCoreUsecaseGetByIDMongoTest(name))

    const schemasPath = `${__dirname}/scafold/mongo/schemas`;

    if (fs.existsSync(schemasPath)) {
      fs.rmSync(schemasPath, { recursive: true });
    }

    fs.mkdirSync(schemasPath)
    fs.writeFileSync(`${schemasPath}/${name}.ts`, getModuleSchemaMongo(name))

    const modulesPath = `${dirRoot}/modules/${name}`;
    fs.mkdirSync(modulesPath)

    fs.writeFileSync(`${modulesPath}/adapter.ts`, getModuleAdapterMongo(name))
    fs.writeFileSync(`${modulesPath}/controller.ts`, getModuleControllerMongo(name))
    fs.writeFileSync(`${modulesPath}/module.ts`, getModuleMongo(name))
    fs.writeFileSync(`${modulesPath}/repository.ts`, getModuleRepositoryMongo(name))
    fs.writeFileSync(`${modulesPath}/swagger.ts`, getModuleSwaggerMongo(name))

    return `${name}`
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }

}

export const parseArgumentsInoOptions = async (input) => {
  return {
    mongoCrud: input.type === 'mongo:crud' ? await createMongoCrud(input.name) : false,
    postgresCrud: input.type === 'postgres:crud' ? await createPostgresCrud(input.name) : false,
    libCreate: input.type === 'lib' ? await createLib(input.name) : false,
    infraCreate: input.type === 'infra' ? await createInfra(input.name) : false,
    moduleCreate: input.type === 'module' ? await createModule(input.name) : false,
  }
}

export async function cli(args) {

  console.log(bold(green('Selecting template...')))
  const cli = await cliSelect({
    values: [bold('POTGRES:CRUD'), bold('MONGO:CRUD'), bold('LIB'), bold('INFRA'), bold('MODULE')],
    valueRenderer: (value, selected) => {
      if (selected) {
        return value;
      }

      return value;
    },
  })

  const mapSelectType = { 0: 'postgres:crud', 1: 'mongo:crud', 2: "lib", 3: "infra", 4: "module" }[cli.id]
  const userInput = { name: undefined, type: undefined }

  userInput.type = mapSelectType

  if (!userInput.type) {
    console.log(red('Type is required'))
    return
  }

  const name = prompt(bold(`Type your ${userInput.type.toUpperCase()} name: `));

  if (!name) {
    console.log(red('Name is required'))
    return
  }

  userInput.name = name

  const options = await parseArgumentsInoOptions(userInput)

  const paths = []

  for (const key in options) {
    if (options[key]) {
      if (userInput.type === 'postgres:crud') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/postgres/`, options[key]))
      }

      if (userInput.type === 'mongo:crud') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/mongo/`, options[key]))
      }

      if (userInput.type === 'lib') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/libs/`, options[key]))
      }

      if (userInput.type === 'infra') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/infra/`, options[key]))
      }

      if (userInput.type === 'module') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/module/`, options[key]))
      }
    }
  }

  try {

    const dest = path.resolve(`${__dirname}/../../../../`)

    const src = paths[0]

    // VALIDATE 
    fs.readdir(dest.replace('\n', '') + '/src', function (err, folders) {
      if (err) {
        if (fs.existsSync(src)) {
          fs.rmSync(src, { recursive: true });
        }
        console.error(err.message)
        return
      }

      for (const folder of ['core', 'modules']) {
        const source = folders.find(f => f === folder)
        if (!source) {
          console.log(bold(red('error')))
          console.error('select nestjs microservice api root')
          return
        }
      }
    });


    // CREATE CRUD
    fs.readdir(src, function (err, folders) {
      if (err) {
        if (fs.existsSync(src)) {
          fs.rmSync(src, { recursive: true });
        }
        console.error(err.message)
        return
      }

      for (const folder of folders) {

        if (userInput.type === 'infra') { 
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/infra/${options.infraCreate}/${folder}`.replace('\n', '');
          fse.copySync(source, destination, { overwrite: true });
          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }
          continue
        }

        if (userInput.type === 'module') { 
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/modules/${options.moduleCreate}/${folder}`.replace('\n', '');
          fse.copySync(source, destination, { overwrite: true });
          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }
          continue
        }

        if (userInput.type === 'lib') {
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/libs/${options.libCreate}/${folder}`.replace('\n', '');
          fse.copySync(source, destination, { overwrite: true });
          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }
          continue
        }

        if (userInput.type === 'postgres:crud' || userInput.type === 'mongo:crud') {
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/${folder}`.replace('\n', '');

          fse.copySync(source, destination, { overwrite: true });

          const destPathSchema = `${dest}/src/infra/database/${userInput.type === 'postgres:crud' ? 'postgres' : 'mongo'}/schemas`;

          const pathSchema = path.resolve(src, '../schemas');

          fse.copySync(pathSchema, destPathSchema, { overwrite: true });

          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }

          if (fs.existsSync(pathSchema + `/${name}.ts`)) {
            fs.rmSync(pathSchema + `/${name}.ts`, { recursive: true });
          }

        }
      }

      console.log(bold(green('===done===')))

      if (userInput.type === 'postgres:crud') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), green(bold('https://github.com/mikemajesty/nestjs-microservice-api-cli/blob/main/potgres.README.md')))
      }

      if (userInput.type === 'mongo:crud') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), green(bold('https://github.com/mikemajesty/nestjs-microservice-api-cli/blob/main/mongo.README.md')))
      }

      if (userInput.type === 'lib') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), green(bold('https://github.com/mikemajesty/nestjs-microservice-api-cli/blob/main/lib.README.md')))
      }

      if (userInput.type === 'infra') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), green(bold('https://github.com/mikemajesty/nestjs-microservice-api-cli/blob/main/infra.README.md')))
      }
      
      if (userInput.type === 'module') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), green(bold('https://github.com/mikemajesty/nestjs-microservice-api-cli/blob/main/module.README.md')))
      }
    });

  } catch (error) {
    console.log(error)
    if (fs.existsSync(paths[0])) {
      fs.rmSync(paths[0], { recursive: true });
    }
  }
}

const getName = (name) => {
  if (!name) throw new Error('--name is required');
  name = String(name).trim().replace(" ", "").toLowerCase();
  return name;
}