import { DdEntity } from '@/core/dd/entity/dd';
import { ValidateSchema } from '@/utils/decorators';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';
import { InputValidator } from '@/utils/validator';

import { IDdRepository } from '../repository/dd';

export const DdListSchema = InputValidator.intersection(PaginationSchema, SortSchema).and(SearchSchema);

export class DdListUsecase implements IUsecase {
  constructor(private readonly ddRepository: IDdRepository) {}

  @ValidateSchema(DdListSchema)
  async execute(input: DdListInput): Promise<DdListOutput> {
    return await this.ddRepository.paginate(input);
  }
}

export type DdListInput = PaginationInput<DdEntity>;
export type DdListOutput = PaginationOutput<DdEntity>;
