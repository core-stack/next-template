"use client"

import { FileText, Home, Settings, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';

import { Sidebar } from '@/components/sidebar';
import { Permission } from '@packages/permission';

interface TenantSidebarProps {
  slug: string
}

export function GroupSidebar({ slug }: TenantSidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() || ""
  const t = useTranslations();
  // remove reserved routes
  const baseURL = `/t/${slug}`;

  const routes = [
    {
      label: t/*i18n*/("General"),
      icon: Home,
      href: baseURL,
      active: pathname === baseURL,
      permissions: []
    },
    {
      label: t/*i18n*/("Data"),
      icon: FileText,
      href: `${baseURL}/data?${searchParams.get("groups") ? `groups=${searchParams.get("groups")}` : ""}`,
      active: pathname === `${baseURL}/data`,
      permissions: []
    },
    {
      label: t/*i18n*/("Members"),
      icon: Users,
      href: `${baseURL}/members?${searchParams.get("groups") ? `groups=${searchParams.get("groups")}` : ""}`,
      active: pathname.includes(`${baseURL}/members`),
      permissions: [Permission.GET_MEMBERS]
    },
    {
      label: t/*i18n*/("Settings"),
      icon: Settings,
      href: `${baseURL}/settings?${searchParams.get("groups") ? `groups=${searchParams.get("groups")}` : ""}`,
      active: pathname === `${baseURL}/settings`,
      permissions: [Permission.UPDATE_TENANT]
    },
  ]

  return ( <Sidebar routes={routes} /> );
}
