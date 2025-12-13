import { getCoreSingleUsecaseCreate } from './templates/core-sigle/use-cases/usecase.mjs';
import { getCoreSingleRepository } from './templates/core-sigle/repository/repository.mjs';
import { getCoreSingleEntity } from './templates/core-sigle/entity/entity.mjs';
import { getIndexInfra } from './templates/infra/index.mjs';
import infraAdapter from './templates/infra/adapter.mjs';
const { getAdapterInfra } = infraAdapter;
import { getModuleInfa } from './templates/infra/module.mjs';
import { getServiceInfra } from './templates/infra/service.mjs';
import { getIndexLib } from './templates/libs/index.mjs';
import { getAdapterLib } from './templates/libs/adapter.mjs';
import { getModuleLib } from './templates/libs/module.mjs';
import { getServiceLib } from './templates/libs/service.mjs';
import { getModuleControllerModule } from './templates/module/controller.mjs';
import { getModuleModule } from './templates/module/module.mjs';
import { getTypeSpecController } from './templates/typespec/controller.mjs';
import { getTypeSpecModel } from './templates/typespec/model.mjs';
import { getTypeSpecException } from './templates/typespec/exception.mjs';

import fs from 'fs';
import { bold, green, red, cyan, yellow, magenta, gray, blue, white } from 'colorette';
import fse from 'fs-extra';
import path from 'path';
import cliSelect from 'cli-select';
import promptSync from 'prompt-sync';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prompt = promptSync();

// Created files tracker
const createdFiles = [];

const trackFile = (filePath, category) => {
  createdFiles.push({ path: filePath, category });
};

const getFileIcon = (fileName) => {
  if (fileName.endsWith('.spec.ts')) return '🧪';
  if (fileName.includes('entity')) return '📦';
  if (fileName.includes('repository')) return '🗄️';
  if (fileName.includes('use-cases') || fileName.includes('usecase')) return '⚡';
  if (fileName.includes('controller')) return '🎮';
  if (fileName.includes('module')) return '📦';
  if (fileName.includes('adapter')) return '🔌';
  if (fileName.includes('schema')) return '📋';
  if (fileName.includes('service')) return '⚙️';
  if (fileName.includes('.tsp')) return '📝';
  if (fileName.includes('index')) return '📤';
  return '📄';
};

const printCreatedFiles = (moduleName, moduleType) => {
  console.log('');
  console.log('');
  console.log(bold(cyan('  ╭───────────────────────────────────────────────────────────╮')));
  console.log(bold(cyan('  │                                                           │')));
  console.log(bold(cyan('  │')) + bold(green('       🚀 ')) + bold(white(moduleType.toUpperCase() + ' CREATED SUCCESSFULLY!'))  + bold(cyan('              │')));
  console.log(bold(cyan('  │                                                           │')));
  console.log(bold(cyan('  ╰───────────────────────────────────────────────────────────╯')));
  console.log('');
  console.log(bold(white('  📋 Module: ')) + bold(yellow(moduleName)));
  console.log('');
  
  const categories = {};
  createdFiles.forEach(file => {
    if (!categories[file.category]) categories[file.category] = [];
    categories[file.category].push(file.path);
  });
  
  const categoryConfig = {
    'core/entity': { icon: '📦', label: 'Entity', color: magenta },
    'core/repository': { icon: '🗄️ ', label: 'Repository', color: blue },
    'core/use-cases': { icon: '⚡', label: 'Use Cases', color: yellow },
    'core/tests': { icon: '🧪', label: 'Tests', color: green },
    'modules': { icon: '🎮', label: 'Module Files', color: cyan },
    'schemas': { icon: '📋', label: 'Database Schema', color: magenta },
    'typespec': { icon: '📝', label: 'TypeSpec Docs', color: blue },
    'libs': { icon: '📚', label: 'Library Files', color: yellow },
    'infra': { icon: '🔧', label: 'Infrastructure', color: cyan },
  };
  
  // Define display order
  const categoryOrder = [
    'core/entity', 'core/repository', 'core/use-cases', 'core/tests',
    'modules', 'schemas', 'typespec', 'libs', 'infra'
  ];
  
  const sortedCategories = categoryOrder.filter(cat => categories[cat]);
  
  sortedCategories.forEach((category, catIndex) => {
    const config = categoryConfig[category] || { icon: '📁', label: category, color: white };
    const isLastCategory = catIndex === sortedCategories.length - 1;
    const catPrefix = isLastCategory ? '  └─' : '  ├─';
    
    console.log(gray(catPrefix) + ' ' + bold(config.color(`${config.icon} ${config.label}`)));
    
    categories[category].forEach((file, index) => {
      const isLast = index === categories[category].length - 1;
      const linePrefix = isLastCategory ? '     ' : '  │  ';
      const filePrefix = isLast ? '└──' : '├──';
      const fileName = file.split('/').pop();
      const icon = getFileIcon(fileName);
      console.log(gray(`${linePrefix}${filePrefix}`) + ` ${icon} ` + white(fileName));
    });
  });
  
  const totalFiles = createdFiles.length;
  console.log('');
  console.log(bold(cyan('  ─────────────────────────────────────────────────────────────')));
  console.log('');
  console.log(bold(green(`  ✨ ${totalFiles} file${totalFiles > 1 ? 's' : ''} created successfully!`)));
  console.log('');
  console.log(gray('  💡 Next steps:'));
  console.log(gray('     1. ') + cyan('npm run build') + gray(' - Compile the project'));
  console.log(gray('     2. ') + cyan('npm run lint') + gray('  - Check code style'));
  console.log(gray('     3. ') + cyan('npm test') + gray('       - Run tests'));
  console.log('');
  
  // Clear for next run
  createdFiles.length = 0;
};

