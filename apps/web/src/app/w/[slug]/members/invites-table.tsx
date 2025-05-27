import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkspace } from "@/hooks/use-workspace";
import { RouterOutput } from "@/lib/trpc/app.router";
import { trpc } from "@/lib/trpc/client";
import { ArrayElement } from "@/types/array";
import {
  ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable, VisibilityState
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

export const InvitesTable = () => {
  const { isOwner, slug } = useWorkspace();
  const { data: invites = [] } = trpc.invite.getByWorkspace.useQuery({ slug });
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({});
  const utils = trpc.useUtils();
  const { mutate } = trpc.invite.delete.useMutation();

  const inviteColumns: ColumnDef<ArrayElement<RouterOutput["invite"]["getByWorkspace"]>>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Função
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("role") === "ADMIN" ? "Admin" : "Membro"}</span>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Data do convite
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = new Date(row.getValue("createdAt"))
        const formatted = new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "medium",
        }).format(createdAt)
        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "expiresAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Data de expiração
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const expiresAt = new Date(row.getValue("expiresAt"))
        const formatted = new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "medium",
        }).format(expiresAt)
        return <div>{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return isOwner ? (
          <div className="text-right">
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => {
                mutate({
                  id: row.original.id,
                  slug,
                }, { onSuccess: () => utils.invite.getByWorkspace.invalidate() })
              }}
            >
              Cancelar
            </Button>
          </div>
        ) : null
      },
    },
  ]

  const invitesTable = useReactTable({
    data: invites,
    columns: inviteColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      {invites.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">Nenhum convite pendente</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {invitesTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {invitesTable.getRowModel().rows?.length ? (
                  invitesTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={inviteColumns.length} className="h-24 text-center">
                      Nenhum convite encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {invitesTable.getFilteredRowModel().rows.length} convite(s) no total.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => invitesTable.previousPage()}
                disabled={!invitesTable.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => invitesTable.nextPage()}
                disabled={!invitesTable.getCanNextPage()}
              >
                Próximo
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}