export const dashToPascal = (string) => {
  return string.split("/")
    .map(snake => snake.split("-")
      .map(substr => substr.charAt(0)
        .toUpperCase() +
        substr.slice(1))
      .join(""))
    .join("/");
};

export const snakeToCamel = str =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

// single source of truth for CRUD permission names, shared by controller templates
// and the permissions migration template, so they never drift apart.
export const getPermissionNames = (name) => {
  return [`${name}:create`, `${name}:update`, `${name}:getbyid`, `${name}:list`, `${name}:delete`];
};