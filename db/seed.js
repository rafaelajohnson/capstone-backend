
import db from "#db/client";
import { createUser } from "#db/queries/users";

async function seed() {
  try {
    await db.connect();

    // test user
    const user = await createUser("foo", "bar");

    // sample story
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

    // three branching options
    await db.query(
      `INSERT INTO options (page_id, option_text) 
       VALUES ($1, $2), ($1, $3), ($1, $4)`,
      [
        page.id,
        "Option A: The hero walks into the forest.",
        "Option B: The hero meets a turtle.",
        "Option C: The hero crashes into a tree."
      ]
    );

    console.log("Database seeded with user + sample story + page + options.");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await db.end();
  }
}

seed();
