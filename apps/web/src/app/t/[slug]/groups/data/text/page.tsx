"use client"

import { ArrowLeft, FileText, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddTextPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Criar Documento</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Digite um título para o documento..."
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
              placeholder="Comece a escrever seu documento..."
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
            Salvar Documento
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
