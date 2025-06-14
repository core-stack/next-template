import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { caller } from "@/lib/trpc/server";

import { General } from "./components/general";
import { UpdatePassword } from "./components/password";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gerencie suas informações pessoais",
}

export default async function ProfilePage() {
  const user = await caller.user.self();
  return (
    <div className="container py-10 m-auto">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências de conta</p>
        </div>
        <Separator />
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <General user={user} />
          </TabsContent>

          <TabsContent value="password">
            <UpdatePassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
