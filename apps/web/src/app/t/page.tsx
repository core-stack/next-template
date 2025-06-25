
import { TenantsHeader } from '@/components/tenant-header';

import { CreateTenantButton } from './components/create-button';
import { TenantList } from './components/list';

export default async function Workspaces() {
  return (
    <>
      <TenantsHeader />
      <div className="container py-10 m-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas organizações e áreas de trabalho</p>
          </div>
          <CreateTenantButton />
        </div>
        <TenantList />
      </div>
    </>
  );
}
