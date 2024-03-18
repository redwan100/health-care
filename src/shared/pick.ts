const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const filteredData: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      filteredData[key] = obj[key];
    }
  }
  return filteredData;
};

export default pick;
