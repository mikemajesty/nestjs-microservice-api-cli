import { IDdRepository } from '@/core/dd/repository/dd';
import { ILoggerAdapter } from '@/infra/logger';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';
import { SchemaInfer } from '@/utils/validator';

import { DdEntity, DdEntitySchema } from '../entity/dd';

export const DdUpdateSchema = DdEntitySchema.pick({
  id: true
}).merge(DdEntitySchema.omit({ id: true }).partial());

export class DdUpdateUsecase implements IUsecase {
  constructor(
    private readonly ddRepository: IDdRepository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(DdUpdateSchema)
  async execute(input: DdUpdateInput): Promise<DdUpdateOutput> {
    const dd = await this.ddRepository.findById(input.id);

    if (!dd) {
      throw new ApiNotFoundException();
    }

    const entity = new DdEntity({ ...dd, ...input });

    await this.ddRepository.updateOne({ id: entity.id }, entity.toObject());

    this.loggerService.info({ message: 'dd updated.', metadata: { dd: input } });

    const updated = await this.ddRepository.findById(entity.id);

    return new DdEntity(updated as DdEntity).toObject();
  }
}

export type DdUpdateInput = SchemaInfer<typeof DdUpdateSchema>;
export type DdUpdateOutput = DdEntity;
