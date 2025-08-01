import { useTranslations } from 'next-intl';

export function TenantHead() {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{t/*i18n*/("Tenants")}</h1>
      <p className="text-muted-foreground mt-1">{t/*i18n*/("Manage your tenants")}</p>
    </>
  )
}