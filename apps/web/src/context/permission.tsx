"use client"
import { trpc } from "@/lib/trpc/client";
import { can as canPermission, Permission } from "@packages/permission";
import { useParams } from "next/navigation";
import React from "react";

type PermissionContextType = {
  can: (permission: Permission | Permission[]) => boolean;
  canWorkspace: (workspaceSlug: string, permission: Permission | Permission[]) => boolean;
}
export const PermissionContext = React.createContext<PermissionContextType>({
  can: () => false,
  canWorkspace: () => false,
});

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: user } = trpc.user.self.useQuery();
  const permissions = user?.members.map((member) => ({
    workspaceId: member.workspaceId,
    role: member.role,
    slug: member.workspace.slug
  }));

  const canWorkspace = (workspaceSlug: string, permission: Permission | Permission[]): boolean => {
    if (permissions) {
      return canPermission(
        permissions.find((p) => p.slug === workspaceSlug)?.role.permissions ?? [],
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

export const usePermission = () => {
  const ctx = React.useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within a PermissionProvider");
  return ctx;
}
