/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `doctor_shedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctor_shedules_appointmentId_key" ON "doctor_shedules"("appointmentId");

-- AddForeignKey
ALTER TABLE "doctor_shedules" ADD CONSTRAINT "doctor_shedules_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
