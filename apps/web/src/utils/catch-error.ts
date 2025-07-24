export const catchError = async <T = any, E extends Error = Error>(promise: Promise<T>): Promise<[T | null, E | null]> => {
  try {
    return [await promise, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}