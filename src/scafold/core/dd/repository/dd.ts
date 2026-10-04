import { IRepository } from '@/infra/repository';

import { DdEntity } from '../entity/dd';
import { DdListInput, DdListOutput } from '../use-cases/dd-list';

export abstract class IDdRepository extends IRepository<DdEntity> {
  abstract paginate(input: DdListInput): Promise<DdListOutput>;
}
