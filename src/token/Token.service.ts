import jwt from "jsonwebtoken";
export const TokenService = {
  generateToken: (
    payload: Record<string, any>,
    key: string,
    exp: number,
    time: "d" | "h" | "m" | "s"
  ) => {
    return jwt.sign(payload, key, { expiresIn: `${exp}${time}` });
  },
  verifyToken: <T>(token: string, key: string) => {
    return jwt.verify(token, key) as T;
  },
};
