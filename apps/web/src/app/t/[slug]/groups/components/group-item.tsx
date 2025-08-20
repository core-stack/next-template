"use client"

import { useState } from 'react';

import { useApiQuery } from '@/hooks/use-api-query';
import { useTenant } from '@/hooks/use-tenant';
import { ArrayElement } from '@/types/array';
import { ApiTenantSlugGroupGet } from '@packages/common';

import { GroupHeader } from './group-header';

interface GroupItemProps {
  group: ArrayElement<ApiTenantSlugGroupGet.Response200>
  level?: number
}

export function GroupItem({ group, level = 0 }: GroupItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { slug } = useTenant();

  const path = `${group.path || ''}/${group.slug}`;
  const { data: children } = useApiQuery("[GET] /api/tenant/:slug/group", { params: { slug }, query: { path } });
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const hasChildren = children && children.length > 0

  return (
    <div>
      <GroupHeader group={group} isExpanded={isExpanded} onToggle={toggleExpanded} level={level} childCount={children?.length} />
      {isExpanded && hasChildren && (
        <div>
          {children.map((childGroup) => (
            <GroupItem key={childGroup.id} group={childGroup} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
