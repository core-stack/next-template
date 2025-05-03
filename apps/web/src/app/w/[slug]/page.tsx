import type { Metadata } from "next"



import { WorkspaceOverview } from './workspace-overview';

export default function WorkspacePage() {
  const workspace = {
    id: "1",
    slug: "slug",
    name: `Organização`,
    description: "Área de trabalho compartilhada para sua equipe",
    backgroundImage: "linear-gradient(to right, #4f46e5, #8b5cf6)",
    isOwner: true,
    role: "ADMIN",
    projectCount: 8,
    memberCount: 12,
  }

  return (  
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{workspace.name}</h1>
        <p className="text-muted-foreground">{workspace.description}</p>
      </div>
      <WorkspaceOverview workspace={workspace} />
    </div>
  )
}
