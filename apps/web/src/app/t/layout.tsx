import { AuthProvider } from "@/context/auth";
import { PermissionProvider } from "@/context/permission";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PermissionProvider>
        {children}
      </PermissionProvider>
    </AuthProvider>
  );
}