// Function to add module to app.module.ts, libs/module.ts or infra/module.ts
const addModuleToAppModule = (dest, moduleName, importPath, targetFile = 'app.module.ts', moduleSuffix = 'Module') => {
  try {
    const moduleFilePath = `${dest}/src/${targetFile}`;
    let content = fs.readFileSync(moduleFilePath, 'utf-8');
    
    const pascalName = moduleName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const moduleClassName = `${pascalName}${moduleSuffix}`;
    const importStatement = `import { ${moduleClassName} } from '${importPath}'`;
    
    // Check if import already exists
    if (content.includes(importStatement)) {
      console.log(bold(green(`${moduleClassName} already imported`)));
      return;
    }
    
    // Find the last import from @/modules/
    const lastModuleImportRegex = /import\s+{[^}]+}\s+from\s+'@\/modules\/[^']+'/g;
    const matches = [...content.matchAll(lastModuleImportRegex)];
    
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const insertPosition = lastMatch.index + lastMatch[0].length;
      content = content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
    } else {
      // If no module imports found, add after the first import block
      const firstImportEnd = content.indexOf('\n\n');
      if (firstImportEnd !== -1) {
        content = content.slice(0, firstImportEnd) + '\n' + importStatement + content.slice(firstImportEnd);
      }
    }
    
    // Add module to imports array
    const importsArrayRegex = /imports:\s*\[([^\]]*)\]/s;
    const match = content.match(importsArrayRegex);
    
    if (match) {
      const importsContent = match[1];
      
      // Check if module already in imports
      if (importsContent.includes(moduleClassName)) {
        console.log(bold(green(`${moduleClassName} already in imports array`)));
        return;
      }
      
      // Find the position before the closing bracket, after the last module
      const modules = importsContent.trim().split(',').map(m => m.trim()).filter(m => m);
      const lastModule = modules[modules.length - 1];
      
      // Add the new module
      const updatedImports = importsContent.replace(
        lastModule,
        `${lastModule},\n    ${moduleClassName}`
      );
      
      content = content.replace(importsArrayRegex, `imports: [${updatedImports}]`);
    }
    
    fs.writeFileSync(moduleFilePath, content, 'utf-8');
    console.log(bold(green(`✓ ${moduleClassName} added to ${targetFile}`)));
  } catch (error) {
    console.log(bold(red(`Error adding module to ${targetFile}: ${error.message}`)));
  }
};

const createTypeSpecDocs = (dest, moduleName) => {
  try {
    const docsPath = `${dest}/docs/src/modules/${moduleName}`;
    const mainTspPath = `${dest}/docs/src/main.tsp`;
    
    if (!fs.existsSync(`${dest}/docs/src`)) {
      console.log(bold(green(`TypeSpec docs folder not found, skipping...`)));
      return;
    }
    
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }
    
    fs.writeFileSync(`${docsPath}/controller.tsp`, getTypeSpecController(moduleName));
    trackFile(`docs/src/modules/${moduleName}/controller.tsp`, 'typespec');
    fs.writeFileSync(`${docsPath}/model.tsp`, getTypeSpecModel(moduleName));
    trackFile(`docs/src/modules/${moduleName}/model.tsp`, 'typespec');
    fs.writeFileSync(`${docsPath}/exception.tsp`, getTypeSpecException(moduleName));
    trackFile(`docs/src/modules/${moduleName}/exception.tsp`, 'typespec');
    
    if (fs.existsSync(mainTspPath)) {
      let mainContent = fs.readFileSync(mainTspPath, 'utf-8');
      const importStatement = `import "./modules/${moduleName}/controller.tsp";`;
      
      if (!mainContent.includes(importStatement)) {
        const lastImportRegex = /import "\.\/modules\/[^"]+\/controller\.tsp";/g;
        const matches = [...mainContent.matchAll(lastImportRegex)];
        
        if (matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const insertPosition = lastMatch.index + lastMatch[0].length;
          mainContent = mainContent.slice(0, insertPosition) + '\n' + importStatement + mainContent.slice(insertPosition);
          fs.writeFileSync(mainTspPath, mainContent, 'utf-8');
        }
      }
    }
    
    console.log(bold(green(`✓ TypeSpec documentation created at docs/src/modules/${moduleName}/`)));
  } catch (error) {
    console.log(bold(red(`Error creating TypeSpec docs: ${error.message}`)));
  }
};

