// api/stories.js
import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createStoryWithPages,
  getStoriesByUser,
  getStoryById,
  updateStory,
  deleteStory,
} from "#db/queries/stories";

const router = Router();

// create new story (with pages + options)
router.post("/", requireUser, async (req, res) => {
  try {
    const { title, topic, pages } = req.body;

    if (!title || !topic || !pages) {
      return res.status(400).json({ error: "title, topic, and pages required" });
    }

    const storyId = await createStoryWithPages(req.user.id, title, topic, pages);
    res.json({ message: "Story saved", storyId });
  } catch (err) {
    console.error("Error creating story:", err);
    res.status(500).json({ error: "Failed to create story" });
  }
});

// get all stories for user
router.get("/", requireUser, async (req, res) => {
  try {
    const stories = await getStoriesByUser(req.user.id);
    res.json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// get single story
router.get("/:id", requireUser, async (req, res) => {
  try {
    const story = await getStoryById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
  } catch (err) {
    console.error("Error fetching story:", err);
    res.status(500).json({ error: "Failed to fetch story" });
  }
});

// update story
router.put(
  "/:id",
  requireUser,
  requireBody(["title", "topic"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, topic } = req.body;

      const story = await updateStory(id, title, topic);
      if (!story) return res.status(404).json({ error: "Story not found" });

      res.json(story);
    } catch (err) {
      console.error("Error updating story:", err);
      res.status(500).json({ error: "Failed to update story" });
    }
  }
);

// delete story
router.delete("/:id", requireUser, async (req, res) => {
  try {
    const story = await deleteStory(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });

    res.json({ message: "Story deleted", story });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ error: "Failed to delete story" });
  }
});

export default router;
