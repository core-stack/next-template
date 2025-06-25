"use client"

import { Building } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

export function CreateTenantButton() {
  const { openDialog } = useDialog();
  const t = useTranslations();
  return (
    <>
      <Button onClick={() => openDialog({ type: DialogType.CREATE_TENANT })}>
        <Building className="mr-2 h-4 w-4" />
        {t/*i18n*/("Create Tenant")}
      </Button>
    </>
  )
}
