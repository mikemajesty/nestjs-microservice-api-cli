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