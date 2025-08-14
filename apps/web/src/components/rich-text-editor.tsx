"use client"

import {
  Bold, Code, Columns2, Edit3, Eye, Heading1, Heading2, Heading3, Italic, LinkIcon, List,
  ListOrdered, Quote, Strikethrough, TableIcon, UnderlineIcon
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Comece a escrever...",
  className,
}: RichTextEditorProps) {
  const [mode, setMode] = React.useState<"edit" | "preview" | "split">("edit")
  const [linkUrl, setLinkUrl] = React.useState("")
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = React.useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  const addLink = React.useCallback(() => {
    if (!editor) return

    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    }

    setLinkUrl("")
    setIsLinkPopoverOpen(false)
  }, [editor, linkUrl])

  const addTable = React.useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Toggle pressed={isActive} onPressedChange={onClick} size="sm" title={title}>
      {children}
    </Toggle>
  )

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* View Mode */}
          <div className="flex items-center gap-1 mr-2">
            <Toggle pressed={mode === "edit"} onPressedChange={() => setMode("edit")} size="sm" title="Editar">
              <Edit3 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={mode === "preview"}
              onPressedChange={() => setMode("preview")}
              size="sm"
              title="Visualizar"
            >
              <Eye className="h-4 w-4" />
            </Toggle>
            <Toggle pressed={mode === "split"} onPressedChange={() => setMode("split")} size="sm" title="Dividido">
              <Columns2 className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Sublinhado"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Riscado"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Código inline"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            title="Lista de tarefas"
          >
            <input type="checkbox" className="h-4 w-4" readOnly />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6" />

          {/* Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Citação"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          {/* Link */}
          <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Toggle pressed={editor.isActive("link")} size="sm" title="Link">
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <Input
                  placeholder="https://exemplo.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLink()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addLink}>
                    Adicionar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsLinkPopoverOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Table */}
          <ToolbarButton onClick={addTable} title="Inserir tabela">
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px]">
        {mode === "edit" && (
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-4"
          />
        )}

        {mode === "preview" && (
          <div
            className="prose prose-sm max-w-none p-4 min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        )}

        {mode === "split" && (
          <div className="grid grid-cols-2 min-h-[300px]">
            <div className="border-r">
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-4"
              />
            </div>
            <div
              className="prose prose-sm max-w-none p-4 bg-muted/30"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        )}
      </div>

      {/* Footer with word count */}
      <div className="border-t px-4 py-2 text-xs text-muted-foreground">
        {editor.storage.characterCount?.characters() || 0} caracteres, {editor.storage.characterCount?.words() || 0}{" "}
        palavras
      </div>
    </div>
  )
}
