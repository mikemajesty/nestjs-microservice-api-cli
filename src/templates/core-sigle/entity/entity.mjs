import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleEntity = (name) => `import { BaseEntity } from '@/utils/entity';
import { Infer, InputValidator } from '@/utils/validator';

const ID = InputValidator.uuid();
const Name = InputValidator.string().trim().min(1).max(200);
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
  name!: ${dashToPascal(name)}['name'];

  constructor(entity: ${dashToPascal(name)}) {
    super(${dashToPascal(name)}EntitySchema);
    this.validate(entity);
    this.ensureID();
  }
}
`

export {
  getCoreSingleEntity
}