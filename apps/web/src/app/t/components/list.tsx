"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { usePermission } from "@/context/permission";
import { DialogType } from "@/dialogs";
import { useApiQuery } from "@/hooks/use-api-query";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";
import { ArrayElement } from "@/types/array";
import { ApiTenantGet } from "@packages/common";
import { Permission } from "@packages/permission";
import { ArrowBigRight, Building, Settings, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function TenantList() {
  const { data: tenants } = useApiQuery("[GET] /api/tenant");
  const { user } = useAuth();
  const { canTenant } = usePermission();
  const { openDialog } = useDialog();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants?.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onEdit={() => openDialog({ type: DialogType.UPDATE_TENANT, props: { tenant } })}
            role={user?.members.find((m) => m.tenantId === tenant.id)?.role.name}
            owner={user?.members.find((m) => m.tenantId === tenant.id)?.owner}
            canEdit={canTenant(tenant.slug, Permission.UPDATE_TENANT)}
          />
        ))}
        <CreateTenantCard onClick={() => openDialog({ type: DialogType.CREATE_TENANT })} />
      </div>
    </>
  )
}

type TenantCardProps = {
  canEdit: boolean;
  tenant: ArrayElement<ApiTenantGet.Response200>;
  onEdit: (tenant: ArrayElement<ApiTenantGet.Response200>) => void;
  role?: string;
  owner?: boolean;
}
function TenantCard({ tenant, onEdit, owner, canEdit }: TenantCardProps) {
  const t = useTranslations();
  return (
    <Card className={cn("overflow-hidden border-2 hover:border-primary/50 transition-all", tenant.disabledAt && "opacity-50")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5 text-muted-foreground" />
          {tenant.name} {tenant.disabledAt && <Badge className="ml-2" variant="destructive">{t/*i18n*/("Disabled")}</Badge>}
        </CardTitle>
        <CardDescription className='truncate'>{tenant.description || "Sem descrição"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{tenant.membersCount} {t/*i18n*/("Members")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {
          tenant.disabledAt && owner &&
          <Button variant="outline" size="sm" asChild>
            <Link href={`/t/reactivate/${tenant.slug}`}>
              <ArrowBigRight className="mr-2 h-4 w-4" />{t/*i18n*/("Reactivate")}
            </Link>
          </Button>
        }
        <Button variant="outline" size="sm" disabled={!!tenant.disabledAt} asChild>
          <Link href={`/t/${tenant.slug}`}>
            <ArrowBigRight className="mr-2 h-4 w-4" />
            {t/*i18n*/("Enter")}
          </Link>
        </Button>
        {
          canEdit &&
          <Button
            variant="outline"
            size="sm"
            disabled={!!tenant.disabledAt}
            onClick={() => onEdit(tenant)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t/*i18n*/("Edit")}
          </Button>
        }
      </CardFooter>
    </Card>
  )
}

function CreateTenantCard({ onClick }: { onClick: () => void }) {
  const t = useTranslations();

  return (
    <Card
      className="border-2 border-dashed hover:border-primary hover:cursor-pointer flex flex-col items-center justify-center h-full min-h-[300px]"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t/*i18n*/("Create tenant")}</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">{t/*i18n*/("Create a new tenant to access the platform")}</p>
      </CardContent>
    </Card>
  )
}
