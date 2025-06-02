import { Permission } from "./types";

export const can = (userPermissions: Permission[], requiredPermissions: Permission[]) => {
  return requiredPermissions.every((requiredPermission) => userPermissions.includes(requiredPermission));
}

export * from "./types";
export * from "./roles";