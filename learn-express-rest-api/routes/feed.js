import { Router } from "express";

import { authMiddleware } from "../middleware/auth.js";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  restorePost,
} from "../controllers/feed.js";

import { postSchema } from "../validation/post-validation.js";
import { validate } from "../validation/validate.js";

const router = Router();

router.get("/posts", getPosts);

router.get("/posts/:postId", getPost);

router.post("/posts", authMiddleware, validate(postSchema), createPost);

router.put("/posts/:postId", authMiddleware, validate(postSchema), updatePost);

router.delete("/posts/:postId", authMiddleware, deletePost);

router.post("/posts/:postId", authMiddleware, restorePost);

export default router;
