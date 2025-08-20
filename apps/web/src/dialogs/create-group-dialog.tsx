"use client";
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormTextarea } from '@/components/form/textarea';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema, CreateGroupSchema, GroupSchema } from '@packages/schemas';

import { DialogType } from './';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export interface TenantDialogProps {
  group?: GroupSchema
}
export function CreateOrUpdateGroupDialog({ group }: TenantDialogProps) {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const groups = searchParams.get("path")?.split("/").filter(Boolean) || [];
  const { closeDialog } = useDialog();
  const isEditing = !!group;
  const t = useTranslations();
  const defaultValues: Partial<CreateGroupSchema> = {
    name: group?.name || "",
    slug: group?.slug || "",
    description: group?.description || "",
    path: group?.path ?? searchParams.get("path") ?? "",
  }

  const form = useForm<CreateGroupSchema>({ resolver: zodResolver(createGroupSchema), defaultValues });

  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate } = isEditing ? useApiMutation("[PUT] /api/tenant/:slug/group") : useApiMutation("[POST] /api/tenant/:slug/group");
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: { ...data, id: group?.id || "" }, params: { slug } }, {
      onSuccess: () => {
        invalidate("[GET] /api/tenant/:slug/group");
        invalidate("[GET] /api/user/self");
        closeDialog(isEditing ? DialogType.UPDATE_GROUP : DialogType.CREATE_GROUP);
      }
    });
  });

  const watchName = form.watch("name");

  useEffect(() => {
    if (watchName && !isEditing) form.setValue("slug", generateSlug(watchName))
  }, [watchName, isEditing]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [group, form, isEditing]);

  return (
    <ScrollArea className='max-h-[90vh] pr-3'>
      <div className='p-1'>
        <DialogHeader>
          <DialogTitle>{isEditing ? t/*i18n*/("Edit group") : t/*i18n*/("Create group")}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t/*i18n*/("Change the information below to update the group")
              : t/*i18n*/("Create a new group")}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <span className='text-muted-foreground text-sm'>{t/*i18n*/("Your group will be creating in")}:</span>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                Groups
              </BreadcrumbItem>
              { groups.length > 0 && ( <BreadcrumbSeparator /> ) }
              {
                groups.map((group, index) => (
                  <React.Fragment key={group}>
                    <BreadcrumbItem>
                      {group}
                    </BreadcrumbItem>
                    {
                      index + 1 !== groups.length && (
                        <BreadcrumbSeparator />
                      )
                    }
                  </React.Fragment>
                ))
              }
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormInput name="name" label={t/*i18n*/("Name")} />
            <FormInput name="slug" label={t/*i18n*/("Group URL")} disabled={isEditing} />
            <FormTextarea name='description' label={t/*i18n*/("Description")} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog(group ? DialogType.UPDATE_GROUP : DialogType.CREATE_GROUP)}
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
