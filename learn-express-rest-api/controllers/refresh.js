import {
  refreshTokenSecret,
  accessTokenSecret,
  verifyToken,
  generateToken,
} from "../utils/jwt.js";

export async function getRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.rt;

    if (!refreshToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }

    const verifiedToken = await verifyToken(refreshToken, refreshTokenSecret);

    if (!verifiedToken) {
      const error = new Error("Refresh token Invalid");
      error.statusCode = 403;
      throw error;
    }

    const generatedNewToken = await generateToken(
      {
        id: verifiedToken.id,
        email: verifiedToken.email,
      },
      accessTokenSecret,
      "5m"
    );

    res.status(200).json({
      access_token: generatedNewToken,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
}
