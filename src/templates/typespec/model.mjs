const dashToPascal = (string) =>
  string
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const getTypeSpecModel = (name) => {
  const pascalName = dashToPascal(name);
  
  return `import "../../utils/model.tsp";
import "@typespec/http";
import "@typespec/versioning";

using TypeSpec.Http;
using TypeSpec.Versioning;
using Utils.Model;
using Utils.Versioning;

namespace api.${pascalName};

@doc("${name} base entity")
model ${pascalName}Entity {
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null = null;
}

// CREATE //
@doc("${name} create input")
model CreateInput extends PickProperties<${pascalName}Entity, "name"> {}
@doc("${name} create output")
model CreateOutput extends ${pascalName}Entity {}

// UPDATE //
model UpdateParamInput {
  @doc("${name} id")
  @path
  id: string;
}
@doc("${name} update input")
model UpdateInput extends PickProperties<${pascalName}Entity, "name"> {}
@doc("${name} update output")
model UpdateOutput extends ${pascalName}Entity {}

// GET BY ID //
model GetByIdParamInput {
  @doc("${name} id")
  @path
  id: string;
}
@doc("${name} get by id input")
model GetByIdOutput extends ${pascalName}Entity {}

// LIST //
model ListQueryInput extends ApiPaginationInput {}
@doc("${name} list output")
model ListOutput extends ApiPaginationOutput<${pascalName}Entity> {}

// DELETE //
model DeleteParamInput {
  @doc("${name} id")
  @path
  id: string;
}
@doc("${name} delete output")
model DeleteOutput extends OmitProperties<${pascalName}Entity, "deletedAt"> {
  deletedAt: utcDateTime;
}
`;
};
