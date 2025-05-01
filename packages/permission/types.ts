export enum Permission {
  // global scope
  ROOT = "*:*:*",
  USER_ALL = "global:user:*",
  CREATE_USER = "global:user:create",
  READ_USERS = "global:user:read",
  UPDATE_USER = "global:user:update",
  DELETE_USER = "global:user:delete",
  BAN_USER = "global:user:ban",

  // workspace scope
  WORKSPACE_ALL = "workspace:workspace:*",
  UPDATE_WORKSPACE = "workspace:workspace:update",
  DELETE_WORKSPACE = "workspace:workspace:delete",
  MEMBER_ALL = "workspace:member:*",
  GET_MEMBERS = "workspace:member:read",
  INVITE_MEMBER = "workspace:member:invite",
  UPDATE_MEMBER = "workspace:member:update",
  DELETE_MEMBER = "workspace:member:delete",
}

export enum RoleName {
  ROOT = "ROOT",
  ADMIN = "ADMIN",
  USER = "USER",
  WORKSPACE_ADMIN = "WORKSPACE_ADMIN",
  WORKSPACE_MEMBER = "WORKSPACE_MEMBER",
}

export type Role = {
  scope: "global" | "workspace";
  name: RoleName;
  permissions: Permission[];
}