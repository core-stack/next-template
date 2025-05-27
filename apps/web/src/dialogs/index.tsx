import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { CreateOrUpdateWorkspaceDialog } from "./create-or-update-workspace-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import { PlanComparisonDialog } from "./plan-comparison-dialog";

export enum DialogType {
  CREATE_WORKSPACE = "create-workspace",
  UPDATE_WORKSPACE = "update-workspace",
  CONFIRM_DELETE_WORKSPACE = "confirm-delete-workspace",
  INVITE_MEMBER = "invite-member",
  PLAN_COMPARISON = "plan-comparison",
}

export const dialogs = {
  [DialogType.CREATE_WORKSPACE]: (props: any) => <CreateOrUpdateWorkspaceDialog {...props} />,
  [DialogType.UPDATE_WORKSPACE]: (props: any) => <CreateOrUpdateWorkspaceDialog {...props} />,
  [DialogType.CONFIRM_DELETE_WORKSPACE]: (props: any) => <ConfirmDeleteDialog {...props} />,
  [DialogType.INVITE_MEMBER]: () => <InviteMemberDialog />,
  [DialogType.PLAN_COMPARISON]: (props: any) => <PlanComparisonDialog {...props} />
}