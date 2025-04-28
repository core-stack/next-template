"use client"

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

const workspaceSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().optional(),
  backgroundType: z.enum(["color", "gradient", "image"]),
  backgroundColor: z.string().optional(),
  backgroundGradient: z.string().optional(),
  backgroundImage: z.string().optional(),
})

type WorkspaceFormValues = z.infer<typeof workspaceSchema>

interface WorkspaceSettingsFormProps {
  workspace: {
    id: string
    slug: string
    name: string
    description?: string | null
    backgroundImage?: string
  }
}

export function WorkspaceSettingsForm({ workspace }: WorkspaceSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Determinar o tipo de fundo atual
  let initialBackgroundType = "gradient"
  if (workspace.backgroundImage?.startsWith("#")) {
    initialBackgroundType = "color"
  } else if (workspace.backgroundImage?.startsWith("http")) {
    initialBackgroundType = "image"
  }

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description || "",
      backgroundType: initialBackgroundType as any,
      backgroundColor: workspace.backgroundImage?.startsWith("#") ? workspace.backgroundImage : "#6366f1",
      backgroundGradient:
        !workspace.backgroundImage?.startsWith("#") && !workspace.backgroundImage?.startsWith("http")
          ? workspace.backgroundImage
          : "linear-gradient(to right, #6366f1, #a855f7)",
      backgroundImage: workspace.backgroundImage?.startsWith("http") ? workspace.backgroundImage : "",
    },
  })

  async function onSubmit(data: WorkspaceFormValues) {
    setIsLoading(true)

    try {
      // Determinar o valor final do backgroundImage com base no tipo selecionado
      let finalBackground = ""

      if (data.backgroundType === "color") {
        finalBackground = data.backgroundColor || "#6366f1"
      } else if (data.backgroundType === "gradient") {
        finalBackground = data.backgroundGradient || "linear-gradient(to right, #6366f1, #a855f7)"
      } else {
        finalBackground = data.backgroundImage || ""
      }

      // Preparar os dados para salvar
      const workspaceData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        backgroundImage: finalBackground,
      }

      console.log("Atualizando workspace:", workspaceData)
      // Aqui você implementaria a lógica para atualizar o workspace
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Erro ao salvar workspace:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Organização</CardTitle>
        <CardDescription>Atualize as informações e aparência da sua organização.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <TabsTrigger value="image">Imagem</TabsTrigger>
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

                      <TabsContent value="image" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="backgroundImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="URL da imagem (https://...)" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormDescription>Insira a URL de uma imagem para usar como fundo.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {form.watch("backgroundImage") && (
                          <div
                            className="h-32 w-full rounded-md bg-cover bg-center"
                            style={{ backgroundImage: `url(${form.watch("backgroundImage")})` }}
                          />
                        )}
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar alterações
        </Button>
      </CardFooter>
    </Card>
  )
}
