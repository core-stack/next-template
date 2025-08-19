"use client"

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

interface GroupHeaderProps {
  group: {
    id: string
    name: string
    lastUpdated: string
    subgroupsCount: number
    membersCount: number
    isOwner: boolean
  }
  isExpanded: boolean
  onToggle: () => void
  level: number
}

export function GroupHeader({ group, isExpanded, onToggle, level }: GroupHeaderProps) {
  const paddingLeft = `${level * 20 + 16}px`

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-700"
      style={{ paddingLeft }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-300 transition-colors">
          {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
        </button>

        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{group.name.charAt(0).toUpperCase()}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-200">{group.name}</span>
            {group.isOwner && (
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">Owner</span>
            )}
          </div>
          <div className="text-xs text-gray-400">Updated {group.lastUpdated}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {group.subgroupsCount}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          {group.membersCount}
        </span>
      </div>
    </div>
  )
}
