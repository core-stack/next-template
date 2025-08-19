"use client"

import { useState } from 'react';

import { FolderGridItem } from './folder-grid-item';

import type { Group } from "@/types/group"
interface FolderViewProps {
  groups: Group[]
}

export function FolderView({ groups }: FolderViewProps) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [navigationPath, setNavigationPath] = useState<Group[]>([])

  const getCurrentGroups = (): Group[] => {
    if (!currentGroup) return groups
    return currentGroup.children || []
  }

  const handleNavigateToGroup = (group: Group) => {
    if (group.children && group.children.length > 0) {
      setCurrentGroup(group)
      setNavigationPath([...navigationPath, group])
    }
  }

  const handleBreadcrumbNavigate = (group: Group | null) => {
    if (!group) {
      // Navigate to root
      setCurrentGroup(null)
      setNavigationPath([])
    } else {
      // Navigate to specific group in path
      const groupIndex = navigationPath.findIndex((g) => g.id === group.id)
      if (groupIndex !== -1) {
        setCurrentGroup(group)
        setNavigationPath(navigationPath.slice(0, groupIndex + 1))
      }
    }
  }

  const currentGroups = getCurrentGroups()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {currentGroups.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            {currentGroup ? "No subgroups in this group." : "No groups available."}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {currentGroups.map((group) => (
              <FolderGridItem key={group.id} group={group} onDoubleClick={handleNavigateToGroup} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
