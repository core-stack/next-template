"use client"

import { FileText, Home, LayoutDashboard, Settings, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { Sidebar } from '@/components/sidebar';
import { ApiTenantSlugGet } from '@packages/common';
import { Permission } from '@packages/permission';

interface TenantSidebarProps {
  slug: string
  tenant: ApiTenantSlugGet.Response200
}

export function TenantSidebar({ slug }: TenantSidebarProps) {
  const pathname = usePathname() || ""
  const t = useTranslations();

  const routes = [
    {
      label: t/*i18n*/("General"),
      icon: Home,
      href: `/t/${slug}`,
      active: pathname === `/t/${slug}`,
      permissions: []
    },
    {
      label: t/*i18n*/("Groups"),
      icon: LayoutDashboard,
      href: `/t/${slug}/groups`,
      active: pathname === `/t/${slug}/groups`,
      permissions: []
    },
    {
      label: t/*i18n*/("Sources"),
      icon: FileText,
      href: `/t/${slug}/sources`,
      active: pathname === `/t/${slug}/sources`,
      permissions: []
    },
    {
      label: t/*i18n*/("Members"),
      icon: Users,
      href: `/t/${slug}/members`,
      active: pathname.includes(`/t/${slug}/members`),
      permissions: [Permission.GET_MEMBERS]
    },
    {
      label: t/*i18n*/("Settings"),
      icon: Settings,
      href: `/t/${slug}/settings`,
      active: pathname === `/t/${slug}/settings`,
      permissions: [Permission.UPDATE_TENANT]
    },
  ]

  return (
    <Sidebar routes={routes} />
  )
}
