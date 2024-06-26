import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../src/config";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistsSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistsSuperAdmin) {
      console.log("super admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "redwan",
      Number(config.salt_round)
    );
    const superAdmin = await prisma.user.create({
      data: {
        email: "redwanislam987@gmail.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,

        admin: {
          create: {
            name: "rewdan",
            contactNumber: "0196518760",
          },
        },
      },
    });

    console.log({ superAdmin });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
