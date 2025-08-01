"use client";
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormTextarea } from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTenantSchema, CreateTenantSchema, UpdateTenantSchema } from '@packages/schemas';

import { DialogType } from './';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export interface TenantDialogProps {
  tenant?: UpdateTenantSchema
}
export function CreateOrUpdateTenantDialog({ tenant }: TenantDialogProps) {
  const { closeDialog } = useDialog();
  const isEditing = !!tenant;
  const t = useTranslations();
  const defaultValues: Partial<CreateTenantSchema> = {
    name: tenant?.name || "",
    slug: tenant?.slug || "",
    description: tenant?.description || "",
  }

  const form = useForm<CreateTenantSchema>({ resolver: zodResolver(createTenantSchema), defaultValues });

  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate } = isEditing ? useApiMutation("[PUT] /api/tenant") : useApiMutation("[POST] /api/tenant");
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: { ...data, id: tenant?.id || "" } }, {
      onSuccess: () => {
        invalidate("[GET] /api/tenant", "[GET] /api/user/self");
        closeDialog(isEditing ? DialogType.UPDATE_TENANT : DialogType.CREATE_TENANT);
      }
    });
  });

  const watchName = form.watch("name")

  useEffect(() => {
    if (watchName && !isEditing) form.setValue("slug", generateSlug(watchName))
  }, [watchName, isEditing])

  useEffect(() => {
    form.reset(defaultValues);
  }, [tenant, form, isEditing]);

  return (
    <ScrollArea className='max-h-[90vh] pr-3'>
      <div className='p-1'>
        <DialogHeader>
          <DialogTitle>{isEditing ? t/*i18n*/("Edit tenant") : t/*i18n*/("Create tenant")}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t/*i18n*/("Change the information below to update the tenant")
              : t/*i18n*/("Create a new tenant")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormInput name="name" label={t/*i18n*/("Name")} />
            <FormInput name="slug" label={t/*i18n*/("Tenant URL")} disabled={isEditing} />
            <FormTextarea name='description' label={t/*i18n*/("Description")} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog(tenant ? DialogType.UPDATE_TENANT : DialogType.CREATE_TENANT)}
              >
                {t/*i18n*/("Cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t/*i18n*/("Save changes") : t/*i18n*/("Create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}
