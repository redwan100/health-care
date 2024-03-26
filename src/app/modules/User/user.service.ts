import { fileUploader } from "../../../helpers/fileUploader";

const createAdminIntoDB = async (req: any) => {
  const file = req.file;

  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(req.file);
    console.log({ image: secure_url });
  }

  // const hashedPassword = await bcrypt.hash(payload.password, 10);

  // const userData = {
  //   email: payload.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };

  // const result = await prisma.$transaction(async (transactionClient) => {
  //   const createdUserData = await transactionClient.user.create({
  //     data: userData,
  //   });

  //   const createdAdminData = await transactionClient.admin.create({
  //     data: payload.admin,
  //   });

  //   return {
  //     createdUserData,
  //     createdAdminData,
  //   };
  // });

  // return result;
};

export const userService = {
  createAdminIntoDB,
};
