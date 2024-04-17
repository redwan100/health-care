import prisma from "../../../shared/prisma";

const doctorUpdateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorInfo } = payload;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctor = await transactionClient.doctor.update({
      where: { id },
      data: doctorInfo,
    });

    if (specialties && specialties.length > 0) {
      // delete specialty information
      const deletedSpecialties = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      await transactionClient.doctorSpecialties.deleteMany({
        where: {
          doctorId: doctorInfo.id,
          specialtiesId: deletedSpecialties.specialtiesId,
        },
      });

      // create specialty information
      const createdSpecialties = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const specialty of createdSpecialties) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorData.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: { id },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

export const DoctorService = {
  doctorUpdateIntoDB,
};