import { getCoreUsecaseCreateTest } from './templates/core/use-cases/__tests__/create.spec.mjs';
import { getCoreUsecaseUpdateTest } from './templates/core/use-cases/__tests__/update.spec.mjs';
import { getCoreUsecaseDeleteTest } from './templates/core/use-cases/__tests__/delete.spec.mjs';
import { getCoreUsecaseListTest } from './templates/core/use-cases/__tests__/list.spec.mjs';
import { getCoreUsecaseGetByIdTest } from './templates/core/use-cases/__tests__/get-by-id.spec.mjs';
import { getCoreUsecaseGetById } from './templates/core/use-cases/get-by-id.mjs';
import { getCoreUsecaseList } from './templates/core/use-cases/list.mjs';
import { getCoreEntity } from './templates/core/entity/entity.mjs';
import { getCoreRepository } from './templates/core/repository/repository.mjs';
import { getCoreUsecaseCreate } from './templates/core/use-cases/create.mjs';
import { getCoreUsecaseDelete } from './templates/core/use-cases/delete.mjs';
import { getCoreUsecaseUpdate } from './templates/core/use-cases/update.mjs';

import { getModuleAdapter } from './templates/postgres/modules/adapter.mjs';
import { getModuleController } from './templates/postgres/modules/controller.mjs';
import { getModule } from './templates/postgres/modules/module.mjs';
import { getModuleRepository } from './templates/postgres/modules/repository.mjs';
import { getModuleSchema } from './templates/postgres/schemas/schema.mjs';

import { getModuleAdapter as getModuleAdapterMongo } from './templates/mongo/modules/adapter.mjs';
import { getModuleController as getModuleControllerMongo } from './templates/mongo/modules/controller.mjs';
import { getModule as getModuleMongo } from './templates/mongo/modules/module.mjs';
import { getModuleRepository as getModuleRepositoryMongo } from './templates/mongo/modules/repository.mjs';
import { getModuleSchema as getModuleSchemaMongo } from './templates/mongo/schemas/schema.mjs';

