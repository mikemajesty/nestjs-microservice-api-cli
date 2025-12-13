const dashToPascal = (string) =>
  string
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const getTypeSpecException = (name) => {
  const pascalName = dashToPascal(name);
  const camelName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  return `import "../../utils/model.tsp";
import "../../utils/exceptions.tsp";
import "@typespec/http";
import "@typespec/versioning";

using TypeSpec.Http;
using TypeSpec.Versioning;
using Utils.Model;
using Utils.Exception;
using Utils.Versioning;

namespace api.${pascalName};

// CREATE //
@doc("When input is invalid")
@error
model CreateValidationError extends ApiBadRequestException<"name: Required"> {
  @statusCode statusCode: 400;
}

alias CreateValidationException = CreateValidationError;

// UPDATE //
@doc("When input is invalid")
@error
model UpdateValidationError extends ApiBadRequestException<"id: Required"> {
  @statusCode statusCode: 400;
}

alias UpdateValidationException = UpdateValidationError;

@doc("When ${name} not found")
@error
model Update${pascalName}NotFoundError extends ApiNotFoundException<"${camelName}NotFound"> {
  @statusCode statusCode: 404;
}

alias UpdateNotFoundException = Update${pascalName}NotFoundError;

// GET BY ID //
@doc("When input is invalid")
@error
model GetByIdValidationError extends ApiBadRequestException<"id: Required"> {
  @statusCode statusCode: 400;
}

alias GetByIdValidationException = GetByIdValidationError;

@doc("When ${name} not found")
@error
model GetById${pascalName}NotFoundError extends ApiNotFoundException<"${camelName}NotFound"> {
  @statusCode statusCode: 404;
}

alias GetByIdNotFoundException = GetById${pascalName}NotFoundError;

// DELETE //
@doc("When input is invalid")
@error
model DeleteValidationError extends ApiBadRequestException<"id: Required"> {
  @statusCode statusCode: 400;
}

alias DeleteValidationException = DeleteValidationError;

@doc("When ${name} not found")
@error
model Delete${pascalName}NotFoundError extends ApiNotFoundException<"${camelName}NotFound"> {
  @statusCode statusCode: 404;
}

alias DeleteNotFoundException = Delete${pascalName}NotFoundError;
`;
};
