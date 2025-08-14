"use client"

import { ArrowLeft, Clipboard, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PasteText() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      // Convert plain text to basic HTML
      const htmlContent = text
        .split("\n")
        .map((line) => `<p>${line || "<br>"}</p>`)
        .join("")
      setContent(htmlContent)
      if (!title) {
        // Auto-gerar título baseado no início do texto
        const firstLine = text.split("\n")[0].slice(0, 50)
        setTitle(firstLine + (text.length > 50 ? "..." : ""))
      }
    } catch (err) {
      toast({
        title: "Erro ao colar",
        description: "Não foi possível acessar a área de transferência.",
        variant: "destructive",
      })
    }
  }

  const canSave = content.trim().length > 0

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Clipboard className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Colar Texto</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Colar da área de transferência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={pasteFromClipboard}>
              <Clipboard className="mr-2 h-4 w-4" />
              Colar da área de transferência
            </Button>
            <span className="text-xs text-muted-foreground">ou cole manualmente no editor abaixo</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Digite um título para o texto..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Cole seu texto aqui (Ctrl+V) ou use o botão acima..."
              className="min-h-[400px]"
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
