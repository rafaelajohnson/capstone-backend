// routes/pages.js
import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import {
  createPage,
  updatePage,
  deletePage,
  getPageById,
  getPagesByStory,
} from "#db/queries/pages.js";

const router = Router();

// GET /pages/:id
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const page = await getPageById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// GET /stories/:storyId/pages
router.get("/story/:storyId", requireUser, async (req, res, next) => {
  try {
    const pages = await getPagesByStory(req.params.storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// POST /pages
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { storyId, page_number, text } = req.body;
    const page = await createPage(storyId, page_number, text);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// PUT /pages/:id
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { text } = req.body;
    const updated = await updatePage(req.params.id, text);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /pages/:id
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deletePage(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
