import { ValidationError as SequelizeValidationError } from "sequelize";

import User from "../models/user.js";
import {
  generateToken,
  accessTokenSecret,
  refreshTokenSecret,
} from "../utils/jwt.js";

import { hashPassword, comparePassword } from "../utils/utils.js";

export async function signUp(req, res, next) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      const error = new Error("Password not match!");
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!createdUser) {
      const error = new Error("Failed to signup, try again later!");
      error.statusCode = 422;
      throw error;
    }

    const {
      id,
      username: newUserName,
      email: newEmail,
      created_at,
      updated_at,
    } = createdUser.dataValues;

    const accessToken = await generateToken(
      {
        id,
        email: newEmail,
      },
      accessTokenSecret,
      "5m"
    );

    const refreshToken = await generateToken(
      {
        id,
        email: newEmail,
      },
      refreshTokenSecret,
      "7d"
    );

    res.cookie("rt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      access_token: accessToken,
      message: "Signup new user successfully!",
      user: {
        id,
        username: newUserName,
        email: newEmail,
        created_at,
        updated_at,
      },
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

export async function signIn(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User with this email could not be found!");
      error.statusCode = 401;
      throw error;
    }

    const comparedPassword = await comparePassword(
      password,
      user.dataValues.password
    );

    if (!comparedPassword) {
      const error = new Error("Incorrect Password!");
      error.statusCode = 401;
      throw error;
    }

    const {
      id,
      username,
      email: userEmail,
      created_at,
      updated_at,
    } = user.dataValues;

    const accessToken = await generateToken(
      {
        id,
        email: userEmail,
      },
      accessTokenSecret,
      "5m"
    );

    const refreshToken = await generateToken(
      {
        id,
        email: userEmail,
      },
      refreshTokenSecret,
      "7d"
    );

    res.cookie("rt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      access_token: accessToken,
      message: "Signin successfully!",
      user: {
        id,
        username,
        email: userEmail,
        created_at,
        updated_at,
      },
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

export async function signOut(req, res, next) {
  try {
    const refreshToken = req.cookies.rt;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    res.clearCookie("rt", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(204).json({ message: "Signout successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
}
