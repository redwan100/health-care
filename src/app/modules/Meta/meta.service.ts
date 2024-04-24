import { UserRole, paymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../../types/common";

const getMetadataFromDB = async (user: TAuthUser) => {
  let metadata;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metadata = getSuperAdminMetadata();

      break;

    case UserRole.ADMIN:
      metadata = getAdminMetadata();
      break;

    case UserRole.DOCTOR:
      metadata = getDoctorMetadata(user as TAuthUser);
      break;

    case UserRole.PATIENT:
      metadata = getPatientMetadata(user);
      break;

    default:
      throw new Error("Invalid role");
  }

  return metadata;
};

const getSuperAdminMetadata = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.patient.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: paymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    doctorCount,
    adminCount,
    paymentCount,
    patientCount,
    totalRevenue,
  };
};

const getAdminMetadata = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.patient.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: paymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    doctorCount,
    paymentCount,
    patientCount,
    totalRevenue,
  };
};

const getDoctorMetadata = async (user: TAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: paymentStatus.PAID,
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formatAppointmentStatusDistribution = appointmentStatusDistribution.map(
    (count) => ({
      status: count.status,
      count: Number(count._count.id),
    })
  );

  return {
    appointmentCount,
    patientCount: patientCount?.length,
    reviewCount,
    totalRevenue,
    formatAppointmentStatusDistribution,
  };
};

const getPatientMetadata = async (user: TAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const formatAppointmentStatusDistribution = appointmentStatusDistribution.map(
    (count) => ({
      status: count.status,
      count: Number(count._count.id),
    })
  );

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formatAppointmentStatusDistribution,
  };
};

export const metaService = {
  getMetadataFromDB,
  getSuperAdminMetadata,
  getAdminMetadata,
  getDoctorMetadata,
  getPatientMetadata,
};
