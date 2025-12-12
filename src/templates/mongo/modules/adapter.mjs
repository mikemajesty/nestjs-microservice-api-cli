import { dashToPascal } from "../../../textUtils.mjs"

const getModuleAdapter = (name) => `import { ${dashToPascal(name)}CreateInput, ${dashToPascal(name)}CreateOutput } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteInput, ${dashToPascal(name)}DeleteOutput } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdInput, ${dashToPascal(name)}GetByIdOutput } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListInput, ${dashToPascal(name)}ListOutput } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateInput, ${dashToPascal(name)}UpdateOutput } from '@/core/${name}/use-cases/${name}-update';
import { IUsecase } from '@/utils/usecase';

export abstract class I${dashToPascal(name)}CreateAdapter implements IUsecase {
  abstract execute(input: ${dashToPascal(name)}CreateInput): Promise<${dashToPascal(name)}CreateOutput>;
}

export abstract class I${dashToPascal(name)}UpdateAdapter implements IUsecase {
  abstract execute(input: ${dashToPascal(name)}UpdateInput): Promise<${dashToPascal(name)}UpdateOutput>;
}

export abstract class I${dashToPascal(name)}GetByIdAdapter implements IUsecase {
  abstract execute(input: ${dashToPascal(name)}GetByIdInput): Promise<${dashToPascal(name)}GetByIdOutput>;
}

export abstract class I${dashToPascal(name)}ListAdapter implements IUsecase {
  abstract execute(input: ${dashToPascal(name)}ListInput): Promise<${dashToPascal(name)}ListOutput>;
}

export abstract class I${dashToPascal(name)}DeleteAdapter implements IUsecase {
  abstract execute(input: ${dashToPascal(name)}DeleteInput): Promise<${dashToPascal(name)}DeleteOutput>;
}
`

export {
  getModuleAdapter
}