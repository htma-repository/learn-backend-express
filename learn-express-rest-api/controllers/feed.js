import { ValidationError as SequelizeValidationError } from "sequelize";

import Post from "../models/post.js";

export async function getPosts(req, res, next) {
  try {
    const limit = +req.query.limit;
    const skip = +req.query.skip || 0;
    let posts;

    if (limit > 0 && skip > 0) {
      posts = await Post.findAll({
        offset: skip,
        limit: limit,
      });
    } else {
      posts = await Post.findAll();
    }

    if (!posts) {
      const error = new Error("Failed to get feed!");
      error.statusCode = 422;
      throw error;
    }

    const total = await Post.count();

    res.status(200).json({ posts, total, skip, limit: posts.length });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to get feed, try again later";
    }

    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      const error = new Error("Failed to get post, post not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      post: post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to get feed, try again later";
    }

    next(error);
  }
}

export async function createPost(req, res, next) {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.userId;

    if (!userId) {
      const error = new Error("Please signin to create a post!");
      error.statusCode = 401;
      throw error;
    }

    const newPost = { title, description, user_id: userId };

    const addPost = await Post.create(newPost);

    if (!addPost) {
      const error = new Error("Failed to post feed!");
      error.statusCode = 422;
      throw error;
    }

    res.status(201).json({
      message: "Post created successfully!",
      post: addPost.dataValues,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to post feed, try again later";
    }

    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const title = req.body.title;
    const description = req.body.description;
    const updatedAt = new Date().toISOString();

    const post = await Post.findOne({ where: { id: postId, user_id: userId } });

    if (!post) {
      const error = new Error("Failed to get post, post not found!");
      error.statusCode = 404;
      throw error;
    }
    post.set({
      title,
      description,
      updated_at: updatedAt,
    });

    const updatedPost = await post.save();

    res.status(201).json({
      message: "Updated post successfully!",
      post: updatedPost,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to update feed, try again later";
    }

    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const deletedPost = await Post.destroy({
      where: { id: postId, user_id: userId },
    });

    if (deletedPost <= 0) {
      const error = new Error("Failed to delete post, post not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Delete post successfully!",
      deleted: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to delete post, try again later";
    }

    next(error);
  }
}

export async function restorePost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const restoredPost = await Post.restore({
      where: { id: postId, user_id: userId },
    });

    if (restoredPost <= 0) {
      const error = new Error("Failed to restore post, post not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Restore post successfully!",
      deleted: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to restore post, try again later";
    }

    next(error);
  }
}
