"use client"

import { ChevronDown, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { usePermission } from '@/context/permission';
import { cn } from '@/lib/utils';
import { Permission } from '@packages/permission';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { MemberInfo } from './member-info';

type Route = {
  label: string
  icon: any
  href: string
  active: boolean
  permissions?: Permission[]
}

interface SidebarProps {
  routes: {
    [key: string]: Route[]
  };
}

export function Sidebar({ routes }: SidebarProps) {
  const t = useTranslations();
  const { can } = usePermission();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen sticky top-0 overflow-y-auto overflow-x-hidden",
        "w-[280px]",
      )}
    >
      <div className="p-4 h-14 border-b">
        <h1>Memora</h1>
      </div>

      <div className="flex-1 py-4 px-2">
        <nav>
          {Object.entries(routes).map(([key, route]) => (
            <Collapsible key={key} defaultOpen>
              <CollapsibleTrigger asChild>
                <button className='flex justify-between w-full items-center p-2'>
                  {key}
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {
                  route.filter(route => can(route.permissions ?? [])).map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        route.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary",
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "text-muted-foreground")} />
                      <span>{route.label}</span>
                    </Link>
                  ))
                }
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 py-4">
        {/* Card de Upgrade */}
        <div
          className={cn("rounded-lg bg-gradient-to-r from-primary/80 to-primary p-4 text-white mb-4")}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">{t/*i18n*/("Upgrade to Pro")}</span>
          </div>
          <p className="text-xs mb-3">{t/*i18n*/("Unlimited access to all features")}</p>
          <Button size="sm" variant="secondary" className="w-full">
            {t/*i18n*/("Upgrade now")}
          </Button>
        </div>

        <MemberInfo />
      </div>
    </div>
  )
}
