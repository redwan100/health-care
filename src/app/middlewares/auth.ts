import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelper";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "you are not authorized!");
      }

      //   * verify token
      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
