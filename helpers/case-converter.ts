export function toSnake(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const converted = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[converted] = obj[key];
  }
  return result;
}

export function toCamel(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const converted = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[converted] = obj[key];
  }
  return result;
}
