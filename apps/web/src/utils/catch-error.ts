export type NoError<T = any> = [T, null];
export type WithError<E extends Error = Error> = [null, E];

export const catchError = async <T = any, E extends Error = Error>(promise: Promise<T>): Promise<NoError<T> | WithError<E>> => {
  try {
    return [await promise, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}