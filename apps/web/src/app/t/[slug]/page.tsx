import { WorkspaceOverview } from './components/workspace-overview';

export default function TenantPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold"></h1>
        <p className="text-muted-foreground"></p>
      </div>
      <WorkspaceOverview />
    </div>
  )
}
