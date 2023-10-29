
const getIndexLib = (name) => `export * from './adapter';
export * from './module';
export * from './service';
`

module.exports = {
  getIndexLib
}