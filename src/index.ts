import express from "express";
import dotenv from "dotenv";
import AuthRouter from "./auth/auth.routes";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
// init
dotenv.config();

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api", AuthRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const prisma = new PrismaClient();
