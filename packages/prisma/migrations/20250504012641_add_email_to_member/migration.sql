/*
  Warnings:

  - A unique constraint covering the columns `[email,workspace_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_email_workspace_id_key" ON "members"("email", "workspace_id");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
