import db from "#db/client";

// get all stories for a user
export async function getStoriesByUser(userId) {
  const result = await db.query(
    `SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

// get one story with its pages
export async function getStoryById(storyId) {
  const result = await db.query(
    `SELECT * FROM stories WHERE id = $1`,
    [storyId]
  );
  return result.rows[0];
}

// make a new story
export async function createStory(userId, title, topic) {
  const result = await db.query(
    `INSERT INTO stories (user_id, title, topic) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, title, topic]
  );
  return result.rows[0];
}

// delete story if user owns it
export async function deleteStory(storyId, userId) {
  await db.query(
    `DELETE FROM stories WHERE id = $1 AND user_id = $2`,
    [storyId, userId]
  );
}
