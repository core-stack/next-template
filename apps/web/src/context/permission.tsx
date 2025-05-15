"use client"
import { useParams } from "next/navigation";
import React from "react";

import { trpc } from "@/lib/trpc/client";
import { can as canPermission, getRolePermissions, Permission } from "@packages/permission";

type PermissionContextType = {
  can: (permission: Permission | Permission[]) => boolean;
  canWorkspace: (workspaceSlug: string, permission: Permission | Permission[]) => boolean;
}
export const PermissionContext = React.createContext<PermissionContextType>({
  can: () => false,
  canWorkspace: () => false,
});

export const usePermission = () => React.useContext(PermissionContext);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: user } = trpc.user.self.useQuery();
  const permissions = user?.members.map((member) => ({
    workspaceId: member.workspaceId,
    role: member.role,
    slug: member.workspace.slug,
    permissions: getRolePermissions(member.role)
  }));

  const canWorkspace = (workspaceSlug: string, permission: Permission | Permission[]): boolean => {
    if (permissions) {
      return canPermission(
        permissions.find((p) => p.slug === workspaceSlug)?.permissions ?? [],
        Array.isArray(permission) ? permission : [permission]
      );
    }
    return false;
  }
  const can = (permission: Permission | Permission[]): boolean => canWorkspace(slug, permission);

  return (
    <PermissionContext.Provider value={{ can, canWorkspace }}>
      {children}
    </PermissionContext.Provider>
  )
}