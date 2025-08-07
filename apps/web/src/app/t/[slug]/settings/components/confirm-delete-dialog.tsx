"use client"

import { FormInput } from "@/components/form/input";
import { FormPassword } from "@/components/form/password";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { disableTenantSchema, DisableTenantSchema } from "@packages/schemas";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  tenantName: string;
}
export const ConfirmDeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, tenantName }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations();
  const form = useForm<DisableTenantSchema>({
    resolver: zodResolver(disableTenantSchema),
    defaultValues: {
      password: "",
      slug,
      confirmText: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const { mutate } = useApiMutation("[POST] /api/tenant/:slug/disable");
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: data, params: { slug } }, { onSuccess: () => setIsDeleteDialogOpen(false) });
  })

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t/*i18n*/("Delete Tenant")}</DialogTitle>
          <DialogDescription>
            {t/*i18n*/("Are you sure you want to delete")}{" "}
            <span className="font-semibold">{tenantName}</span> {t/*i18n*/("and all its data?")}.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t/*i18n*/("Are you sure?")}</AlertTitle>
          <AlertDescription>
            {t/*i18n*/("This action cannot be undone.")}
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 py-2">
              <FormInput
                name="confirmText"
                label={<>{t/*i18n*/("Type")} <span className="font-semibold">{tenantName}</span> {t/*i18n*/("to confirm")}</>}
                placeholder={tenantName}
                disabled={isLoading}
              />
              <FormPassword
                name="password"
                label={t/*i18n*/("Type your password to confirm")}
                disabled={isLoading}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type='button' onClick={() => setIsDeleteDialogOpen(false)} isLoading={isLoading}>
                {t/*i18n*/("Cancel")}
              </Button>
              <Button variant="destructive" isLoading={isLoading}>
                {t/*i18n*/("Delete")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}