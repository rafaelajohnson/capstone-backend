// db/queries/pages.js
import db from "#db/client";

// get all pages for a story
export async function getPagesByStory(storyId) {
  const result = await db.query(
    `SELECT * FROM pages WHERE story_id = $1 ORDER BY page_number ASC`,
    [storyId]
  );
  return result.rows;
}

// get one page (with text)
export async function getPageById(pageId) {
  const result = await db.query(
    `SELECT * FROM pages WHERE id = $1`,
    [pageId]
  );
  return result.rows[0];
}

// make a new page
export async function createPage(storyId, pageNumber, text) {
  const result = await db.query(
    `INSERT INTO pages (story_id, page_number, text) 
     VALUES ($1, $2, $3) RETURNING *`,
    [storyId, pageNumber, text]
  );
  return result.rows[0];
}

// update an existing page
export async function updatePage(id, pageNumber, text) {
  const result = await db.query(
    `UPDATE pages
     SET page_number = $1, text = $2
     WHERE id = $3
     RETURNING *`,
    [pageNumber, text, id]   // ✅ correct order
  );
  return result.rows[0];
}

// delete a page
export async function deletePage(id) {
  const result = await db.query(
    `DELETE FROM pages
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}
