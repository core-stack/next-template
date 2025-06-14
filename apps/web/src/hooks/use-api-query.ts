import { buildUrl } from '@/utils/build-url';
import { ApiPath, apiRoutes, RouteData } from '@packages/common';
import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';

export function useApiQuery<Path extends ApiPath>(
  path: Path,
  opts?: {
    params?: RouteData<Path>["params"];
    query?: RouteData<Path>["querystring"];
    body?: RouteData<Path>["body"];
    enabled?: boolean;
  }
): UseQueryResult<RouteData<Path>["response"], DefaultError> {
  const method = apiRoutes[path].method;

  return useQuery({
    queryKey: [path, opts?.params, opts?.query, opts?.body],
    enabled: opts?.enabled,
    queryFn: async () => {
      const url = buildUrl(path, opts?.params, opts?.query);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...((method as string) !== "GET" && {
          body: JSON.stringify(opts?.body ?? {}),
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.statusText}`);
      }

      return res.json() as Promise<RouteData<Path>["response"]>;
    },
  });
}
