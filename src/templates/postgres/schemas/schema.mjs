
import pluralize from 'pluralize'
import { dashToPascal } from '../../../textUtils.mjs'

const getModuleSchema = (name) => `import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn
} from 'typeorm';


@Entity({ name: '${pluralize(name)}' })
export class ${dashToPascal(name)}Schema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column('text')
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}
`

export {
  getModuleSchema
}