import pluralize from 'pluralize';

const dashToPascal = (string) =>
  string
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const getTypeSpecController = (name) => {
  const pascalName = dashToPascal(name);
  
  return `import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "@typespec/versioning";
import "../../utils/model.tsp";
import "./model.tsp";
import "./exception.tsp";

using TypeSpec.Http;
using TypeSpec.Versioning;
using OpenAPI;
using Utils.Model;
using Utils.Versioning;

@service({
  title: "${pascalName}",
})
namespace api.${pascalName};

@tag("${pascalName}")
@route("api/{version}/${pluralize(name)}")
@useAuth(BearerAuth)
interface ${pascalName}Controller {
  @post
  @doc("create ${name}")
  @returnsDoc("${name} created successfully")
  create(...VersionParams, @body body: CreateInput): CreateOutput | CreateValidationException;

  @put
  @doc("update ${name}")
  @returnsDoc("${name} updated successfully")
  update(
    ...VersionParams,
    ...UpdateParamInput,
    @body body: UpdateInput,
  ): UpdateOutput | UpdateValidationException | UpdateNotFoundException;

  @get
  @doc("get ${name} by id")
  @returnsDoc("get ${name} by id successfully")
  getById(
    ...VersionParams,
    ...GetByIdParamInput,
  ): GetByIdOutput | GetByIdValidationException | GetByIdNotFoundException;

  @get
  @doc("list ${name}")
  @returnsDoc("list ${name} successfully")
  list(...VersionParams, ...ListQueryInput): ListOutput;

  @delete
  @doc("delete ${name}")
  @returnsDoc("${name} deleted successfully")
  delete(...VersionParams, ...DeleteParamInput): DeleteOutput | DeleteValidationException | DeleteNotFoundException;
}
`;
};
