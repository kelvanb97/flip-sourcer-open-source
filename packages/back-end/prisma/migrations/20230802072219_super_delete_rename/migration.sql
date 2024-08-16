/*
  Warnings:

  - You are about to drop the column `superDeleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "superDeleted",
ADD COLUMN     "superDelete" BOOLEAN NOT NULL DEFAULT false;
