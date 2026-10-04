import { DdEntitySchema } from '@/core/dd/entity/dd';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';
import { SchemaInfer } from '@/utils/validator';

import { DdEntity } from '../entity/dd';
import { IDdRepository } from '../repository/dd';

export const DdGetByIdSchema = DdEntitySchema.pick({
  id: true
});

export class DdGetByIdUsecase implements IUsecase {
  constructor(private readonly ddRepository: IDdRepository) {}

  @ValidateSchema(DdGetByIdSchema)
  async execute({ id }: DdGetByIdInput): Promise<DdGetByIdOutput> {
    const dd = await this.ddRepository.findById(id);

    if (!dd) {
      throw new ApiNotFoundException();
    }

    return new DdEntity(dd).toObject();
  }
}

export type DdGetByIdInput = SchemaInfer<typeof DdGetByIdSchema>;
export type DdGetByIdOutput = DdEntity;
