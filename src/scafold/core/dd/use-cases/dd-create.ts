import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { IDGeneratorUtils } from '@/utils/id-generator';
import { IUsecase } from '@/utils/usecase';
import { SchemaInfer } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../entity/dd';
import { IDdRepository } from '../repository/dd';

export const DdCreateSchema = DdEntitySchema.pick({
  name: true
});

export class DdCreateUsecase implements IUsecase {
  constructor(private readonly ddRepository: IDdRepository) {}

  @ValidateSchema(DdCreateSchema)
  async execute(input: DdCreateInput): Promise<DdCreateOutput> {
    const entity = new DdEntity({ id: IDGeneratorUtils.uuid(), ...input });

    const created = await this.ddRepository.create(entity.toObject());

    return created;
  }
}

export type DdCreateInput = SchemaInfer<typeof DdCreateSchema>;
export type DdCreateOutput = CreatedModel;
