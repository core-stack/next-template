"use client";
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { PageTitle } from '../components/tenant-page';
import { GroupsList } from './components/groups-list';

export default function GroupsPage() {
  const t = useTranslations();
  const { openDialog } = useDialog();
  return (
    <>
      <div className='flex items-center justify-between'>
        <PageTitle title={t/*i18n*/("Groups")} />
        <Button onClick={() => openDialog({ type: DialogType.CREATE_GROUP })}>
          {t/*i18n*/("Create Group")}
        </Button>
      </div>
      <GroupsList />
    </>
  )
}