export interface Group {
  id: string
  name: string
  lastUpdated: string
  subgroupsCount: number
  membersCount: number
  isOwner: boolean
  children?: Group[]
}
