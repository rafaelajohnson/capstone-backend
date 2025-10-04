// routes/stories.js
import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  getStoriesByUser,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from "../db/queries/stories.js";

const router = express.Router();

// Get all stories for logged-in user
router.get("/", requireUser, async (req, res, next) => {
  try {
    const stories = await getStoriesByUser(req.user.id);
    res.json(stories);
  } catch (err) {
    next(err);
  }
});

// Get single story by ID
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const story = await getStoryById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
  } catch (err) {
    next(err);
  }
});

// Create story
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { title, topic, pages } = req.body;
    if (!title || !topic || !pages) {
      return res.status(400).json({ error: "title, topic, and pages required" });
    }
    const story = await createStory(req.user.id, title, topic);
    res.status(201).json({ message: "Story saved", storyId: story.id });
  } catch (err) {
    next(err);
  }
});

// Update story
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { title, topic } = req.body;
    const updated = await updateStory(req.params.id, req.user.id, title, topic);
    if (!updated) return res.status(404).json({ error: "Not found or not yours" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete story
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deleteStory(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: "Not found or not yours" });
    res.json({ message: "Story deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
