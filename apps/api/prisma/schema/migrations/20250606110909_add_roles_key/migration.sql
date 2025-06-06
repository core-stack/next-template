/*
  Warnings:

  - You are about to drop the column `workspace_id` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceKey` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the `workspaces` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenant_id,email]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,tenant_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,tenant_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantKey,name,scope]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `readAt` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tenant_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_workspace_id_fkey";

-- DropIndex
DROP INDEX "Invite_workspace_id_email_key";

-- DropIndex
DROP INDEX "members_email_workspace_id_key";

-- DropIndex
DROP INDEX "members_user_id_workspace_id_key";

-- DropIndex
DROP INDEX "workspace_id_name_scope_idx";

-- DropIndex
DROP INDEX "subscriptions_workspace_id_key";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "workspace_id",
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" DROP COLUMN "workspace_id",
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "workspace_id",
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ALTER COLUMN "readAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "workspaceKey",
DROP COLUMN "workspace_id",
ADD COLUMN     "key" TEXT,
ADD COLUMN     "tenantKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tenant_id" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "workspace_id",
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "workspaces";

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "backgroundImage" TEXT NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_tenant_id_email_key" ON "Invite"("tenant_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_tenant_id_key" ON "members"("user_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_tenant_id_key" ON "members"("email", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_id_name_scope_idx" ON "roles"("tenantKey", "name", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_tenant_id_key" ON "subscriptions"("tenant_id");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
