import { buildUrl } from '@/utils/build-url';
import { ApiPath, apiRoutes, RouteData } from '@packages/common';
import {
  QueryKey, useMutation, UseMutationOptions, UseMutationResult
} from '@tanstack/react-query';

type MutationArgs<Path extends ApiPath> = {
  body?: RouteData<Path>["body"];
  querystring?: RouteData<Path>["querystring"];
  params?: RouteData<Path>["params"];
};
type MutationKey<Path extends ApiPath> = readonly [Path, ...unknown[]];
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

      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.statusText}`);
      }

      return res.json() as Promise<RouteData<Path>["response"]>;
    },
    mutationKey: options?.mutationKey ?? [key],
    ...options,
  });
}
