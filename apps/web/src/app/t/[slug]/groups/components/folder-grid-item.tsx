"use client"

import type { Group } from "@/types/group"
import { ClockIcon, FolderIcon, UsersIcon } from 'lucide-react';

interface FolderGridItemProps {
  group: Group
  onDoubleClick: (group: Group) => void
}

export function FolderGridItem({ group, onDoubleClick }: FolderGridItemProps) {
  return (
    <div
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-800 cursor-pointer group transition-colors"
      onDoubleClick={() => onDoubleClick(group)}
    >
      {/* Folder Icon */}
      <div className="mb-2">
        <FolderIcon className="w-12 h-12 text-blue-400 group-hover:text-blue-300" />
      </div>

      {/* Group Name */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate max-w-24">{group.name}</h3>
        {group.isOwner && (
          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-orange-600 text-white rounded">Owner</span>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1 text-xs text-gray-400">
        {group.subgroupsCount > 0 && (
          <div className="flex items-center gap-1">
            <FolderIcon className="w-3 h-3" />
            <span>{group.subgroupsCount} subgroups</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <UsersIcon className="w-3 h-3" />
          <span>{group.membersCount} members</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          <span>{group.lastUpdated}</span>
        </div>
      </div>
    </div>
  )
}
