// routes/stories.js
import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import {
  getStoriesByUser,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from "#db/queries/stories.js";

const router = Router();

// GET /stories
router.get("/", requireUser, async (req, res, next) => {
  try {
    const stories = await getStoriesByUser(req.user.id);
    res.json(stories);
  } catch (err) {
    next(err);
  }
});

// GET /stories/:id
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const story = await getStoryById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
  } catch (err) {
    next(err);
  }
});

// POST /stories
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { title, topic } = req.body;
    if (!title || !topic) {
      return res.status(400).json({ error: "title and topic required" });
    }
    const story = await createStory(req.user.id, title, topic);
    res.json({ message: "Story saved", storyId: story.id });
  } catch (err) {
    next(err);
  }
});

// PUT /stories/:id
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { title, topic } = req.body;
    const updated = await updateStory(req.params.id, req.user.id, title, topic);
    if (!updated) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /stories/:id
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deleteStory(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
