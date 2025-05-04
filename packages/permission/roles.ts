import { Permission, Role, UserRoleName, WorkspaceRoleName } from './types';

// global roles
export const RootRole: Role = {
  name: UserRoleName.ROOT,
  scope: "global",
  permissions: [ Permission.ROOT ]
}
export const AdminRole: Role = {
  name: UserRoleName.ADMIN,
  scope: "global",
  permissions: [ Permission.USER_ALL ]
}
export const UserRole: Role = {
  name: UserRoleName.USER,
  scope: "global",
  permissions: []
}

// workspace roles
export const WorkspaceAdminRole: Role = {
  name: WorkspaceRoleName.WORKSPACE_ADMIN,
  scope: "workspace",
  permissions: [ Permission.WORKSPACE_ALL, Permission.MEMBER_ALL ]
}
export const WorkspaceMemberRole: Role = {
  name: WorkspaceRoleName.WORKSPACE_MEMBER,
  scope: "workspace",
  permissions: [ Permission.GET_MEMBERS ]
}