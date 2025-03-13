
import pluralize from 'pluralize'
import { dashToPascal } from '../../../textUtils.mjs'

const getModuleSchema = (name) => `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { ${dashToPascal(name)}Entity } from '@/core/${name}/entity/${name}';

export type ${dashToPascal(name)}Document = Document & ${dashToPascal(name)}Entity;

@Schema({
  collection: '${pluralize(name)}',
  autoIndex: true,
  timestamps: true
})
export class ${dashToPascal(name)} {
  @Prop({ type: String })
  _id!: string;

  @Prop({ index: true, min: 1, max: 200, required: true, type: String })
  name!: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const ${dashToPascal(name)}Schema = SchemaFactory.createForClass(${dashToPascal(name)});

${dashToPascal(name)}Schema.index({ name: 1 });

${dashToPascal(name)}Schema.plugin(paginate);

${dashToPascal(name)}Schema.virtual('id').get(function () {
  return this._id;
});

export { ${dashToPascal(name)}Schema };
`

export {
  getModuleSchema
}