import { IDdRepository } from '@/core/dd/repository/dd';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';
import { SchemaInfer } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../entity/dd';

export const DdDeleteSchema = DdEntitySchema.pick({
  id: true
});

export class DdDeleteUsecase implements IUsecase {
  constructor(private readonly ddRepository: IDdRepository) {}

  @ValidateSchema(DdDeleteSchema)
  async execute({ id }: DdDeleteInput): Promise<DdDeleteOutput> {
    const dd = await this.ddRepository.findById(id);

    if (!dd) {
      throw new ApiNotFoundException();
    }

    const entity = new DdEntity(dd);

    entity.deactivate();

    await this.ddRepository.updateOne({ id: entity.id }, entity.toObject());

    return entity.toObject();
  }
}

export type DdDeleteInput = SchemaInfer<typeof DdDeleteSchema>;
export type DdDeleteOutput = DdEntity;
