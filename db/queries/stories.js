import db from "#db/client";

// get all stories for a user
export async function getStoriesByUser(userId) {
  const result = await db.query(
    `SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

// get one story
export async function getStoryById(storyId) {
  const result = await db.query(
    `SELECT * FROM stories WHERE id = $1`,
    [storyId]
  );
  return result.rows[0];
}

// create new story
export async function createStory(userId, title, topic) {
  const result = await db.query(
    `INSERT INTO stories (user_id, title, topic) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, title, topic]
  );
  return result.rows[0];
}

// update story (title/topic only)
export async function updateStory(storyId, userId, fields) {
  const { title, topic } = fields;
  const result = await db.query(
    `UPDATE stories
     SET title = COALESCE($1, title),
         topic = COALESCE($2, topic)
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [title, topic, storyId, userId]
  );
  return result.rows[0];
}

// delete story if owned by user
export async function deleteStory(storyId, userId) {
  const result = await db.query(
    `DELETE FROM stories WHERE id = $1 AND user_id = $2 RETURNING *`,
    [storyId, userId]
  );
  return result.rows[0];
}

