import { useTranslations } from 'next-intl';



import { TenantPage } from '../components/tenant-page';
import { GroupsList } from './components/groups-list';

export default function GroupsPage() {
  const t = useTranslations();
  return (
    <TenantPage title={t/*i18n*/("Groups")}>
      <GroupsList />
    </TenantPage>
  )
}