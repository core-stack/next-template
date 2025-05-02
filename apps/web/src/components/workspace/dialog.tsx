import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSubmit } from "@/hooks/use-submit";
import { cn } from "@/lib/utils";
import { WorkspaceSchema, workspaceSchema } from "@/validation/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ChromePicker } from "react-color";

interface WorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace?: any | null
}

export function WorkspaceDialog({ open, onOpenChange, workspace }: WorkspaceDialogProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const isEditing = !!workspace

  const form = useSubmit<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace?.name || "",
      slug: workspace?.slug || "",
      description: workspace?.description || "",
      backgroundType: "gradient",
      backgroundColor: "#6366f1",
      backgroundGradient: "linear-gradient(to right, #6366f1, #a855f7)",
    },
    submitTo: "/api/workspace",
    beforeSubmit: (data) => {
      if (data.backgroundType === "color" && !data.backgroundColor) {
        data.backgroundColor = "#6366f1"
      } else if (data.backgroundType === "gradient" && !data.backgroundGradient) {
        data.backgroundGradient = "linear-gradient(to right, #6366f1, #a855f7)"
      }
      return data;
    },
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  const isLoading = form.formState.isSubmitting;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const watchName = form.watch("name")
  const watchSlug = form.watch("slug")

  if (watchName && !watchSlug && !isEditing) {
    form.setValue("slug", generateSlug(watchName))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Organização" : "Criar Organização"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da sua organização"
              : "Preencha as informações para criar uma nova organização"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.onSubmit} className="space-y-6">
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
                  <FormLabel>URL da Organização</FormLabel>
                  <FormControl>
                    <Input placeholder="minha-empresa" {...field} />
                  </FormControl>
                  <FormDescription>
                    O slug é usado na URL da organização. Apenas letras minúsculas, números e hífens.
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
                      placeholder="Descreva o propósito desta organização"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Uma breve descrição sobre sua organização.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aparência</FormLabel>
                  <FormControl>
                    <Tabs defaultValue={field.value} className="w-full" onValueChange={field.onChange}>
                      <TabsList className="grid grid-cols-3 mb-2">
                        <TabsTrigger value="color">Cor</TabsTrigger>
                        <TabsTrigger value="gradient">Gradiente</TabsTrigger>
                      </TabsList>

                      <TabsContent value="color" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="backgroundColor"
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
                                        <div className="h-4 w-4 rounded mr-2" style={{ background: field.value }} />
                                        <span>{field.value}</span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <ChromePicker
                                        color={field.value}
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
                          name="backgroundGradient"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="grid gap-4">
                                  <div className="h-20 w-full rounded-md" style={{ background: field.value }} />
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
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Salvar alterações" : "Criar organização"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
