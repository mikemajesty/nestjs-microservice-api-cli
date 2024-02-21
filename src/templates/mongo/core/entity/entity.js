
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreEntity = (name) => `import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const ID = z.string().uuid();
const Name = z.string().min(1).max(200).trim();
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().default(null).nullish();

export const ${capitalizeFirstLetter(name)}EntitySchema = z.object({
  id: ID,
  name: Name,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type ${capitalizeFirstLetter(name)} = z.infer<typeof ${capitalizeFirstLetter(name)}EntitySchema>;

export class ${capitalizeFirstLetter(name)}Entity extends BaseEntity<${capitalizeFirstLetter(name)}Entity>() {
  name: string;

  constructor(entity: ${capitalizeFirstLetter(name)}) {
    super(${capitalizeFirstLetter(name)}EntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
`

module.exports = {
  getCoreEntity
}