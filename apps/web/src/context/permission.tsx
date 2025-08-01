"use client"
import { can as canPermission, Permission } from "@packages/permission";
import { useParams } from "next/navigation";
import React from "react";

import { useAuth } from "./auth";

type PermissionContextType = {
  can: (permission: Permission | Permission[]) => boolean;
  canTenant: (tenantSlug: string, permission: Permission | Permission[]) => boolean;
}
export const PermissionContext = React.createContext<PermissionContextType>({
  can: () => false,
  canTenant: () => false,
});

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const permissions = user?.members.map((member) => ({
    tenantId: member.tenantId,
    role: member.role,
    slug: member.tenant.slug
  }));

  const canTenant = (tenantSlug: string, permission: Permission | Permission[]): boolean => {
    if (permissions) {
      return canPermission(
        permissions.find((p) => p.slug === tenantSlug)?.role.permissions ?? [],
        Array.isArray(permission) ? permission : [permission]
      );
    }
    return false;
  }
  const can = (permission: Permission | Permission[]): boolean => canTenant(slug, permission);

  return (
    <PermissionContext.Provider value={{ can, canTenant }}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => {
  const ctx = React.useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within a PermissionProvider");
  return ctx;
}
