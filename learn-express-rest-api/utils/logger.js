import morgan from "morgan";
import fs from "fs";
import path from "path";
import { getDirName } from "./dirname.js";

const dirName = getDirName(import.meta.url);

const accessLogStream = fs.createWriteStream(
  path.join(dirName, "..", "access.log"),
  { flags: "a" }
);

export function logger() {
  return morgan("combined", { stream: accessLogStream });
}
