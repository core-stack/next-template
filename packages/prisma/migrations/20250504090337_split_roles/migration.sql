/*
  Warnings:

  - The `role` column on the `Invite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ROOT', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('WORKSPACE_ADMIN', 'WORKSPACE_MEMBER');

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'WORKSPACE_MEMBER';

-- AlterTable
ALTER TABLE "members" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'WORKSPACE_MEMBER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
