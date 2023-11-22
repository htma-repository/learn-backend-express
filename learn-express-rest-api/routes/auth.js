import { Router } from "express";

import { signUp, signIn } from "../controllers/auth.js";

import { signUpSchema, signInSchema } from "../validation/auth-validation.js";
import { validate } from "../validation/validate.js";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp);

router.post("/signin", validate(signInSchema), signIn);

router.post("/signout");

export default router;
