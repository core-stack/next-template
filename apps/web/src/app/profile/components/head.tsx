import { useTranslations } from 'next-intl';

export const ProfileHead = () => {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{t/*i18n*/("Profile")}</h1>
      <p className="text-muted-foreground mt-1">{t/*i18n*/("Manage your personal information")}</p>
    </>
  )
}