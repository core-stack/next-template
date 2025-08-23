"use client"
import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { SourceTable } from './components/table';

export default function Page() {
  const { openDialog } = useDialog();
  return (
    <div>
      <Button onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
        Create
      </Button>
      <SourceTable />
    </div>
  )
}