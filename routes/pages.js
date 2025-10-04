// routes/pages.js
import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  createPage,
  updatePage,
  deletePage,
  getPagesByStory,
} from "../db/queries/pages.js";

const router = express.Router();

// Get pages for a story
router.get("/:storyId/pages", requireUser, async (req, res, next) => {
  try {
    const pages = await getPagesByStory(req.params.storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// Create page
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { storyId, page_number, text } = req.body;
    if (!storyId || !page_number || !text) {
      return res.status(400).json({ error: "storyId, page_number, and text required" });
    }
    const page = await createPage(storyId, page_number, text);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// Update page
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { text } = req.body;
    const updated = await updatePage(req.params.id, text);
    if (!updated) return res.status(404).json({ error: "Page not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete page
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deletePage(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Page not found" });
    res.json({ message: "Page deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
