import type { Metadata } from "next"
import { redirect } from 'next/navigation';

import { TenantsHeader } from '@/components/tenant-header';
import { fetchApi } from '@/lib/fetcher';

import { ReactivateTenantForm } from './reactivate-form';

interface ReactivateWorkspacePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ReactivateWorkspacePageProps): Promise<Metadata> {
  const { slug } = await params;
  fetchApi("[GET] /api/tenant/:slug", { params: { slug } });
  const { data } = await fetchApi("[GET] /api/tenant/:slug", { params: { slug } });
  const tenant = data;
  if (!tenant?.disabledAt) redirect(`/t/${slug}`);
  return {
    title: `Reativar ${tenant?.name}`,
    description: `Reative seu workspace "${tenant?.name}" antes que seja excluído permanentemente`,
  }
}

export default async function ReactivateWorkspacePage({ params }: ReactivateWorkspacePageProps) {
  const { slug } = await params
  const { data: tenant, error, success } = await fetchApi("[GET] /api/tenant/:slug", { params: { slug } });
  if (!success || error || !tenant) redirect("/t");

  return (
    <>
      <TenantsHeader />
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <ReactivateTenantForm tenant={tenant} />
        </div>
      </div>
    </>
  )
}
