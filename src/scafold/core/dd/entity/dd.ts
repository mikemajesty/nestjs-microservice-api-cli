import { BaseEntity } from '@/utils/entity';
import { SchemaInfer, InputValidator } from '@/utils/validator';

const ID = InputValidator.uuid();
const Name = InputValidator.string().trim().min(1).max(200);
const CreatedAt = InputValidator.date().nullish();
const UpdatedAt = InputValidator.date().nullish();
const DeletedAt = InputValidator.date().nullish();

export const DdEntitySchema = InputValidator.object({
  id: ID,
  name: Name,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Dd = SchemaInfer<typeof DdEntitySchema>;

export class DdEntity extends BaseEntity<DdEntity>() {
  name!: Dd['name'];

  constructor(entity: Dd) {
    super(DdEntitySchema);
    this.validate(entity);
    this.ensureID();
  }
}
