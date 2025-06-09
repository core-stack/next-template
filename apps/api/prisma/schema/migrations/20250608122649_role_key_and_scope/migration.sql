/*
  Warnings:

  - The values [WORKSPACE] on the enum `RoleScope` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `tenantKey` on the `roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key,scope]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `key` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleScope_new" AS ENUM ('TENANT', 'GLOBAL');
ALTER TABLE "roles" ALTER COLUMN "scope" DROP DEFAULT;
ALTER TABLE "roles" ALTER COLUMN "scope" TYPE "RoleScope_new" USING ("scope"::text::"RoleScope_new");
ALTER TYPE "RoleScope" RENAME TO "RoleScope_old";
ALTER TYPE "RoleScope_new" RENAME TO "RoleScope";
DROP TYPE "RoleScope_old";
ALTER TABLE "roles" ALTER COLUMN "scope" SET DEFAULT 'TENANT';
COMMIT;

-- DropIndex
DROP INDEX "tenant_id_name_scope_idx";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "tenantKey",
ALTER COLUMN "scope" SET DEFAULT 'TENANT',
ALTER COLUMN "key" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_scope_key" ON "roles"("key", "scope");
