import { Router } from "express";
import { getStoriesByUser, getStoryById, createStory } from "#db/queries/stories";
import { createPage } from "#db/queries/pages";
import { createOption } from "#db/queries/options";
import requireUser from "#middleware/requireUser";

const router = Router();

// list all stories for logged in user
router.get("/", requireUser, async (req, res, next) => {
  try {
    const stories = await getStoriesByUser(req.user.id);
    res.json(stories);
  } catch (err) {
    next(err);
  }
});

// get a single story by id
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const story = await getStoryById(req.params.id);
    res.json(story);
  } catch (err) {
    next(err);
  }
});

// save a full story (title + topic + all pages + options)
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { title, topic, pages } = req.body;
    if (!title || !topic || !pages) {
      return res.status(400).json({ error: "title, topic, and pages required" });
    }

    const story = await createStory(req.user.id, title, topic);

    // loop through pages and save each one
    for (const p of pages) {
      const page = await createPage(story.id, p.page_number, p.text);

      // add options for each page
      if (p.options && p.options.length > 0) {
        for (const opt of p.options) {
          await createOption(page.id, opt);
        }
      }
    }

    res.status(201).json({ message: "Story saved", storyId: story.id });
  } catch (err) {
    next(err);
  }
});

export default router;
