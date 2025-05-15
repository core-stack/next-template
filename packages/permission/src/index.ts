import { AdminRole, UserRole, WorkspaceAdminRole, WorkspaceMemberRole } from "./roles";
import { Permission, UserRoleName, WorkspaceRoleName } from "./types";

export const getRolePermissions = (role: WorkspaceRoleName | UserRoleName) => {
  switch (role) {
    case WorkspaceRoleName.WORKSPACE_ADMIN:
      console.log(WorkspaceAdminRole);

      return WorkspaceAdminRole.permissions;
    case WorkspaceRoleName.WORKSPACE_MEMBER:
      return WorkspaceMemberRole.permissions;
    case UserRoleName.ADMIN:
      return AdminRole.permissions;
    case UserRoleName.USER:
      return UserRole.permissions;
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