import jwt from "jsonwebtoken";

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export function generateToken(payload, tokenSecret, expiresIn = "1h") {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, tokenSecret, { expiresIn }, (error, token) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(token);
    });
  });
}

export function verifyToken(token, tokenSecret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (error, decoded) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(decoded);
    });
  });
}
