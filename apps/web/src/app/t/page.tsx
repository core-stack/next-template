import { TenantsHeader } from '@/components/tenant-header';

import { CreateTenantButton } from './components/create-button';
import { TenantHead } from './components/head';
import { TenantList } from './components/list';

export default function Workspaces() {
  return (
    <>
      <TenantsHeader />
      <div className="container py-10 m-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <TenantHead />
          </div>
          <CreateTenantButton />
        </div>
        <TenantList />
      </div>
    </>
  );
}
