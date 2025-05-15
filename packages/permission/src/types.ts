import { UserRole as UserRoleName, WorkspaceRole as WorkspaceRoleName } from "@packages/prisma";

export enum Permission {
  // global scope
  ROOT = "*:*:*",
  USER_ALL = "global:user:*",
  CREATE_USER = "global:user:create",
  READ_USERS = "global:user:read",
  UPDATE_USER = "global:user:update",
  DELETE_USER = "global:user:delete",
  BAN_USER = "global:user:ban",

  // ---------------------------------------------------
  // workspace scope
  WORKSPACE_ALL = "workspace:workspace:*",
  UPDATE_WORKSPACE = "workspace:workspace:update",
  DELETE_WORKSPACE = "workspace:workspace:delete",

  // member
  MEMBER_ALL = "workspace:member:*",
  GET_MEMBERS = "workspace:member:read",
  UPDATE_MEMBER = "workspace:member:update",
  DELETE_MEMBER = "workspace:member:delete",

  // invite
  INVITE_ALL = "workspace:invite:*",
  CREATE_INVITE = "workspace:invite:create",
  DELETE_INVITE = "workspace:invite:delete",

  // billing
  BILLING_ALL = "workspace:billing:*",
  GET_BILLING = "workspace:billing:read",
  UPDATE_BILLING = "workspace:billing:update",
  DELETE_BILLING = "workspace:billing:delete",
}

export type WorkspaceRoleType = {
  scope: "workspace";
  name: WorkspaceRoleName;
  permissions: Permission[];
}
export type UserRoleType = {
  scope: "global";
  name: UserRoleName;
  permissions: Permission[];
}
export {
  WorkspaceRoleName,
  UserRoleName
}
export type Role = WorkspaceRoleType | UserRoleType;