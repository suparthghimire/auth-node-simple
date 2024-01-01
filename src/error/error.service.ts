import { ZodError } from "zod";
import NotFoundError from "./NotFound";
import UnauthorizedError from "./Unauthotized";

export const ErrorServive = {
  handleError(error: unknown) {
    if (error instanceof UnauthorizedError)
      return {
        status: error.status,
        message: error.message,
      };
    else if (error instanceof NotFoundError) {
      return {
        status: error.status,
        message: error.message,
      };
    } else if (error instanceof ZodError) {
      return {
        status: 422,
        message: "Validation Error",
        data: error.formErrors.fieldErrors,
      };
    } else {
      return {
        status: 500,
        message: "Something went wrong",
        data: error,
      };
    }
  },
};
