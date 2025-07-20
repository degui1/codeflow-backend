/*
  Warnings:

  - Added the required column `flowSchemaId` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blob` to the `FlowSchema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "flowSchemaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FlowSchema" ADD COLUMN     "blob" BYTEA NOT NULL;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_flowSchemaId_fkey" FOREIGN KEY ("flowSchemaId") REFERENCES "FlowSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
