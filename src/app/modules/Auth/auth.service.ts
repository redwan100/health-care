import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { jwtHelper } from "./../../../helpers/jwtHelper";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("incorrect password");
  }

  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abc",
    "5m"
  );

  const refreshToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcd",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwtHelper.verifyToken(token, "abcd");
  } catch (err) {
    throw new Error("you are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abc",
    "5m"
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
};
