"use client"

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';
import { ArrayElement } from '@/types/array';
import { ApiTenantSlugGroupGet } from '@packages/common';

interface GroupHeaderProps {
  group: ArrayElement<ApiTenantSlugGroupGet.Response200>;
  isExpanded: boolean;
  onToggle: () => void;
  level: number;
  childCount?: number;
}

export function GroupHeader({ group, isExpanded, onToggle, level, childCount }: GroupHeaderProps) {
  const { slug } = useTenant();
  const paddingLeft = `${level * 20 + 16}px`;
  const isLoading = childCount === undefined;
  const hasChild = !!childCount && childCount > 0;
  const path = `${group.path || ''}/${group.slug}`;
  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-700"
      style={{ paddingLeft }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className={cn("text-gray-400 hover:text-gray-300 transition-colors", isLoading || !hasChild ? "pointer-events-none opacity-0" : "")}>
          {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
        </button>

        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{group.name.charAt(0).toUpperCase()}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Link href={`/t/${slug}/groups?path=${path}`} className="font-medium text-gray-200 hover:underline cursor-pointer">{group.name}</Link>
            <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">Owner</span>
          </div>
          {isLoading && <Skeleton className='h-[12px] w-[70px]'/>}
          {hasChild && <div className="text-xs text-gray-400">Childs:  { childCount }</div>}
          <div className="text-xs text-gray-400">Updated {moment(group.updatedAt).format("MMM DD YYYY") }</div>
        </div>
      </div>
    </div>
  )
}
