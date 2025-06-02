import { prisma, roleSchema } from "@packages/prisma";
import { z } from "zod";

import global from "../../../config/default-global-roles.json";
import workspace from "../../../config/default-workspace-roles.json";

const roleWithDefaultsSchema = roleSchema.pick({ name: true, permissions: true, scope: true }).extend({
  default: z.enum([ "admin", "user", "workspace-admin", "workspace-user" ]).optional(),
});
export type DefaultRoleSchema = z.infer<typeof roleWithDefaultsSchema>;

const defaultGlobalRoles = roleWithDefaultsSchema.array().parse(global);
const defaultWorkspaceRoles = roleWithDefaultsSchema.array().parse(workspace);

const defaultAdminRole = defaultGlobalRoles.find(role => role.default === "admin");
const defaultUserRole = defaultGlobalRoles.find(role => role.default === "user");
const defaultWorkspaceAdminRole = defaultWorkspaceRoles.find(role => role.default === "workspace-admin");
const defaultWorkspaceUserRole = defaultWorkspaceRoles.find(role => role.default === "workspace-user");

export const roles = {
  workspace: defaultWorkspaceRoles as DefaultRoleSchema[],
  global: defaultGlobalRoles as DefaultRoleSchema[],
  admin: defaultAdminRole as DefaultRoleSchema,
  user: defaultUserRole as DefaultRoleSchema,
  workspaceAdmin: defaultWorkspaceAdminRole as DefaultRoleSchema,
  workspaceUser: defaultWorkspaceUserRole as DefaultRoleSchema
}

export const syncGlobalRoles = async () => {
  console.log("Syncing global roles...");

  const roles = await prisma.role.findMany({ where: { scope: "GLOBAL" } });
  if (roles.length === 0) {
    console.log("Creating default global roles...");
    await prisma.role.createMany({
      data: defaultGlobalRoles.map(role => ({ ...role, scope: "GLOBAL" }))
    });
  } else {
    console.log("Updating default global roles...");
    for (const role of defaultGlobalRoles) {
      const existingRole = roles.find(r => r.name === role.name);
      if (!existingRole) {
        await prisma.role.create({
          data: { ...role, scope: "GLOBAL" }
        });
        console.log(`Created role ${role.name}`);
      } else if (role.permissions.some(p => !existingRole.permissions.includes(p))) {
        await prisma.role.update({
          where: { id: existingRole.id },
          data: { ...role, scope: "GLOBAL" }
        });
        console.log(`Updated role ${role.name}`);
      }
    }
  }
  console.log("Global roles synced");
}