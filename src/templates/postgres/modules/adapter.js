
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleAdapter = (name) => `import { ${capitalizeFirstLetter(name)}CreateInput, ${capitalizeFirstLetter(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${capitalizeFirstLetter(name)}DeleteInput, ${capitalizeFirstLetter(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${capitalizeFirstLetter(name)}GetByIdInput, ${capitalizeFirstLetter(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${capitalizeFirstLetter(name)}ListInput, ${capitalizeFirstLetter(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { IUsecase } from '@/utils/usecase';

export abstract class I${capitalizeFirstLetter(name)}CreateAdapter implements IUsecase {
  abstract execute(input: ${capitalizeFirstLetter(name)}CreateInput): Promise<${capitalizeFirstLetter(name)}CreateOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}UpdateAdapter implements IUsecase {
  abstract execute(input: ${capitalizeFirstLetter(name)}UpdateInput): Promise<${capitalizeFirstLetter(name)}UpdateOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}GetByIdAdapter implements IUsecase {
  abstract execute(input: ${capitalizeFirstLetter(name)}GetByIdInput): Promise<${capitalizeFirstLetter(name)}GetByIdOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}ListAdapter implements IUsecase {
  abstract execute(input: ${capitalizeFirstLetter(name)}ListInput): Promise<${capitalizeFirstLetter(name)}ListOutput>;
}

export abstract class I${capitalizeFirstLetter(name)}DeleteAdapter implements IUsecase {
  abstract execute(input: ${capitalizeFirstLetter(name)}DeleteInput): Promise<${capitalizeFirstLetter(name)}DeleteOutput>;
}
`

module.exports = {
  getModuleAdapter
}