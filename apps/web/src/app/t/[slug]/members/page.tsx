"use client"

import { UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermission } from "@/context/permission";
import { Permission } from "@packages/permission";

import { InviteMemberDialog } from "./invite-member-dialog";
import { InvitesTable } from "./invites-table";
import { MembersTable } from "./member-table";

export default function MembersList() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")
  const { can } = usePermission();
  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Membros da Organização</CardTitle>
          <CardDescription>Gerencie os membros e convites da sua organização</CardDescription>
        </div>
        {
          can(Permission.CREATE_INVITE) &&
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Convidar
          </Button>
        }
      </div>
      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
          </TabsList>
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
