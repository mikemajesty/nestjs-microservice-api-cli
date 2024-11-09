const { dashToPascal } = require("../../../textUtils")

const getCoreSingleEntity = (name) => `import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const ID = z.string().uuid();
const Name = z.string().min(1).max(200).trim();
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const ${dashToPascal(name)}EntitySchema = z.object({
  id: ID,
  name: Name,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type ${dashToPascal(name)} = z.infer<typeof ${dashToPascal(name)}EntitySchema>;

export class ${dashToPascal(name)}Entity extends BaseEntity<${dashToPascal(name)}Entity>(${dashToPascal(name)}EntitySchema) {
  name!: string;

  constructor(entity: ${dashToPascal(name)}) {
    super();
    Object.assign(this, this.validate(entity));
  }
}
`

module.exports = {
  getCoreSingleEntity
}