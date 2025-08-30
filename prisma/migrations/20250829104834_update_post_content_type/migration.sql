/*
  Warnings:

  - You are about to drop the column `blob` on the `Flow` table. All the data in the column will be lost.
  - Added the required column `content` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "blob",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "downloads" SET DEFAULT 0;
