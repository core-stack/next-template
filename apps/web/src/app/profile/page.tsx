import type { Metadata } from "next"
import { Separator } from '@/components/ui/separator';

import { ProfileForm } from './form';

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gerencie suas informações pessoais",
}

export default function ProfilePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências de conta</p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </div>
  )
}
