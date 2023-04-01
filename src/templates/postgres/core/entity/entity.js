
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreEntity = (name) => `import { z } from 'zod';

import { IEntity, withID } from '@/utils/entity';

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

export class ${capitalizeFirstLetter(name)}Entity implements IEntity {
  id: string;

  name: string;

  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;

  constructor(entity: ${capitalizeFirstLetter(name)}) {
    Object.assign(this, ${capitalizeFirstLetter(name)}EntitySchema.parse(withID(entity)));
  }

  setDelete() {
    this.deletedAt = new Date();
  }
}
`

module.exports = {
  getCoreEntity
}