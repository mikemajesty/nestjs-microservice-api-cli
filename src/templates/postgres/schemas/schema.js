
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleSchema = (name) => `import { Max, Min } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity({ name: '${pluralize(name)}' })
export class ${capitalizeFirstLetter(name)}Schema extends BaseEntity {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Min(1)
  @Max(200)
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
`

module.exports = {
  getModuleSchema
}