import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import "dotenv/config";

import feedRouter from "./routes/feed.js";
import authRouter from "./routes/auth.js";
import refreshRouter from "./routes/refresh.js";
import roleRouter from "./routes/role.js";
import { sequelize } from "./databases/db.js";
import { errorMiddleware } from "./middleware/error.js";
import User from "./models/user.js";
import Post from "./models/post.js";
import Role from "./models/role.js";

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

const whitelist = [`${host}:${port}`, `http://127.0.0.1:${port}`];
// const corsOptions = {
// origin: (origin, callback) => {
//   if (whitelist.indexOf(origin) !== -1) {
//     callback(null, true);
//   } else {
//     callback(new Error());
//   }
// },
// };

app.use(bodyParser.json());
app.use(
  cors({
    origin: whitelist,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: [
      "Access-Control-Allow-Headers",
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
  handler: (req, res, next) => {
    const statusCode = 429;
    return res.status(statusCode).json({
      error: true,
      statusCode,
      message: ["Too many requests, try again later!"],
    });
  },
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use("/feed", feedRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/role", roleRouter);

app.all("*", (req, res) => {
  const statusCode = 404;
  res.status(statusCode);
  if (req.accepts("json")) {
    res.json({ error: true, statusCode, message: ["Not Found"] });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorMiddleware);

User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });
Role.hasOne(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

sequelize
  .sync()
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server running on ${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
