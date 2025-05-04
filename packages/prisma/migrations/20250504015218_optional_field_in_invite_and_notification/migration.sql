-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_user_id_fkey";

-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "link" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
