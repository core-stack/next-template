"use client";
import { CreateOrUpdateTenantDialog } from './create-or-update-workspace-dialog';
import { InviteMemberDialog } from './invite-member-dialog';
import { PlanComparisonDialog } from './plan-comparison-dialog';

export enum DialogType {
  CREATE_TENANT = "create-workspace",
  UPDATE_TENANT = "update-workspace",
  CONFIRM_DELETE_TENANT = "confirm-delete-workspace",
  INVITE_MEMBER = "invite-member",
  PLAN_COMPARISON = "plan-comparison",
}

export const dialogs = {
  [DialogType.CREATE_TENANT]: (props: any) => <CreateOrUpdateTenantDialog {...props} />,
  [DialogType.UPDATE_TENANT]: (props: any) => <CreateOrUpdateTenantDialog {...props} />,
  [DialogType.INVITE_MEMBER]: () => <InviteMemberDialog />,
  [DialogType.PLAN_COMPARISON]: (props: any) => <PlanComparisonDialog {...props} />
}