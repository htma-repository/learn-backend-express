import { ValidationError as SequelizeValidationError } from "sequelize";

import Role from "../models/role.js";

export async function createRole(req, res, next) {
  try {
    const roleName = req.body.role;

    const createdRole = await Role.create({ role: roleName });

    if (!createdRole) {
      const error = new Error("Failed to create role!");
      error.statusCode = 422;
      throw error;
    }

    res.status(201).json({
      message: "Role created successfully!",
      role: createdRole.dataValues,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error instanceof SequelizeValidationError) {
      error.message = "Failed to create role, try again later";
    }

    next(error);
  }
}
