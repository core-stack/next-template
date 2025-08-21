"use client";

import { redirect, useParams } from 'next/navigation';
import React from 'react';

import { NotificationsProvider } from '@/context/notifications';
import { useApiQuery } from '@/hooks/use-api-query';

import { TenantSidebar } from './components/tenant-sidebar';
import { Topbar } from './components/topbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { data, error, isLoading } = useApiQuery("[GET] /api/tenant/:slug", { params: { slug } });
  if (error) {
    return <div>error</div>
  }
  if (isLoading) {
    return <div>loading</div>
  }
  if (data!.disabledAt) redirect(`/t/reactivate/${slug}`);

  return (
    <NotificationsProvider>
      <div className="flex min-h-screen">
        <TenantSidebar slug={slug} tenant={data!} />
        <div className="flex-1 overflow-auto">
          <Topbar slug={slug} />
          {children}
        </div>
      </div>
    </NotificationsProvider>
  )
}