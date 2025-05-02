import useSWR, { SWRConfig } from "swr";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{
      refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      {children}
    </SWRConfig>
  )
}