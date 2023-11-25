import { Router } from "express";

import { createRole } from "../controllers/role.js";

const router = Router();

router.post("/", createRole);

export default router;
