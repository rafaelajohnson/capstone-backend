import db from "#db/client";

// get options for a page
export async function getOptionsByPage(pageId) {
  const result = await db.query(
    `SELECT * FROM options WHERE page_id = $1`,
    [pageId]
  );
  return result.rows;
}

// add option to a page
export async function createOption(pageId, optionText) {
  const result = await db.query(
    `INSERT INTO options (page_id, option_text) 
     VALUES ($1, $2) RETURNING *`,
    [pageId, optionText]
  );
  return result.rows[0];
}
