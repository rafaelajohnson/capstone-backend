// routes/pages.js
import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import {
  createPage,
  updatePage,
  deletePage,
  getPageById,
  getPagesByStory
} from "#db/queries/pages";

const router = express.Router();

// get all pages for a story
router.get("/stories/:storyId/pages", requireUser, async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const pages = await getPagesByStory(storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// create a page
router.post("/pages", requireUser, async (req, res, next) => {
  try {
    const { storyId, page_number, text } = req.body;
    const page = await createPage(storyId, page_number, text);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// get page by id
router.get("/pages/:id", requireUser, async (req, res, next) => {
  try {
    const page = await getPageById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// update page
router.put("/pages/:id", requireUser, async (req, res, next) => {
  try {
    const { text } = req.body;
    const page = await updatePage(req.params.id, text);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// delete page
router.delete("/pages/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deletePage(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
