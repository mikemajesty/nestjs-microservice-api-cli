
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleSchema = (name) => `import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: '${pluralize(name)}', underscored: true })
export class ${capitalizeFirstLetter(name)}Schema extends Model {
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column(DataType.STRING)
  name: string;

  @Column({ allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
`

module.exports = {
  getModuleSchema
}