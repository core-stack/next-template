import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { ApiPath, apiRoutes, RouteData } from '@packages/common';
import {
  QueryKey, useMutation, UseMutationOptions, UseMutationResult
} from '@tanstack/react-query';

type MutationArgs<Path extends ApiPath> = {
  body?: RouteData<Path>["body"];
  querystring?: RouteData<Path>["querystring"];
  params?: RouteData<Path>["params"];
};
export function useApiMutation<Path extends ApiPath>(
  key: Path,
  options?: Omit<UseMutationOptions<
    RouteData<Path>["response"],
    RouteData<Path>["error"],
    MutationArgs<Path>,
    QueryKey
  >, "mutationKey" | "mutationFn"> & { mutationKey: QueryKey }
): UseMutationResult<RouteData<Path>["response"], RouteData<Path>["error"], MutationArgs<Path>, QueryKey> {
  return useMutation({
    mutationFn: async ({ body, params, querystring }) => {
      const url = buildUrl(key, params, querystring);
      const method = apiRoutes[key].method;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body ?? {}),
      });

      const [json, err] = await catchError<RouteData<Path>["response"]>(res.json());
      if (err !== null) {
        throw err;
      }

      if (!res.ok) {
        throw json;
      }

      return json;
    },
    mutationKey: options?.mutationKey ?? [key],
    ...options,
  });
}
