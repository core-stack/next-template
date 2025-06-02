/*
  Warnings:

  - A unique constraint covering the columns `[workspaceKey,name,scope]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_workspace_id_name_key";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "workspaceKey" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "workspace_id_name_scope_idx" ON "Role"("workspaceKey", "name", "scope");
