import { AdminRole, UserRole, WorkspaceAdminRole, WorkspaceMemberRole } from './roles';
import { Permission, RoleName } from './types';

export const getRolePermissions = (role: RoleName) => {
  switch (role) {
    case RoleName.ADMIN:
      return AdminRole.permissions;
    case RoleName.USER:
      return UserRole.permissions;
    case RoleName.WORKSPACE_ADMIN:
      return WorkspaceAdminRole.permissions;
    case RoleName.WORKSPACE_MEMBER:
      return WorkspaceMemberRole.permissions;
    default:
      return [];
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