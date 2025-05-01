import { Permission, Role, RoleName } from './types';

// global roles
export const RootRole: Role = {
  name: RoleName.ROOT,
  scope: "global",
  permissions: [ Permission.ROOT ]
}
export const AdminRole: Role = {
  name: RoleName.ADMIN,
  scope: "global",
  permissions: [ Permission.USER_ALL ]
}
export const UserRole: Role = {
  name: RoleName.USER,
  scope: "global",
  permissions: []
}

// workspace roles
export const WorkspaceAdminRole: Role = {
  name: RoleName.WORKSPACE_ADMIN,
  scope: "workspace",
  permissions: [ Permission.WORKSPACE_ALL, Permission.MEMBER_ALL ]
}
export const WorkspaceMemberRole: Role = {
  name: RoleName.WORKSPACE_MEMBER,
  scope: "workspace",
  permissions: [ Permission.GET_MEMBERS ]
}