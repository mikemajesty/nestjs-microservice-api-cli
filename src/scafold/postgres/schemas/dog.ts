import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'dogs' })
export class DogSchema extends Model {
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column(DataType.STRING)
  name: string;

  @Column({ allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
