import { z as zod } from "zod";
import User from "../models/user.js";

export const signUpSchema = zod.object({
  body: zod.object({
    username: zod
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .trim()
      .min(6, { message: "Username must be 6 or more characters long" })
      .max(50, { message: "Username max 50 characters long" }),
    email: zod
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid email address" })
      .refine(
        async (value) => {
          const userByEmail = await User.findOne({ where: { email: value } });
          return !userByEmail;
        },
        { message: "User with this email already exist!" }
      ),
    password: zod
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .trim()
      .min(6, { message: "Password must be 6 or more characters long" })
      .max(12, { message: "password max 50 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,12}$/,
        { message: "Password must have lowercase, uppercase, symbol, number" }
      ),
    confirmPassword: zod
      .string({
        required_error: "ConfirmPassword is required",
        invalid_type_error: "ConfirmPassword must be a string",
      })
      .superRefine(({ password, confirmPassword }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["confirmPassword"],
          });
        }
      }),
  }),
});

export const signInSchema = zod.object({
  body: zod.object({
    email: zod
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid email address" })
      .refine(
        async (value) => {
          const userByEmail = await User.findOne({ where: { email: value } });
          return !!userByEmail;
        },
        { message: "User with this email are not exist!" }
      ),
    password: zod
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .trim()
      .min(6, { message: "Password must be 6 or more characters long" })
      .max(12, { message: "password max 50 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,12}$/,
        { message: "Password must have lowercase, uppercase, symbol, number" }
      ),
  }),
});
