import { Router } from "express";
import {
  getStoriesByUser,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from "#db/queries/stories";
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

// create a new story with optional pages/options
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { title, topic, pages } = req.body;
    if (!title || !topic || !pages) {
      return res.status(400).json({ error: "title, topic, and pages required" });
    }

    const story = await createStory(req.user.id, title, topic);

    for (const p of pages) {
      const page = await createPage(story.id, p.page_number, p.text);
      if (p.options?.length) {
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

// update story
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { title, topic } = req.body;
    const story = await updateStory(req.params.id, req.user.id, title, topic);
    res.json(story);
  } catch (err) {
    next(err);
  }
});

// delete story
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    await deleteStory(req.params.id, req.user.id);
    res.json({ message: "Story deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
