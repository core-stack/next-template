"use client"

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { useApiQuery } from '@/hooks/use-api-query';
import { useTenant } from '@/hooks/use-tenant';

import { GroupItem } from './group-item';

import type { Group } from "@/types/group";
export function GroupsList() {
  const { slug } = useTenant();
  const searchParams = useSearchParams();
  const path = searchParams.get('path');
  const { data: groups } = useApiQuery(
    '[GET] /api/tenant/:slug/group',
    { params: { slug }, query: { path: path || undefined } }
  );

  const filterGroups = (groups: Group[], term: string): Group[] => {
    if (!term) return groups

    return groups
      .filter((group) => {
        const matchesName = group.name.toLowerCase().includes(term.toLowerCase())
        const hasMatchingChildren = group.children && filterGroups(group.children, term).length > 0
        return matchesName || hasMatchingChildren
      })
      .map((group) => ({
        ...group,
        children: group.children ? filterGroups(group.children, term) : undefined,
      }))
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and View Toggle */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Groups content */}
      {groups?.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No groups available.</div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {groups?.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
