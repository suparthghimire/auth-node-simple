import { compare, genSalt, hash } from "bcrypt";
import { T_RegisterSchema } from "./model/Register.model";
import { prisma } from "..";
import { OmitProperty } from "../utils/helpers";

export const UserService = {
  createUser: async (user: T_RegisterSchema) => {
    const salt = await genSalt(10);
    const hashedPwd = await hash(user.password, salt);

    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPwd,
      },
    });
    return createdUser;
  },
  getUserByEmailAndPassword: async (email: string, password: string) => {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) return null;

    const hashPwd = user.password;

    const pwdMatches = await compare(password, hashPwd);

    if (!pwdMatches) return null;

    return OmitProperty(user, "password");
  },
};
