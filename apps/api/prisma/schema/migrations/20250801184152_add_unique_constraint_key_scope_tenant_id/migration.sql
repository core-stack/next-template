/*
  Warnings:

  - A unique constraint covering the columns `[key,scope,tenant_id]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_scope_tenant_id_key" ON "roles"("key", "scope", "tenant_id");
