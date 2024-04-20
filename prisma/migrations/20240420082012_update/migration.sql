/*
  Warnings:

  - You are about to drop the column `startDaate` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "startDaate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
