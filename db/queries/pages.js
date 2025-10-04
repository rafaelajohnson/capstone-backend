// db/queries/pages.js
import db from "#db/client";

// create a page
export async function createPage(storyId, pageNumber, text) {
  const result = await db.query(
    `INSERT INTO pages (story_id, page_number, text) 
     VALUES ($1, $2, $3) RETURNING *`,
    [storyId, pageNumber, text]
  );
  return result.rows[0];
}

// update page
export async function updatePage(pageId, text) {
  const result = await db.query(
    `UPDATE pages
     SET text = $1
     WHERE id = $2
     RETURNING *`,
    [text, pageId]
  );
  return result.rows[0];
}

// delete page
export async function deletePage(pageId) {
  const result = await db.query(
    `DELETE FROM pages
     WHERE id = $1
     RETURNING *`,
    [pageId]
  );
  return result.rows[0];
}

// get page by id (with its options)
export async function getPageById(pageId) {
  const result = await db.query(
    `SELECT * FROM pages WHERE id = $1`,
    [pageId]
  );
  return result.rows[0];
}
