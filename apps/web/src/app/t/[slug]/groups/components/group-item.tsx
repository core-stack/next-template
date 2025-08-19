"use client"

import { useState } from 'react';

import { GroupHeader } from './group-header';

import type { Group } from "@/types/group"

interface GroupItemProps {
  group: Group
  level?: number
}

export function GroupItem({ group, level = 0 }: GroupItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const hasChildren = group.children && group.children.length > 0

  return (
    <div>
      <GroupHeader group={group} isExpanded={isExpanded} onToggle={toggleExpanded} level={level} />

      {isExpanded && hasChildren && (
        <div>
          {group.children!.map((childGroup) => (
            <GroupItem key={childGroup.id} group={childGroup} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
