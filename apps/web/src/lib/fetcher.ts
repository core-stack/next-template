import { buildUrl } from '@/utils/build-url';
import { ApiPath, apiRoutes, RouteData } from '@packages/common';

type ExtractResponse<T> = T extends { response: infer R } ? R : never;
type ExtractError<T> = T extends { error: infer E } ? E : { code: number; message: string };

type FetchApiReturn<Path extends ApiPath> = {
  data: ExtractResponse<RouteData<Path>> | undefined;
  error: ExtractError<RouteData<Path>> | undefined;
  success: boolean;
};

export async function fetchApi<Path extends ApiPath>(
  path: Path,
  opts?: {
    params?: RouteData<Path>["params"];
    query?: RouteData<Path>["querystring"];
    body?: RouteData<Path>["body"];
    headers?: Record<string, string>;
    cache?: RequestCache;
    
  }
): Promise<FetchApiReturn<Path>> {
  const method = apiRoutes[path].method;
  const url = buildUrl(path, opts?.params, opts?.query);

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.headers ?? {}),
    },
    ...(method !== 'GET' && {
      body: JSON.stringify(opts?.body ?? {}),
    }),
    cache: opts?.cache ?? 'no-store',
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    const error = contentType?.includes('application/json')
      ? await res.json()
      : { code: res.status, message: res.statusText };

    return {
      data: undefined,
      error,
      success: false,
    };
  }

  const data = await res.json();
  return {
    data,
    success: true,
    error: undefined,
  };
}
