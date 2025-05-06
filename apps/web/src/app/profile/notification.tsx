"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { NotificationsSchema, notificationsSchema } from "@/lib/trpc/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export const UpdateSettings = () => {
  const form = useForm<NotificationsSchema>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    },
  })

  const isLoading = form.formState.isSubmitting;
  const onSubmit = form.handleSubmit(data => {

  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>Escolha quais notificações você deseja receber.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notificações por Email</FormLabel>
                  <FormDescription>
                    Receba notificações sobre atividades em seus workspaces por email.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Emails de Marketing</FormLabel>
                  <FormDescription>Receba emails sobre novos recursos, dicas e promoções.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="securityAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Alertas de Segurança</FormLabel>
                  <FormDescription>
                    Receba notificações sobre atividades suspeitas ou alterações importantes na sua conta.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
            <CardFooter className="flex justify-end">
              <Button type="submit"disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}