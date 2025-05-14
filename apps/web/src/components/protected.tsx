"use client";

import { usePermission } from "@/context/permission";
import { Permission } from "@packages/permission";

type ProtectedProps = {
  children: React.ReactNode;
  permissions: Permission | Permission[];
  fallback?: React.ReactNode;
}
export const Protected = ({ children, permissions, fallback }: ProtectedProps) => {
  const { can } = usePermission();

  if (!can(permissions)) return fallback ?? null;
  return children;
}