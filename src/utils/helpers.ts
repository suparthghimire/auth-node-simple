export function OmitProperty<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj;
  return rest;
}
export function OmitProperties<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const rest = { ...obj };
  for (const key of keys) {
    delete rest[key];
  }
  return rest;
}
