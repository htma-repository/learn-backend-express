import { ZodError } from "zod";

import { fromZodError } from "zod-validation-error";

export function errorMiddleware(error, req, res, next) {
  const status = error.statusCode;
  let message = [error.message];

  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    console.log({ validationError });
    message = validationError.details.map((err) => err.message);
  }

  res.status(status).json({ error: true, statusCode: status, message });
}
