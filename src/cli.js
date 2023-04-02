import fs from 'fs';
import { bold, green, red } from 'colorette';
const fse = require('fs-extra');
import path from 'path';
const { exec } = require('child_process');
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
const { getModuleSchema } = require('./templates/postgres/modules/schema');
const { getModuleSwagger } = require('./templates/postgres/modules/swagger');
const { getModuleType } = require('./templates/postgres/modules/types');


const createPostgresCrud = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()

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

    const modulesPath = `${dirRoot}/modules/${name}`;
    fs.mkdirSync(modulesPath)

    fs.writeFileSync(`${modulesPath}/adapter.ts`, getModuleAdapter(name))
    fs.writeFileSync(`${modulesPath}/controller.ts`, getModuleController(name))
    fs.writeFileSync(`${modulesPath}/module.ts`, getModule(name))
    fs.writeFileSync(`${modulesPath}/repository.ts`, getModuleRepository(name))
    fs.writeFileSync(`${modulesPath}/schema.ts`, getModuleSchema(name))
    fs.writeFileSync(`${modulesPath}/swagger.ts`, getModuleSwagger(name))
    fs.writeFileSync(`${modulesPath}/types.ts`, getModuleType(name))

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
    module: input.type === 'module' ? await createMonorepoModule(input.name) : false,
    test: input.type === 'test' ? await createMonorepoTest(input.name) : false,
    postgresCrud: input.type === 'postgres:crud' ? await createPostgresCrud(input.name) : false
  }
}

export async function cli(args) {

  console.log(bold(green('Selecting template...')))
  const cli = await cliSelect({
    values: [bold('POTGRES:CRUD'), bold('MODULE'), bold('TEST')],
    valueRenderer: (value, selected) => {
      if (selected) {
        return value;
      }

      return value;
    },
  })

  const mapSelectType = { 0: 'postgres:crud', 1: 'module', 2: 'test' }[cli.id]
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
      paths.push(path.resolve(`${__dirname}/../src/scafold/${userInput.type === 'postgres:crud' ? 'postgres' : 'mongo'}/`, options[key]))
    }
  }

  try {

    exec('zenity --file-selection --directory --title="Choose your path" --filename=$HOME/', async (err, dest) => {
      const src = paths[0]

      if (err) {
        if (fs.existsSync(src)) {
          fs.rmSync(src, { recursive: true });
        }
        console.error(err.message)
        return
      }

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
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/${folder}`.replace('\n', '');

          fse.copySync(source, destination, { overwrite: true });

          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }
        }
      });


      // console.log(bold(green('done')))

      // if (userInput.type === 'api') {
      //   console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), bold('https://github.com/mikemajesty/microservice-crud/blob/master/APP.md'))
      // }
    });

  } catch (error) {
    console.log(error)
    if (fs.existsSync(paths[0])) {
      fs.rmSync(paths[0], { recursive: true });
    }
  }
}