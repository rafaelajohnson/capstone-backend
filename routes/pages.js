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

// Create a new page
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

// Get all pages for a story
router.get("/:storyId", requireUser, async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const pages = await getPagesByStory(storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// Update a page
router.put("/:pageId", requireUser, async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { text } = req.body;
    const updated = await updatePage(pageId, text);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a page
router.delete("/:pageId", requireUser, async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const deleted = await deletePage(pageId);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
