// db/queries/options.js
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

// update option text
export async function updateOption(optionId, optionText) {
  const result = await db.query(
    `UPDATE options
     SET option_text = $1
     WHERE id = $2
     RETURNING *`,
    [optionText, optionId]
  );
  return result.rows[0];
}

// delete option
export async function deleteOption(optionId) {
  const result = await db.query(
    `DELETE FROM options
     WHERE id = $1
     RETURNING *`,
    [optionId]
  );
  return result.rows[0];
}
