import { z as zod } from "zod";

export const postSchema = zod.object({
  body: zod.object({
    title: zod
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .trim()
      .min(3, { message: "Must be 5 or more characters long" })
      .max(50, { message: "Must be 5 or fewer characters long" }),
    description: zod
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .trim()
      .min(10, { message: "Must be 10 or more characters long" })
      .max(250, { message: "Must be 10 or fewer characters long" }),
  }),
});
