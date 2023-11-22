import { verifyToken, accessTokenSecret } from "../utils/jwt.js";

export async function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }

    const token = tokenHeader.split(" ")[1];
    const credential = await verifyToken(token, accessTokenSecret);

    if (!credential) {
      const error = new Error("Invalid Token");
      error.statusCode = 401;
      throw error;
    }

    req.userId = credential.id;

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
}
