import { Request, Response } from "express";
import { RegisterSchema, T_RegisterSchema } from "./model/Register.model";
import { UserService } from "./auth.service";
import { LoginSchema } from "./model/Login.model";
import { ErrorServive } from "../error/error.service";
import { TokenService } from "../token/Token.service";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/constants";
import UnauthorizedError from "../error/Unauthotized";
import NotFoundError from "../error/NotFound";

export const AuthController = {
  login: async (req: Request, res: Response) => {
    try {
      const validatedUser = LoginSchema.parse(req.body);

      const user = await UserService.getUserByEmailAndPassword(
        validatedUser.email,
        validatedUser.password
      );

      if (!user) throw new UnauthorizedError("Invalid email or password");

      const accessToken = TokenService.generateToken(
        user,
        ACCESS_TOKEN_KEY,
        15,
        "m"
      );
      const refreshToken = TokenService.generateToken(
        user,
        REFRESH_TOKEN_KEY,
        30,
        "d"
      );

      return res.status(200).json({
        ok: true,
        message: "Login Successful",
        data: {
          accessToken,
          refreshToken,
          user: user,
        },
      });
    } catch (error) {
      console.log(error);
      const errorData = ErrorServive.handleError(error);
      return res.status(errorData.status).json({
        ok: false,
        ...errorData,
      });
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const validatedUser = RegisterSchema.parse(req.body);

      const user = await UserService.createUser(validatedUser);

      if (!user) throw new NotFoundError("User not found");

      return res.status(201).json({
        ok: true,
        message: "Registration Successful",
      });
    } catch (error) {
      console.log(error);

      const errorData = ErrorServive.handleError(error);
      return res.status(errorData.status).json({
        ok: false,
        ...errorData,
      });
    }
  },
  refresh: (req: Request, res: Response) => {
    try {
      const refreshToken = req.headers["refresh_token"];

      if (!refreshToken) throw new Error("Refresh Token not found");
      if (typeof refreshToken !== "string")
        throw new Error("Refresh Token is not a string");

      const user = TokenService.verifyToken<Omit<T_RegisterSchema, "password">>(
        refreshToken,
        REFRESH_TOKEN_KEY
      );

      if (!user) throw new UnauthorizedError("Invalid Refresh Token");

      const accessToken = TokenService.generateToken(
        user,
        ACCESS_TOKEN_KEY,
        15,
        "m"
      );

      return res.status(200).json({
        ok: true,
        message: "Token Refreshed",
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      const errorData = ErrorServive.handleError(error);
      return res.status(400).json({
        ok: false,
        ...errorData,
      });
    }
  },
};
