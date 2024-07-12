/*
  Warnings:

  - Added the required column `reelId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "reelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
