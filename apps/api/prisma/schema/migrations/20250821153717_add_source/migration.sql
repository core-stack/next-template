/*
  Warnings:

  - You are about to alter the column `file_id` on the `file_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `tag_id` on the `file_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('TEXT', 'FILE', 'LINK', 'VIDEO', 'AUDIO', 'IMAGE');

-- DropForeignKey
ALTER TABLE "file_tags" DROP CONSTRAINT "file_tags_file_id_fkey";

-- DropForeignKey
ALTER TABLE "file_tags" DROP CONSTRAINT "file_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_created_by_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_group_id_fkey";

-- AlterTable
ALTER TABLE "file_tags" ALTER COLUMN "file_id" SET DATA TYPE CHAR(36),
ALTER COLUMN "tag_id" SET DATA TYPE CHAR(36);

-- DropTable
DROP TABLE "files";

-- CreateTable
CREATE TABLE "sources" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "original_name" TEXT,
    "extension" TEXT,
    "content_type" TEXT,
    "size" INTEGER,
    "url" TEXT,
    "metadata" JSONB,
    "width" INTEGER,
    "height" INTEGER,
    "source_type" "SourceType" NOT NULL,
    "index_status" "IndexStatus" NOT NULL,
    "index_error" TEXT,
    "memory_id" TEXT,
    "group_id" CHAR(36) NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sources_memory_id_idx" ON "sources"("memory_id");

-- CreateIndex
CREATE INDEX "sources_index_status_idx" ON "sources"("index_status");

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_tags" ADD CONSTRAINT "file_tags_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_tags" ADD CONSTRAINT "file_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
