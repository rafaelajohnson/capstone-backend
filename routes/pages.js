// routes/pages.js
import { Router } from "express";
import { createPage, updatePage, deletePage, getPagesByStory } from "#db/queries/pages";
import requireUser from "#middleware/requireUser";

const router = Router();

// get all pages for a story
router.get("/:storyId", requireUser, async (req, res, next) => {
  try {
    const pages = await getPagesByStory(req.params.storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// create a new page for a story
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { storyId, page_number, text } = req.body;
    if (!storyId || !page_number || !text) {
      return res.status(400).json({ error: "storyId, page_number, text required" });
    }

    const page = await createPage(storyId, page_number, text);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// update page text
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { text } = req.body;
    const page = await updatePage(req.params.id, text);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// delete page
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deletePage(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
