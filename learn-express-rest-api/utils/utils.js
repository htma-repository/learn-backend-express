import { hash, compare } from "bcrypt";

export function limitArray(arr, limit) {
  return limit === 0 || limit > arr.length ? arr : arr.slice(0, limit);
}

export async function hashPassword(password) {
  const salt = 12;
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
  const comparedPassword = await compare(password, hashedPassword);
  return comparedPassword;
}
