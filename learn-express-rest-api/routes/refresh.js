import { Router } from "express";

import { getRefreshToken } from "../controllers/refresh.js";

const router = Router();

router.get("/", getRefreshToken);

export default router;
