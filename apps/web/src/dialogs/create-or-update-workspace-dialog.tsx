import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/hooks/use-dialog";
import { trpc } from "@/lib/trpc/client";
import { createWorkspaceSchema, CreateWorkspaceSchema } from "@/lib/trpc/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceSchema } from "@packages/prisma";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { useForm } from "react-hook-form";

import { DialogType } from "./";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export interface WorkspaceDialogProps {
  workspace?: WorkspaceSchema
}
const splitBackgroundProps = (image: string) => {
  return {
    type: image.includes("#") ? "color" : "gradient",
    value: image
  }
}
export function CreateOrUpdateWorkspaceDialog({ workspace }: WorkspaceDialogProps) {
  const { closeDialog } = useDialog();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundType, setBackgroundType] = useState(
    splitBackgroundProps(workspace?.backgroundImage || "").type
  );
  const isEditing = !!workspace
  const defaultValues: Partial<CreateWorkspaceSchema> = {
    name: workspace?.name || "",
    slug: workspace?.slug || "",
    description: workspace?.description || "",
    backgroundImage: workspace?.backgroundImage || "",
  }

  const form = useForm<CreateWorkspaceSchema>({ resolver: zodResolver(createWorkspaceSchema), defaultValues });

  const isLoading = form.formState.isSubmitting;
  const utils = trpc.useUtils();
  const { mutate } = isEditing ? trpc.workspace.update.useMutation() : trpc.workspace.create.useMutation();
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ ...data, id: workspace?.id || "" }, {
      onSuccess: () => {
        utils.workspace.get.invalidate();
        utils.user.self.invalidate();
        closeDialog(workspace ? DialogType.UPDATE_WORKSPACE : DialogType.CREATE_WORKSPACE);
      }
    });
  });

  const watchName = form.watch("name")

  useEffect(() => {
    if (watchName && !isEditing) form.setValue("slug", generateSlug(watchName))
  }, [watchName, isEditing])

  useEffect(() => {
    form.reset(defaultValues);
  }, [workspace, form, isEditing]);

  return (
    <ScrollArea className='max-h-[90vh] pr-3'>
      <div className='p-1'>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar workspace" : "Criar workspace"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do ser workspace"
              : "Preencha as informações para criar um novo workspace"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Organização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Minha Empresa" {...field} />
                  </FormControl>
                  <FormDescription>Este é o nome que será exibido para todos os membros.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do workspace</FormLabel>
                  <FormControl>
                    <Input placeholder="minha-empresa" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormDescription>
                    O slug é usado na URL do workspace. Apenas letras minúsculas, números e hífens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito deste workspace"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Uma breve descrição sobre seu workspace.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Aparência</FormLabel>
              <FormControl>
                <Tabs value={backgroundType} className="w-full" onValueChange={setBackgroundType}>
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="color">Cor</TabsTrigger>
                    <TabsTrigger value="gradient">Gradiente</TabsTrigger>
                  </TabsList>

                  <TabsContent value="color" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="backgroundImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn("w-[240px] justify-start text-left font-normal")}
                                  >
                                    <div className="h-4 w-4 rounded mr-2" style={{ background: field.value ?? undefined }} />
                                    <span>{field.value}</span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <ChromePicker
                                    color={field.value ?? undefined}
                                    onChange={(color) => {
                                      field.onChange(color.hex)
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="gradient" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="backgroundImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid gap-4">
                              <div className="h-20 w-full rounded-md" style={{ background: field.value ?? undefined }} />
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #6366f1, #a855f7)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #6366f1, #a855f7)")}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #0ea5e9, #22d3ee)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #0ea5e9, #22d3ee)")}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #f59e0b, #f97316)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #f59e0b, #f97316)")}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #10b981, #14b8a6)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #10b981, #14b8a6)")}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #ec4899, #f43f5e)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #ec4899, #f43f5e)")}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-10 w-full p-0"
                                  style={{ background: "linear-gradient(to right, #8b5cf6, #d946ef)" }}
                                  onClick={() => field.onChange("linear-gradient(to right, #8b5cf6, #d946ef)")}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog(workspace ? DialogType.UPDATE_WORKSPACE : DialogType.CREATE_WORKSPACE)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Salvar alterações" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}
