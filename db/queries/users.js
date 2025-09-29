// db/queries/users.js
import db from "#db/client";
import bcrypt from "bcrypt";

// Create a new user
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);

  return user;
}

// Authenticate user (login check)
export async function authenticateUser(username, password) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

// Get a user by id
export async function getUserById(id) {
  const sql = `
    SELECT id, username
    FROM users
    WHERE id = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [id]);

  return user;
}

