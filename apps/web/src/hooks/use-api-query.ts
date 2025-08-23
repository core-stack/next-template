import { useParams, useSearchParams } from 'next/navigation';

import { buildUrl } from '@/utils/build-url';
import { catchError } from '@/utils/catch-error';
import { ApiPath, apiRoutes, RouteData } from '@packages/common';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useApiQuery<Path extends ApiPath>(
  path: Path,
  opts: {
    params?: RouteData<Path>["params"];
    query?: RouteData<Path>["querystring"];
    body?: RouteData<Path>["body"];
    enabled?: boolean;
    passParams?: boolean;
    passQuery?: boolean;
  } & Omit<UseQueryOptions, "queryKey" | "queryFn"> = { passParams: true, passQuery: true }
): UseQueryResult<RouteData<Path>["response"], RouteData<Path>["error"]> {
  const method = apiRoutes[path].method;
  const routeParams = useParams();
  const routeSearchParams = useSearchParams();
  return useQuery({
    ...opts,
    queryKey: [path, opts?.params, opts?.query, opts?.body],
    enabled: opts?.enabled,
    queryFn: async () => {
      const params = opts?.params ?? opts.passParams ? routeParams : {};
      const searchParams = routeSearchParams
        .entries()
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const query = opts?.query ?? opts.passQuery ? searchParams : {};
      const url = buildUrl(path, params, query);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...((method as string) !== "GET" && {
          body: JSON.stringify(opts?.body ?? {}),
        }),
      });

      const [json, err] = await catchError<RouteData<Path>["response"]>(res.json());
      if (err !== null) throw err;
      if (!res.ok) throw json;

      return json;
    },
  });
}
