// db/client.js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default client;
