import { dashToPascal } from "../../../textUtils.mjs"

const getCoreEntity = (name) => `import { BaseEntity } from '@/utils/entity';;

import { Infer, InputValidator } from '@/utils/validator';

const ID = InputValidator.string().uuid();
const Name = InputValidator.string().min(1).max(200).trim();
const CreatedAt = InputValidator.date().nullish();
const UpdatedAt = InputValidator.date().nullish();
const DeletedAt = InputValidator.date().nullish();

export const ${dashToPascal(name)}EntitySchema = InputValidator.object({
  id: ID,
  name: Name,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type ${dashToPascal(name)} = Infer<typeof ${dashToPascal(name)}EntitySchema>;

export class ${dashToPascal(name)}Entity extends BaseEntity<${dashToPascal(name)}Entity>() {
  name!: string;

  constructor(entity: ${dashToPascal(name)}) {
    super(${dashToPascal(name)}EntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
`

export {
  getCoreEntity
}