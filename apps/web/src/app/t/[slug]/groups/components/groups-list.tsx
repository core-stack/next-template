"use client"

import { FolderIcon, List, Search } from 'lucide-react';
import { useState } from 'react';

import { FolderView } from './folder-view';
import { GroupItem } from './group-item';

import type { Group } from "@/types/group"
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Frontend Team",
    lastUpdated: "2 minutes ago",
    subgroupsCount: 2,
    membersCount: 5,
    isOwner: true,
    children: [
      {
        id: "1-1",
        name: "React Projects",
        lastUpdated: "1 hour ago",
        subgroupsCount: 1,
        membersCount: 3,
        isOwner: false,
        children: [
          {
            id: "1-1-1",
            name: "Dashboard App",
            lastUpdated: "3 hours ago",
            subgroupsCount: 0,
            membersCount: 2,
            isOwner: false,
          },
        ],
      },
      {
        id: "1-2",
        name: "Vue Projects",
        lastUpdated: "2 days ago",
        subgroupsCount: 0,
        membersCount: 2,
        isOwner: true,
      },
    ],
  },
  {
    id: "2",
    name: "Backend Team",
    lastUpdated: "5 minutes ago",
    subgroupsCount: 1,
    membersCount: 4,
    isOwner: true,
    children: [
      {
        id: "2-1",
        name: "API Services",
        lastUpdated: "1 day ago",
        subgroupsCount: 2,
        membersCount: 3,
        isOwner: false,
        children: [
          {
            id: "2-1-1",
            name: "User Service",
            lastUpdated: "6 hours ago",
            subgroupsCount: 0,
            membersCount: 1,
            isOwner: false,
          },
          {
            id: "2-1-2",
            name: "Payment Service",
            lastUpdated: "1 day ago",
            subgroupsCount: 0,
            membersCount: 2,
            isOwner: true,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "DevOps",
    lastUpdated: "1 hour ago",
    subgroupsCount: 0,
    membersCount: 2,
    isOwner: false,
  },
]

export function GroupsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"member" | "inactive">("member")
  const [viewMode, setViewMode] = useState<"list" | "folder">("list")

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

  const filteredGroups = filterGroups(mockGroups, searchTerm)

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex border border-gray-600 rounded overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-300"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("folder")}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === "folder" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-300"
              }`}
              title="Folder view"
            >
              <FolderIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Groups content */}
      {filteredGroups.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          {searchTerm ? "No groups found matching your search." : "No groups available."}
        </div>
      ) : viewMode === "folder" ? (
        <FolderView groups={filteredGroups} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
