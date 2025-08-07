"use client"

import { FormInput } from "@/components/form/input";
import { FormTextarea } from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useApiInvalidate } from "@/hooks/use-api-invalidate";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiTenantSlugGet } from "@packages/common";
import { updateTenantSchema, UpdateTenantSchema } from "@packages/schemas";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

interface TenantSettingsFormProps {
  tenant: ApiTenantSlugGet.Response200
}

export function TenantSettingsForm({ tenant }: TenantSettingsFormProps) {
  const isEditing = !!tenant
  const defaultValues: Partial<UpdateTenantSchema> = {
    name: tenant?.name || "",
    slug: tenant?.slug || "",
    description: tenant?.description || ""
  }
  const t = useTranslations();
  const form = useForm<UpdateTenantSchema>({ resolver: zodResolver(updateTenantSchema), defaultValues });
  const { mutate } = useApiMutation("[PUT] /api/tenant");
  const invalidate = useApiInvalidate();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: data }, {
      onSuccess: async () => {
        form.reset(data);
        await invalidate("[GET] /api/tenant", "[GET] /api/tenant/:slug");
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t/*i18n*/("Settings")}</CardTitle>
        <CardDescription>{t/*i18n*/("Update your workspace settings")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormInput
              name="name"
              label={t/*i18n*/("Name")}
              placeholder={t/*i18n*/("Workspace name")}
            />
            <FormInput
              name="slug"
              label={t/*i18n*/("Slug")}
              placeholder={t/*i18n*/("Workspace name")}
              disabled={isEditing}
            />
            <FormTextarea
              name="description"
              label={t/*i18n*/("Description")}
              placeholder={t/*i18n*/("Workspace description")}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                {t/*i18n*/("Cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                {t/*i18n*/("Save changes")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
