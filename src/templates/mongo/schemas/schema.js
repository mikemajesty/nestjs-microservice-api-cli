
const pluralize = require('pluralize')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getModuleSchema = (name) => `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { ${capitalizeFirstLetter(name)}Entity } from '@/core/${name}/entity/${name}';

export type ${capitalizeFirstLetter(name)}Document = Document & ${capitalizeFirstLetter(name)}Entity;

@Schema({
  collection: '${pluralize(name)}',
  autoIndex: true,
  timestamps: true
})
export class ${capitalizeFirstLetter(name)} {
  @Prop({ type: String })
  _id!: string;

  @Prop({ index: true, min: 1, max: 200, required: true, type: String })
  name!: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const ${capitalizeFirstLetter(name)}Schema = SchemaFactory.createForClass(${capitalizeFirstLetter(name)});

${capitalizeFirstLetter(name)}Schema.index({ name: 1 });

${capitalizeFirstLetter(name)}Schema.plugin(paginate);

${capitalizeFirstLetter(name)}Schema.virtual('id').get(function () {
  return this._id;
});

export { ${capitalizeFirstLetter(name)}Schema };
`

module.exports = {
  getModuleSchema
}