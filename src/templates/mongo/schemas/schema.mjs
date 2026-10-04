
import pluralize from 'pluralize'
import { dashToPascal } from '../../../textUtils.mjs'

const getModuleSchema = (name) => `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, PaginateModel, Schema as MongooseSchema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';
import { IMongoSchema } from '@/utils/mongoose';

export type ${dashToPascal(name)}Document = Document & ${dashToPascal(name)}Entity;

@Schema({
  collection: '${pluralize(name)}',
  autoIndex: true,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class ${dashToPascal(name)} implements IMongoSchema<${dashToPascal(name)}Document> {
  @Prop({ type: String })
  _id!: string;

  @Prop({ min: 0, max: 200, required: true, type: String })
  name!: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date;

  repository(connection: mongoose.Connection): PaginateModel<${dashToPascal(name)}Document> {
    type Model = PaginateModel<${dashToPascal(name)}Document>;

    const repository = connection.model<${dashToPascal(name)}Document, Model>(this.constructor.name, ${dashToPascal(name)}Schema as MongooseSchema);
    return repository;
  }
}

const ${dashToPascal(name)}Schema = SchemaFactory.createForClass(${dashToPascal(name)});

${dashToPascal(name)}Schema.index({ name: 1 }, { partialFilterExpression: { deletedAt: { \$eq: null } } });

${dashToPascal(name)}Schema.plugin(paginate);

${dashToPascal(name)}Schema.virtual('id').get(function () {
  return this._id;
});

export { ${dashToPascal(name)}Schema };
`

export {
  getModuleSchema
}