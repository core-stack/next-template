"use client"

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiQuery } from '@/hooks/use-api-query';

import { General } from './components/general';
import { ProfileHead } from './components/head';
import { UpdatePassword } from './components/password';

export default function ProfilePage() {
  const { data: user } = useApiQuery("[GET] /api/user/self");
  const { data: hasPassword } = useApiQuery("[GET] /api/user/has-password");
  
  if (!user) return null;
  if (!hasPassword) return null;
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
            <General user={user} />
          </TabsContent>

          <TabsContent value="password">
            <UpdatePassword hasPassword={hasPassword.hasPassword} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
