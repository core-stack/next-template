"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable, VisibilityState
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";

import { InviteMemberDialog } from "./invite-member-dialog";

// Tipos baseados no schema do Prisma
type Role = "ADMIN" | "MEMBER"

interface Member {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  role: Role
  owner: boolean
  joinedAt: Date
}

interface Invite {
  id: string
  email: string
  role: Role
  createdAt: Date
}

// Dados de exemplo - em produção, estes viriam do backend
const mockMembers: Member[] = [
  {
    id: "1",
    userId: "user1",
    user: {
      id: "user1",
      name: "João Silva",
      email: "joao@exemplo.com",
      image: null,
    },
    role: "ADMIN",
    owner: true,
    joinedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    userId: "user2",
    user: {
      id: "user2",
      name: "Maria Oliveira",
      email: "maria@exemplo.com",
      image: null,
    },
    role: "ADMIN",
    owner: false,
    joinedAt: new Date("2023-02-10"),
  },
  {
    id: "3",
    userId: "user3",
    user: {
      id: "user3",
      name: "Carlos Santos",
      email: "carlos@exemplo.com",
      image: null,
    },
    role: "MEMBER",
    owner: false,
    joinedAt: new Date("2023-03-05"),
  },
  {
    id: "4",
    userId: "user4",
    user: {
      id: "user4",
      name: "Ana Pereira",
      email: "ana@exemplo.com",
      image: null,
    },
    role: "MEMBER",
    owner: false,
    joinedAt: new Date("2023-04-20"),
  },
  {
    id: "5",
    userId: "user5",
    user: {
      id: "user5",
      name: "Roberto Almeida",
      email: "roberto@exemplo.com",
      image: null,
    },
    role: "MEMBER",
    owner: false,
    joinedAt: new Date("2023-05-12"),
  },
  {
    id: "6",
    userId: "user6",
    user: {
      id: "user6",
      name: "Fernanda Lima",
      email: "fernanda@exemplo.com",
      image: null,
    },
    role: "MEMBER",
    owner: false,
    joinedAt: new Date("2023-06-08"),
  },
]

const mockInvites: Invite[] = [
  {
    id: "1",
    email: "pedro@exemplo.com",
    role: "MEMBER",
    createdAt: new Date("2023-08-15"),
  },
  {
    id: "2",
    email: "lucia@exemplo.com",
    role: "ADMIN",
    createdAt: new Date("2023-08-16"),
  },
  {
    id: "3",
    email: "marcos@exemplo.com",
    role: "MEMBER",
    createdAt: new Date("2023-08-17"),
  },
  {
    id: "4",
    email: "julia@exemplo.com",
    role: "MEMBER",
    createdAt: new Date("2023-08-18"),
  },
]

const isOwner = true
export default function MembersList() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [invites, setInvites] = useState<Invite[]>(mockInvites)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeTab, setActiveTab] = useState("members")

  const handleRoleChange = (memberId: string, newRole: Role) => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  const handleCancelInvite = (inviteId: string) => {
    setInvites(invites.filter((invite) => invite.id !== inviteId))
  }

  const handleInviteMember = (email: string, role: Role) => {
    const newInvite: Invite = {
      id: `invite-${invites.length + 1}`,
      email,
      role,
      createdAt: new Date(),
    }
    setInvites([...invites, newInvite])
    setIsInviteDialogOpen(false)
  }

  // Definição das colunas para a tabela de membros
  const memberColumns: ColumnDef<Member>[] = [
    {
      accessorKey: "user.name",
      header: "Usuário",
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.user.image || undefined} />
              <AvatarFallback>{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{member.user.name}</div>
              <div className="text-sm text-muted-foreground">{member.user.email}</div>
            </div>
            {member.owner && (
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                Proprietário
              </Badge>
            )}
          </div>
        )
      },
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
        const member = row.original
        return member.owner ? (
          <span className="font-medium">Admin</span>
        ) : (
          <Select
            defaultValue={member.role}
            onValueChange={(value: Role) => handleRoleChange(member.id, value)}
            disabled={!isOwner}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Membro</SelectItem>
            </SelectContent>
          </Select>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "joinedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Data de entrada
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const joinedAt = new Date(row.getValue("joinedAt"))
        const formatted = new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "medium",
        }).format(joinedAt)
        return <div>{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original
        return !member.owner && isOwner ? (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remover da organização
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null
      },
    },
  ]

  // Definição das colunas para a tabela de convites
  const inviteColumns: ColumnDef<Invite>[] = [
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
      id: "actions",
      cell: ({ row }) => {
        const invite = row.original
        return isOwner ? (
          <div className="text-right">
            <Button variant="ghost" size="sm" onClick={() => handleCancelInvite(invite.id)}>
              Cancelar
            </Button>
          </div>
        ) : null
      },
    },
  ]

  // Configuração da tabela de membros
  const membersTable = useReactTable({
    data: members,
    columns: memberColumns,
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
  })

  // Configuração da tabela de convites
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
  })

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Membros da Organização</CardTitle>
            <CardDescription>Gerencie os membros e convites da sua organização</CardDescription>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Convidar
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="members">Membros ({members.length})</TabsTrigger>
                <TabsTrigger value="invites">Convites ({invites.length})</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {activeTab === "members" && (
                  <>
                    <Input
                      placeholder="Filtrar por nome..."
                      value={(membersTable.getColumn("user.name")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => membersTable.getColumn("user.name")?.setFilterValue(event.target.value)}
                      className="max-w-sm"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                          Filtrar por função <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                          checked={
                            Array.isArray(membersTable.getColumn("role")?.getFilterValue())
                              ? (membersTable.getColumn("role")?.getFilterValue() as string[]).includes("ADMIN")
                              : false
                          }
                          onCheckedChange={(checked) => {
                            const filterValue = (membersTable.getColumn("role")?.getFilterValue() as string[]) || []
                            if (checked) {
                              membersTable.getColumn("role")?.setFilterValue([...filterValue, "ADMIN"])
                            } else {
                              membersTable
                                .getColumn("role")
                                ?.setFilterValue(filterValue.filter((value) => value !== "ADMIN"))
                            }
                          }}
                        >
                          Admin
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={
                            Array.isArray(membersTable.getColumn("role")?.getFilterValue())
                              ? (membersTable.getColumn("role")?.getFilterValue() as string[]).includes("MEMBER")
                              : false
                          }
                          onCheckedChange={(checked) => {
                            const filterValue = (membersTable.getColumn("role")?.getFilterValue() as string[]) || []
                            if (checked) {
                              membersTable.getColumn("role")?.setFilterValue([...filterValue, "MEMBER"])
                            } else {
                              membersTable
                                .getColumn("role")
                                ?.setFilterValue(filterValue.filter((value) => value !== "MEMBER"))
                            }
                          }}
                        >
                          Membro
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {activeTab === "invites" && (
                  <Input
                    placeholder="Filtrar por email..."
                    value={(invitesTable.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => invitesTable.getColumn("email")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                  />
                )}
              </div>
            </div>

            <TabsContent value="members" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {membersTable.getHeaderGroups().map((headerGroup) => (
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
                    {membersTable.getRowModel().rows?.length ? (
                      membersTable.getRowModel().rows.map((row) => (
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
                        <TableCell colSpan={memberColumns.length} className="h-24 text-center">
                          Nenhum membro encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {membersTable.getFilteredRowModel().rows.length} membro(s) no total.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => membersTable.previousPage()}
                    disabled={!membersTable.getCanPreviousPage()}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => membersTable.nextPage()}
                    disabled={!membersTable.getCanNextPage()}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invites" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleInviteMember}
      />
    </>
  )
}
