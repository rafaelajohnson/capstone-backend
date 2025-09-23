// queries related to users table
import db from "#db/client";
import bcrypt from "bcrypt";

// find user by username + check password
// used when someone logs in
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  // if user not found
  if (!user) return null;

  // check hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user; // good login
}

// get a user by ID
// used when we decode a token and need user info
export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