const createModule = async (name) => {
  if (!name) throw new Error('--name is required')
  name = getName(name)
  const dirRoot = `${__dirname}/scafold/module/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/controller.ts`, getModuleControllerModule(name))
    trackFile(`modules/${name}/controller.ts`, 'modules');
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleModule(name))
    trackFile(`modules/${name}/module.ts`, 'modules');

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
  name = getName(name)
  const dirRoot = `${__dirname}/scafold/infra/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/adapter.ts`, getAdapterInfra(name))
    trackFile(`infra/${name}/adapter.ts`, 'infra');
    fs.writeFileSync(`${dirRoot}/index.ts`, getIndexInfra(name))
    trackFile(`infra/${name}/index.ts`, 'infra');
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleInfa(name))
    trackFile(`infra/${name}/module.ts`, 'infra');
    fs.writeFileSync(`${dirRoot}/service.ts`, getServiceInfra(name))
    trackFile(`infra/${name}/service.ts`, 'infra');

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
  name = getName(name)
  const dirRoot = `${__dirname}/scafold/libs/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.writeFileSync(`${dirRoot}/adapter.ts`, getAdapterLib(name))
    trackFile(`libs/${name}/adapter.ts`, 'libs');
    fs.writeFileSync(`${dirRoot}/index.ts`, getIndexLib(name))
    trackFile(`libs/${name}/index.ts`, 'libs');
    fs.writeFileSync(`${dirRoot}/module.ts`, getModuleLib(name))
    trackFile(`libs/${name}/module.ts`, 'libs');
    fs.writeFileSync(`${dirRoot}/service.ts`, getServiceLib(name))
    trackFile(`libs/${name}/service.ts`, 'libs');

    return `${name}`
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }
}

const createCore = async (name) => {
  name = getName(name);

  const dirRoot = `${__dirname}/scafold/core/${name}`

  try {

    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    const dirCore = dirRoot;
    fs.mkdirSync(dirCore)

    const entityPath = `${dirCore}/entity`;
    const repositoryPath = `${dirCore}/repository`;
    const useCasesPath = `${dirCore}/use-cases`;

    fs.mkdirSync(entityPath)
    fs.mkdirSync(repositoryPath)
    fs.mkdirSync(useCasesPath)

    fs.writeFileSync(`${entityPath}/${name}.ts`, getCoreEntity(name))
    trackFile(`${entityPath}/${name}.ts`, 'core/entity');
    
    fs.writeFileSync(`${repositoryPath}/${name}.ts`, getCoreRepository(name))
    trackFile(`${repositoryPath}/${name}.ts`, 'core/repository');

    fs.writeFileSync(`${useCasesPath}/${name}-create.ts`, getCoreUsecaseCreate(name))
    trackFile(`${useCasesPath}/${name}-create.ts`, 'core/use-cases');
    fs.writeFileSync(`${useCasesPath}/${name}-delete.ts`, getCoreUsecaseDelete(name))
    trackFile(`${useCasesPath}/${name}-delete.ts`, 'core/use-cases');
    fs.writeFileSync(`${useCasesPath}/${name}-get-by-id.ts`, getCoreUsecaseGetById(name))
    trackFile(`${useCasesPath}/${name}-get-by-id.ts`, 'core/use-cases');
    fs.writeFileSync(`${useCasesPath}/${name}-list.ts`, getCoreUsecaseList(name))
    trackFile(`${useCasesPath}/${name}-list.ts`, 'core/use-cases');
    fs.writeFileSync(`${useCasesPath}/${name}-update.ts`, getCoreUsecaseUpdate(name))
    trackFile(`${useCasesPath}/${name}-update.ts`, 'core/use-cases');

    const useCasesPathTest = `${useCasesPath}/__tests__`
    fs.mkdirSync(useCasesPathTest)
    fs.writeFileSync(`${useCasesPathTest}/${name}-create.spec.ts`, getCoreUsecaseCreateTest(name))
    trackFile(`${useCasesPathTest}/${name}-create.spec.ts`, 'core/tests');
    fs.writeFileSync(`${useCasesPathTest}/${name}-update.spec.ts`, getCoreUsecaseUpdateTest(name))
    trackFile(`${useCasesPathTest}/${name}-update.spec.ts`, 'core/tests');
    fs.writeFileSync(`${useCasesPathTest}/${name}-delete.spec.ts`, getCoreUsecaseDeleteTest(name))
    trackFile(`${useCasesPathTest}/${name}-delete.spec.ts`, 'core/tests');
    fs.writeFileSync(`${useCasesPathTest}/${name}-list.spec.ts`, getCoreUsecaseListTest(name))
    trackFile(`${useCasesPathTest}/${name}-list.spec.ts`, 'core/tests');
    fs.writeFileSync(`${useCasesPathTest}/${name}-get-by-id.spec.ts`, getCoreUsecaseGetByIdTest(name))
    trackFile(`${useCasesPathTest}/${name}-get-by-id.spec.ts`, 'core/tests');
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }
    return `${name}`
  }
}

const createCoreSingle = async (name) => {
  name = getName(name);
  const dirRoot = `${__dirname}/scafold/core-single/${name}`
  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    const usecasePath = `${dirRoot}/use-cases`

    fs.mkdirSync(usecasePath)

    fs.writeFileSync(`${usecasePath}/${name}-rename.ts`, getCoreSingleUsecaseCreate(name))

    const repositoryPath = `${dirRoot}/repository`

    fs.mkdirSync(repositoryPath)

    fs.writeFileSync(`${repositoryPath}/${name}.ts`, getCoreSingleRepository(name))

    const entityPath = `${dirRoot}/entity`

    fs.mkdirSync(entityPath)

    fs.writeFileSync(`${entityPath}/${name}.ts`, getCoreSingleEntity(name))

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

    const schemasPath = `${__dirname}/scafold/postgres/schemas`;
    if (fs.existsSync(schemasPath)) {
      fs.rmSync(schemasPath, { recursive: true });
    }
    fs.mkdirSync(schemasPath)
    fs.writeFileSync(`${schemasPath}/${name}.ts`, getModuleSchema(name))
    trackFile(`schemas/${name}.ts`, 'schemas');

    const modulesPath = `${dirRoot}/modules/${name}`;
    fs.mkdirSync(modulesPath)
    fs.writeFileSync(`${modulesPath}/adapter.ts`, getModuleAdapter(name))
    trackFile(`modules/${name}/adapter.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/controller.ts`, getModuleController(name))
    trackFile(`modules/${name}/controller.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/module.ts`, getModule(name))
    trackFile(`modules/${name}/module.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/repository.ts`, getModuleRepository(name))
    trackFile(`modules/${name}/repository.ts`, 'modules');

    await createCore(name)

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
  name = getName(name)

  const dirRoot = `${__dirname}/scafold/mongo/${name}`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)

    fs.mkdirSync(`${dirRoot}/modules`)

    const schemasPath = `${__dirname}/scafold/mongo/schemas`;

    if (fs.existsSync(schemasPath)) {
      fs.rmSync(schemasPath, { recursive: true });
    }

    fs.mkdirSync(schemasPath)
    fs.writeFileSync(`${schemasPath}/${name}.ts`, getModuleSchemaMongo(name))
    trackFile(`schemas/${name}.ts`, 'schemas');

    const modulesPath = `${dirRoot}/modules/${name}`;
    fs.mkdirSync(modulesPath)

    fs.writeFileSync(`${modulesPath}/adapter.ts`, getModuleAdapterMongo(name))
    trackFile(`modules/${name}/adapter.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/controller.ts`, getModuleControllerMongo(name))
    trackFile(`modules/${name}/controller.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/module.ts`, getModuleMongo(name))
    trackFile(`modules/${name}/module.ts`, 'modules');
    fs.writeFileSync(`${modulesPath}/repository.ts`, getModuleRepositoryMongo(name))
    trackFile(`modules/${name}/repository.ts`, 'modules');

    await createCore(name)

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
    coreCreate: input.type === 'core' ? await createCoreSingle(input.name) : false,
  }
}

export async function cli(args) {

  console.log(bold(green('Selecting template...')))
  const cli = await cliSelect({
    values: [bold('POSTGRES:CRUD'), bold('MONGO:CRUD'), bold('LIB'), bold('INFRA'), bold('MODULE'), bold('CORE')],
    valueRenderer: (value, selected) => {
      if (selected) {
        return value;
      }

      return value;
    },
  })

  const mapSelectType = { 0: 'postgres:crud', 1: 'mongo:crud', 2: "lib", 3: "infra", 4: "module", 5: "core" }[cli.id]
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

  userInput.name = name.replace("_", "-").replace(" ", "-")

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

      if (userInput.type === 'core') {
        paths.push(path.resolve(`${__dirname}/../src/scafold/core-single/`, options[key]))
      }
    }
  }

  try {

    // DESTINATION PATH
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

    if (!src) {
      throw new Error('project destiny not found')
    }

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

        if (userInput.type === 'core') {
          const source = `${src}/${folder}`;
          const destination = `${dest}/src/core/${options.coreCreate}/${folder}`.replace('\n', '');
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

          const pathDest = `${dest}/src/core/${name}`;
          const pathCore = path.resolve(src, '../../core');

          const namePathCore = pathCore + `/${name}`;
          fse.copySync(namePathCore, pathDest, { overwrite: true });

          fse.copySync(pathSchema, destPathSchema, { overwrite: true });

          if (fs.existsSync(source)) {
            fs.rmSync(source, { recursive: true });
          }

          const namePathSchema = pathSchema + `/${name}.ts`;
          if (fs.existsSync(namePathSchema)) {
            fs.rmSync(namePathSchema, { recursive: true });
          }

          if (fs.existsSync(namePathCore)) {
            fs.rmSync(namePathCore, { recursive: true });
          }

        }
      }

      // Add module to the appropriate module file
      if (userInput.type === 'postgres:crud' || userInput.type === 'mongo:crud') {
        addModuleToAppModule(dest, name, `@/modules/${name}/module`, 'app.module.ts', 'Module');
        createTypeSpecDocs(dest, name);
      } else if (userInput.type === 'module') {
        addModuleToAppModule(dest, name, `@/modules/${name}/module`, 'app.module.ts', 'Module');
      } else if (userInput.type === 'lib') {
        addModuleToAppModule(dest, name, `./${name}`, 'libs/module.ts', 'LibModule');
      } else if (userInput.type === 'infra') {
        addModuleToAppModule(dest, name, `./${name}`, 'infra/module.ts', 'Module');
      }

      printCreatedFiles(name, userInput.type);
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
  
  name = String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!name) {
    throw new Error('Invalid name: contains only special characters');
  }
  
  if (/^\d/.test(name)) {
    throw new Error('Invalid name: cannot start with a number');
  }
  
  return name;
}