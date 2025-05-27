import { CreateOrUpdateWorkspaceDialog, WorkspaceDialogProps } from "./create-or-update-workspace-dialog";

export enum DialogType {
  CreateWorkspace = "createWorkspace",
  UpdateWorkspace = "updateWorkspace",
}

export const dialogs = {
  [DialogType.CreateWorkspace]: (props: WorkspaceDialogProps) => <CreateOrUpdateWorkspaceDialog {...props} />,
}