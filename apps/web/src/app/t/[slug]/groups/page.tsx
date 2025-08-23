"use client";
import { useTranslations } from 'next-intl';

import { Page } from '@/components/page';
import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { GroupsList } from './components/groups-list';

export default function GroupsPage() {
  const t = useTranslations();
  const { openDialog } = useDialog();
  return (
    <Page.Root>
      <Page.Header>
        <Page.Title title={t/*i18n*/("Groups")} />
        <Button onClick={() => openDialog({ type: DialogType.CREATE_GROUP })}>
          {t/*i18n*/("Create Group")}
        </Button>
      </Page.Header>
      <GroupsList />
    </Page.Root>
  )
}