import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type TUpdatePatient = {
  name?: string;
  contactNumber?: string;
  address?: string;

  patientHealthData: {
    gender: Gender;
    dateOfBirth: string;
    bloodGroup: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height: string;
    weight: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: MaritalStatus;
  };

  medicalReport: {
    reportName: string;
    reportLink: string;
  };
};
