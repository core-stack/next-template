import type { Metadata } from "next"


import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchApi } from '@/lib/fetcher';

import { General } from './components/general';
import { ProfileHead } from './components/head';
import { UpdatePassword } from './components/password';

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gerencie suas informações pessoais",
}

export default async function ProfilePage() {
  const [user, hasPassword] = await Promise.all([
    fetchApi("[GET] /api/user/self"),
    fetchApi("[GET] /api/user/has-password")
  ]);
  if (!user.data) return null;
  if (!hasPassword.data) return null;
  return (
    <div className="container py-10 m-auto">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <ProfileHead />
        </div>
        <Separator />
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="general">{/*i18n*/("General")}</TabsTrigger>
            <TabsTrigger value="password">{/*i18n*/("Password")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <General user={user.data} />
          </TabsContent>

          <TabsContent value="password">
            <UpdatePassword hasPassword={hasPassword.data.hasPassword} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
