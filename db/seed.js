import db from "#db/client";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // test user
  const user = await createUser("foo", "bar");

  // just one sample story so we have data to fetch
  const storyResult = await db.query(
    `INSERT INTO stories (user_id, title, topic) 
     VALUES ($1, $2, $3) RETURNING *`,
    [user.id, "Sample Story", "testing"]
  );
  const story = storyResult.rows[0];

  // starter page
  const pageResult = await db.query(
    `INSERT INTO pages (story_id, page_number, text)
     VALUES ($1, $2, $3) RETURNING *`,
    [story.id, 1, "This is the start of a test story."]
  );
  const page = pageResult.rows[0];

  // choices
  await db.query(
    `INSERT INTO options (page_id, option_text) VALUES ($1, $2), ($1, $3)`,
    [page.id, "Option A: go explore the forest.", "Option B: walk back home."]
  );

  console.log("Seeded user + sample story with one page and options.");
}
