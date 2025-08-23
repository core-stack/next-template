"use client"
import { Page } from '@/components/page';
import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { SourceTable } from './components/table';

export default function SourcePage() {
  const { openDialog } = useDialog();
  return (
    <Page.Root>
      <Page.Header>
        <Page.Title title="Sources" />
        <Button onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
          Create
        </Button>
      </Page.Header>
      <Page.Content>
        <SourceTable />
      </Page.Content>
    </Page.Root>
  )
}