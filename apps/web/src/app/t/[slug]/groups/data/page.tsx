"use client"

import { Clipboard, File, FileText, Plus, UploadCloud } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ColumnDef } from "@tanstack/react-table";

type Props = {
  groups: string[]
  slug: string
}
export default function DataPage({ groups, slug }: Props) {

  const [status, setStatus] = React.useState<"Todos" | "Pendente" | "Indexando" | "Erro" | "Sucesso">("Todos")
  const [q, setQ] = React.useState("")

  const filteredEntries: any = []

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Título",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.type === "file" ? (
              <File className="h-4 w-4 opacity-70" />
            ) : row.original.type === "text" ? (
              <FileText className="h-4 w-4 opacity-70" />
            ) : (
              <Clipboard className="h-4 w-4 opacity-70" />
            )}
            <div>
              <span className="font-medium">{row.original.title}</span>
              {row.original.content && (
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {row.original.content.replace(/<[^>]*>/g, "").slice(0, 60)}...
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: "Tipo",
        accessorKey: "type",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.type === "file" ? "Arquivo" : row.original.type === "text" ? "Documento" : "Colado"}
          </Badge>
        ),
      },
      { header: "Adicionado em", accessorKey: "uploadedAt", cell: ({ row }) => moment(row.original.uploadedAt).format("DD/MM/YYYY HH:mm:ss") },
    ],
    [],
  )
  const baseUrl = `/t/${slug}/${groups.join("/")}/-/data/`
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dados</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={baseUrl + "text"} className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Documento
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={baseUrl + "paste"} className="flex items-center">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Colar Texto
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total de entradas</div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Indexando</div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Concluídos</div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <DropArea onFiles={console.log} />

      <div className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={status} onValueChange={(v) => setStatus(v as any)}>
          <TabsList>
            {["Todos", "Pendente", "Indexando", "Erro", "Sucesso"].map((s) => (
              <TabsTrigger key={s} value={s as any}>
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
          <Badge variant="secondary">{filteredEntries.length} itens</Badge>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEntries}
        searchableColumnId="title"
        placeholder="Buscar por título..."
        pageSize={8}
      />
    </div>
  )
}

function DropArea({
  onFiles,
  isLoading,
}: {
  onFiles: (files: File[]) => void
  isLoading?: boolean
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => onFiles(acceptedFiles),
  })

  return (
    <div
      {...getRootProps()}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
        isDragActive ? "border-foreground/40 bg-accent/30" : "border-border"
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="text-sm">Arraste e solte arquivos aqui, ou clique para selecionar</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Suporta múltiplos arquivos: textos, áudios, fotos, vídeos e links
      </p>
      {isLoading ? <p className="mt-2 text-xs">Enviando...</p> : null}
    </div>
  )
}
