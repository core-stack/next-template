"use client"

import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormSelect } from '@/components/form/select';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLES } from '@packages/permission';
import { InviteMemberSchema, inviteMemberSchema } from '@packages/schemas';

import { DialogType } from './';

export function InviteMemberDialog() {
  const invalidate = useApiInvalidate();
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations();
  const form = useForm<InviteMemberSchema>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      emails: [{ email: "", role: ROLES.global.user.key }],
      slug
    },
  });
  const { closeDialog } = useDialog();
  const isLoading = form.formState.isSubmitting;

  const { fields, remove, insert } = useFieldArray({ control: form.control, name: "emails" })
  const removeField = (index: number) => remove(index);
  const addField = (index: number) => insert(index + 1, { email: "", role: "WORKSPACE_MEMBER" });

  const { mutate } = useApiMutation("[POST] /api/tenant/:slug/invite");
  async function onSubmit(data: InviteMemberSchema) {
    data.slug = slug;
    mutate({ body: data, params: { slug } }, {
      onSuccess: () => {
        invalidate("[GET] /api/tenant/:slug");
        form.reset();
        closeDialog(DialogType.INVITE_MEMBER);
      }
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t/*i18n*/("Invite member")}</DialogTitle>
        <DialogDescription>{t/*i18n*/("Send an invite to a member")}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {
            fields.map((field, index) => (
              <div className='grid grid-cols-5 gap-2' key={field.id}>
                <FormInput
                  name={`emails.${index}.email`}
                  label={t/*i18n*/("Email")}
                />
                <FormSelect
                  name={`emails.${index}.role`}
                  label={t/*i18n*/("Role")}
                  data={ROLES.tenant.default.map(role => ({ label: role.name, value: role.key }))}
                />
                <div className='flex items-end gap-1'>
                  <Button type="button" size="icon" variant="outline" onClick={() => addField(index)}>
                    <PlusCircle />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    disabled={index === 0 && fields.length === 1}
                    variant="destructive-outline"
                    onClick={() => removeField(index)}
                  >
                    <MinusCircle />
                  </Button>
                </div>
              </div>
            ))
          }

          <DialogFooter>
            <Button type="button" variant="outline" isLoading={isLoading} onClick={() => closeDialog(DialogType.INVITE_MEMBER)}>
              {t/*i18n*/("Cancel")}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t/*i18n*/("Invite")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
