// db/queries/users.js
import db from "#db/client";
import bcrypt from "bcrypt";

// Create a new user
export async function createUser(username, password) {
  console.log("🧂 creating user:", username);
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("🔑 password hashed");

  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
  `;
  console.log("📡 running SQL...");
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  console.log("✅ user created in DB:", user);

  return { id: user.id, username: user.username };
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

  // return safe object (no password field)
  return { id: user.id, username: user.username };
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
