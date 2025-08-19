"use client"

import type { Group } from "@/types/group"
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

interface BreadcrumbProps {
  path: Group[]
  onNavigate: (group: Group | null) => void
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-gray-800 border-b border-gray-700">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded"
      >
        <HomeIcon className="w-4 h-4" />
        <span>Groups</span>
      </button>

      {path.map((group, index) => (
        <div key={group.id} className="flex items-center gap-1">
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          <button
            onClick={() => onNavigate(group)}
            className="px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded truncate max-w-32"
          >
            {group.name}
          </button>
        </div>
      ))}
    </nav>
  )
}
