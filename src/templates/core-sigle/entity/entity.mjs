import { dashToPascal } from "../../../textUtils.mjs"

const getCoreSingleEntity = (name) => `import { BaseEntity } from '@/utils/domain';
import { InferSchema, Schema } from '@/utils/schema';

const ID = Schema.uuid();
const Name = Schema.string().trim().min(1).max(200);
const CreatedAt = Schema.date().nullish();
const UpdatedAt = Schema.date().nullish();
const DeletedAt = Schema.date().nullish();

export const ${dashToPascal(name)}EntitySchema = Schema.object({
  id: ID,
  name: Name,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type ${dashToPascal(name)} = InferSchema<typeof ${dashToPascal(name)}EntitySchema>;

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