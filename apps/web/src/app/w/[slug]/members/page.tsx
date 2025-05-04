"use client"

import { UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { InviteMemberDialog } from './invite-member-dialog';
import { InvitesTable } from './invites-table';
import { MembersTable } from './member-table';

export default function MembersList() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Membros da Organização</CardTitle>
          <CardDescription>Gerencie os membros e convites da sua organização</CardDescription>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar
        </Button>
      </div>
      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {/* {activeTab === "members" && (
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
            )} */}
          </div>
        </div>

        <TabsContent value="members" className="space-y-4">
          <MembersTable />
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <InvitesTable />
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />
    </div>
  )
}
