"use client"

import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

type Props = {
  slug: string
}
export function Topbar({ slug }: Props) {
  const searchParams = useSearchParams();
  const groups = searchParams.get("path")?.split("/").filter(Boolean) || [];
  const pathname = usePathname();
  
  return (
    <header className="w-full flex h-14 items-center gap-3 border-b bg-background px-5">
      <div className="flex items-center gap-2 w-full">
        <Breadcrumb>
          <BreadcrumbList>
          {
            groups.length > 0 && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/t/${slug}/groups`}>
                    Groups
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )
          }
            {
              groups.map((group, index) => (
                <React.Fragment key={group}>
                  <BreadcrumbItem>
                    <BreadcrumbLink active={index + 1 === groups.length} href={`${pathname}?path=/${groups.slice(0, index + 1).join("/")}`}>
                      {group}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {
                    index + 1 !== groups.length && (
                      <BreadcrumbSeparator />
                    )
                  }
                </React.Fragment>
              ))
            }
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
