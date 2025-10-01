import db from "#db/client";

// get all pages for a story
export async function getPagesByStory(storyId) {
  const result = await db.query(
    `SELECT * FROM pages WHERE story_id = $1 ORDER BY page_number ASC`,
    [storyId]
  );
  return result.rows;
}

// get single page
export async function getPageById(pageId) {
  const result = await db.query(
    `SELECT * FROM pages WHERE id = $1`,
    [pageId]
  );
  return result.rows[0];
}

// create new page
export async function createPage(storyId, pageNumber, text) {
  const result = await db.query(
    `INSERT INTO pages (story_id, page_number, text) 
     VALUES ($1, $2, $3) RETURNING *`,
    [storyId, pageNumber, text]
  );
  return result.rows[0];
}

// update page text or number
export async function updatePage(pageId, fields) {
  const { page_number, text } = fields;
  const result = await db.query(
    `UPDATE pages
     SET page_number = COALESCE($1, page_number),
         text = COALESCE($2, text)
     WHERE id = $3
     RETURNING *`,
    [page_number, text, pageId]
  );
  return result.rows[0];
}

// delete page
export async function deletePage(pageId) {
  const result = await db.query(
    `DELETE FROM pages WHERE id = $1 RETURNING *`,
    [pageId]
  );
  return result.rows[0];
}
