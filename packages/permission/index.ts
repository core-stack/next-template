import { AdminRole, UserRole, WorkspaceAdminRole, WorkspaceMemberRole } from './roles';
import {
  Permission, UserRoleName, UserRoleType, WorkspaceRoleName, WorkspaceRoleType
} from './types';

export const getRolePermissions = (role: UserRoleType | WorkspaceRoleType) => {
  if (role.scope === "workspace") {
    switch (role.name) {
      case WorkspaceRoleName.WORKSPACE_ADMIN:
        return WorkspaceAdminRole.permissions;
      case WorkspaceRoleName.WORKSPACE_MEMBER:
        return WorkspaceMemberRole.permissions;
      default:
        return [];
    }
  } else {
    switch (role.name) {
      case UserRoleName.ADMIN:
        return AdminRole.permissions;
      case UserRoleName.USER:
        return UserRole.permissions;
      default:
        return [];
    }
  }
}

function matchesPermission(granted: string, required: string): boolean {
  const [gScope, gRes, gAct] = granted.split(':');
  const [rScope, rRes, rAct] = required.split(':');

  const match = (a: string, b: string) => a === '*' || a === b;

  return match(gScope, rScope) && match(gRes, rRes) && match(gAct, rAct);
}

export const can = (userPermissions: Permission[], requiredPermissions: Permission[]) => {
  return requiredPermissions.every(r => userPermissions.some(g => matchesPermission(g, r)));
}

export * from "./roles";
export * from "./types";